from flask import Blueprint, jsonify, render_template, redirect, url_for, flash, g, request, current_app, session
from budgetblox import db
from flask_login import login_user, current_user, logout_user, login_required
from budgetblox.models import Income, Expense, Project
from budgetblox.fin_data.forms import IncomeForm, ExpenseForm, SelectProjectForm, ProjectForm, UpdateProjectForm
from datetime import datetime, date
from collections import defaultdict

finData = Blueprint('finData', __name__)

@finData.route("/dashboard")
@login_required
def dashboard():
    current_project = Project.query.get(session.get('selected_project_id'))
    if current_project is None:
        # If no project is selected, get the first project of the user
        current_project = Project.query.filter_by(owner=current_user).first()
        if current_project:
            session['selected_project_id'] = current_project.id
        else:
            current_app.logger.error(f"No projects found for user: {current_user.id}")
            return render_template('404.html'), 404

    current_app.logger.info(f"Dashboard route accessed with project_id: {current_project.id}")
    projects = Project.query.filter_by(owner=current_user).all()
    return render_template('dashboard.html', title='Dashboard', project=current_project, projects=projects)

@finData.route("/cashflow", methods=['GET', 'POST'])
@login_required
def cash_income():
    current_project = Project.query.get(session.get('selected_project_id'))
    if not current_project:
        flash('Please select a project first.', 'warning')
        return redirect(url_for('finData.dashboard'))

    income_form = IncomeForm()
    expense_form = ExpenseForm()
    
    if income_form.validate_on_submit():
        new_income = Income(
            title_income=income_form.title_income.data,
            amount_income=income_form.amount_income.data,
            date_income=income_form.date_income.data,
            project_id=current_project.id,
            currency=income_form.currency.data
        )
        db.session.add(new_income)
        db.session.commit()
        flash('Income added successfully!', 'success')
        return redirect(url_for('finData.cash_income'))

    if expense_form.validate_on_submit():
        expense = Expense(
            title_expense=expense_form.title_expense.data,
            amount_expense=expense_form.amount_expense.data,
            date_expense=expense_form.date_expense.data,
            project_id=current_project.id,  # Changed from g.current_project.id
            currency=expense_form.currency.data
        )
        db.session.add(expense)
        db.session.commit()
        flash('Expense added successfully!', 'success')
        return redirect(url_for('finData.cash_income'))

    incomes = Income.query.filter_by(project_id=current_project.id).all()  # Changed from g.current_project.id
    expenses = Expense.query.filter_by(project_id=current_project.id).all()  # Changed from g.current_project.id

    income_data = [income.to_dict() for income in incomes]
    expense_data = [expense.to_dict() for expense in expenses]

    return render_template('cashflow.html', 
                           title='Cash', 
                           income_form=income_form, 
                           expense_form=expense_form, 
                           incomes=income_data, 
                           expenses=expense_data,
                           project=current_project)

@finData.context_processor
def inject_project_info():
    if current_user.is_authenticated:
        projects = Project.query.filter_by(owner=current_user).all()
        selected_project_id = session.get('selected_project_id')
        current_project = next((p for p in projects if p.id == selected_project_id), projects[0] if projects else None)
        return dict(projects=projects, current_project=current_project)
    return dict()



@finData.route("/create_project", methods=['GET', 'POST'])
@login_required
def create_project():
    form = ProjectForm()
    if form.validate_on_submit():
        project = Project(name=form.name.data, owner=current_user)
        db.session.add(project)
        db.session.commit()
        session['selected_project_id'] = project.id  # Set the new project as current
        flash('Your project has been created!', 'success')
        return redirect(url_for('finData.dashboard'))
    projects = Project.query.filter_by(owner=current_user).all()  # Fetch all projects for the current user
    return render_template('create_project.html', title='Create Project', form=form, projects=projects)



@finData.route("/select_project/<int:project_id>")
@login_required
def select_project(project_id):
    project = Project.query.get_or_404(project_id)
    if project.owner == current_user:
        session['selected_project_id'] = project_id
        flash(f'Switched to project: {project.name}', 'success')
    return redirect(request.referrer or url_for('finData.dashboard'))



from flask import flash, redirect, url_for
from flask_login import login_required, current_user
from sqlalchemy.orm import joinedload
from budgetblox import db
from budgetblox.models import Project, Income, Expense

@finData.route("/delete_project/<int:project_id>", methods=['POST'])
@login_required
def delete_project(project_id):
    project = Project.query.options(
        joinedload(Project.incomes),
        joinedload(Project.expenses)
    ).get(project_id)
    
    user_projects = Project.query.filter_by(owner=current_user).all()

    if len(user_projects) <= 1:
        flash('You must have at least one project.', 'danger')
    elif project and project.owner == current_user:
        try:
            # Delete associated incomes and expenses
            Income.query.filter_by(project_id=project.id).delete()
            Expense.query.filter_by(project_id=project.id).delete()

            # Delete the project
            db.session.delete(project)
            db.session.commit()

            flash(f'Project "{project.name}" and all associated data have been deleted.', 'success')

            # Set a new current project if the deleted project was the current one
            if session.get('selected_project_id') == project_id:
                new_current_project = Project.query.filter_by(owner=current_user).first()
                if new_current_project:
                    session['selected_project_id'] = new_current_project.id
        except Exception as e:
            db.session.rollback()
            flash(f'An error occurred while deleting the project: {str(e)}', 'danger')
    else:
        flash('Project not found or unauthorized action.', 'danger')
    
    return redirect(url_for('finData.create_project'))



@finData.route("/update_project/<int:project_id>", methods=['POST'])
@login_required
def update_project(project_id):
    project = db.session.get(Project, project_id)
    if project and project.owner == current_user:
        form = UpdateProjectForm()
        if form.validate_on_submit():
            project.name = form.name.data
            db.session.commit()
            flash(f'Project "{project.name}" has been updated.', 'success')
        else:
            flash('Failed to update project. Please try again.', 'danger')
    else:
        flash('Project not found or unauthorized action.', 'danger')
    return redirect(url_for('finData.create_project'))




@finData.route("/api/financial_data")
@login_required
def get_financial_data():
    currency = request.args.get('currency', 'EUR')
    project_id = session.get('selected_project_id')
    
    incomes = Income.query.filter_by(project_id=project_id).all()
    expenses = Expense.query.filter_by(project_id=project_id).all()
    
    # Process data for charts
    dates = sorted(set([income.date_income for income in incomes] + [expense.date_expense for expense in expenses]))
    income_data = defaultdict(float)
    expense_data = defaultdict(float)
    income_distribution = defaultdict(float)
    expense_distribution = defaultdict(float)
    monthly_income = defaultdict(float)
    monthly_expense = defaultdict(float)
    
    for income in incomes:
        income_amount = convert_currency(income.amount_income, income.currency, currency)
        income_data[income.date_income] += income_amount
        income_distribution[income.title_income] += income_amount
        monthly_income[income.date_income.strftime('%Y-%m')] += income_amount
    
    for expense in expenses:
        expense_amount = convert_currency(expense.amount_expense, expense.currency, currency)
        expense_data[expense.date_expense] += expense_amount
        expense_distribution[expense.title_expense] += expense_amount
        monthly_expense[expense.date_expense.strftime('%Y-%m')] += expense_amount
    
    total_income = sum(income_data.values())
    total_expenses = sum(expense_data.values())
    
    return jsonify({
        'dates': [date.strftime('%Y-%m-%d') for date in dates],
        'incomes': [income_data[date] for date in dates],
        'expenses': [expense_data[date] for date in dates],
        'totalIncome': f"{currency} {total_income:.2f}",
        'totalExpenses': f"{currency} {total_expenses:.2f}",
        'netCashFlow': f"{currency} {(total_income - total_expenses):.2f}",
        'incomeDistribution': {
            'labels': list(income_distribution.keys()),
            'values': list(income_distribution.values())
        },
        'expenseDistribution': {
            'labels': list(expense_distribution.keys()),
            'values': list(expense_distribution.values())
        },
        'months': sorted(set(monthly_income.keys()).union(monthly_expense.keys())),
        'monthlyIncomes': [monthly_income[month] for month in sorted(set(monthly_income.keys()).union(monthly_expense.keys()))],
        'monthlyExpenses': [monthly_expense[month] for month in sorted(set(monthly_income.keys()).union(monthly_expense.keys()))]
    })

def convert_currency(amount, from_currency, to_currency):
    # This is a placeholder function. In a real application, you would use
    # up-to-date exchange rates, possibly from an external API.
    exchange_rates = {
        'EUR': 1,    # Base currency
        'USD': 1.12, # 1 EUR = 1.12 USD (example rate)
        'GBP': 0.86, # 1 EUR = 0.86 GBP (example rate)
        # Add more currencies and their exchange rates relative to EUR
    }
    
    if from_currency == to_currency:
        return amount
    
    # Convert to EUR first (if not already in EUR)
    amount_in_eur = amount / exchange_rates[from_currency]
    
    # Then convert from EUR to the target currency
    return amount_in_eur * exchange_rates[to_currency]
