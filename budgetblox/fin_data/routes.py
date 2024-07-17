from flask import Blueprint, app, jsonify, render_template, redirect, url_for, flash, request, current_app, session
from flask_login import login_required, current_user
from budgetblox import db
from budgetblox.models import Income, Expense, Investment, Project, Savings
from budgetblox.fin_data.forms import IncomeForm, ExpenseForm, InvestmentsForm, ProjectForm, SavingsForm, UpdateProjectForm
from datetime import datetime
from sqlalchemy.orm import joinedload
from budgetblox.currency_utils import get_currency_symbol, format_currency
import traceback

finData = Blueprint('finData', __name__)

@finData.route("/dashboard")
@login_required
def dashboard():
    current_project = Project.query.get(session.get('selected_project_id'))
    if current_project is None:
        current_project = Project.query.filter_by(owner=current_user).first()
        if current_project:
            session['selected_project_id'] = current_project.id
        else:
            current_app.logger.error(f"No projects found for user: {current_user.id}")
            return render_template('404.html'), 404

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
    savings_form = SavingsForm()
    investments_form = InvestmentsForm()
    
    if income_form.validate_on_submit():
        income = Income(
            title_income=income_form.title_income.data,
            amount_income=income_form.amount_income.data,
            date_income=income_form.date_income.data,
            project_id=current_project.id
        )
        db.session.add(income)
        db.session.commit()
        flash('Income added successfully!', 'success')
        return redirect(url_for('finData.cash_income'))

    if expense_form.validate_on_submit():
        expense = Expense(
            title_expense=expense_form.title_expense.data,
            amount_expense=expense_form.amount_expense.data,
            date_expense=expense_form.date_expense.data,
            project_id=current_project.id
        )
        db.session.add(expense)
        db.session.commit()
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return jsonify({
                'success': True,
                'expense': {
                    'title_expense': expense.title_expense,
                    'amount_expense': format_currency(expense.amount_expense, current_project.currency),
                    'date_expense': expense.date_expense.strftime('%Y-%m-%d')
                }
            })
        flash('Expense added successfully!', 'success')
        return redirect(url_for('finData.cash_income'))

    
    if savings_form.validate_on_submit():
        savings = Savings(
            title_savings=savings_form.title_savings.data,
            amount_savings=savings_form.amount_savings.data,
            date_savings=savings_form.date_savings.data,
            project_id=current_project.id
        )
        db.session.add(savings)
        db.session.commit()
        flash('Savings added successfully!', 'success')
        return redirect(url_for('finData.cash_income'))

    if investments_form.validate_on_submit():
        investment = Investment(
            stock=investments_form.stock.data,
            amount_investment=investments_form.amount_investment.data,
            date_investment=investments_form.date_investment.data,
            project_id=current_project.id
        )
        db.session.add(investment)
        db.session.commit()
        flash('Investment added successfully!', 'success')
        return redirect(url_for('finData.cash_income'))
    
    incomes = Income.query.filter_by(project_id=current_project.id).all()
    expenses = Expense.query.filter_by(project_id=current_project.id).order_by(Expense.date_expense.desc()).all()
    savings = Savings.query.filter_by(project_id=current_project.id).order_by(Savings.date_savings.desc()).all()
    investments = Investment.query.filter_by(project_id=current_project.id).order_by(Investment.date_investment.desc()).all()


    return render_template('cashflow.html', 
                           title='Cash', 
                           income_form=income_form, 
                           expense_form=expense_form,
                           savings_form=savings_form,
                           investments_form=investments_form,
                           incomes=incomes, 
                           expenses=expenses,
                           savings=savings,
                           investments=investments,
                           project=current_project)


@finData.context_processor
def inject_project_info():
    if current_user.is_authenticated:
        projects = Project.query.filter_by(owner=current_user).all()
        selected_project_id = session.get('selected_project_id')
        current_project = next((p for p in projects if p.id == selected_project_id), projects[0] if projects else None)
        return dict(projects=projects, current_project=current_project)
    return dict()

@finData.context_processor
def utility_processor():
    return dict(get_currency_symbol=get_currency_symbol)


@finData.route("/create_project", methods=['GET', 'POST'])
@login_required
def create_project():
    form = ProjectForm()
    if form.validate_on_submit():
        project = Project(name=form.name.data, currency=form.currency.data, owner=current_user)
        db.session.add(project)
        db.session.commit()
        session['selected_project_id'] = project.id
        flash('Your project has been created!', 'success')
        return redirect(url_for('finData.dashboard'))
    projects = Project.query.filter_by(owner=current_user).all()
    return render_template('create_project.html', title='Create Project', form=form, projects=projects)

@finData.route("/select_project/<int:project_id>")
@login_required
def select_project(project_id):
    project = Project.query.get_or_404(project_id)
    if project.owner == current_user:
        session['selected_project_id'] = project_id
        flash(f'Switched to project: {project.name}', 'success')
    return redirect(request.referrer or url_for('finData.dashboard'))

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
            Income.query.filter_by(project_id=project.id).delete()
            Expense.query.filter_by(project_id=project.id).delete()
            db.session.delete(project)
            db.session.commit()
            flash(f'Project "{project.name}" and all associated data have been deleted.', 'success')
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

from flask import jsonify, request, flash, redirect, url_for, render_template



@finData.route("/update_project/<int:project_id>", methods=['POST'])
@login_required
def update_project(project_id):
    project = db.session.get(Project, project_id)
    if project and project.owner == current_user:
        form = UpdateProjectForm(obj=project)
        if form.validate_on_submit():
            project.name = form.name.data
            project.currency = form.currency.data
            db.session.commit()
            
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return jsonify({
                    'success': True,
                    'name': project.name,
                    'currency': project.currency,
                    'currency_symbol': get_currency_symbol(project.currency)
                })
            else:
                flash(f'Project "{project.name}" has been updated.', 'success')
        else:
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return jsonify({
                    'success': False,
                    'error': form.errors
                })
            else:
                flash(f'Failed to update project. Errors: {form.errors}', 'danger')
    else:
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return jsonify({
                'success': False,
                'error': 'Project not found or unauthorized action'
            })
        else:
            flash('Project not found or unauthorized action.', 'danger')
    
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return jsonify({'success': False, 'error': 'Unknown error occurred'})
    else:
        return redirect(url_for('finData.create_project'))
    


@finData.route("/api/financial_data")
@login_required
def get_financial_data():
    try:
        project_id = session.get('selected_project_id')
        
        if not project_id:
            return jsonify({'error': 'No project selected'}), 400
        
        project = Project.query.get(project_id)
        if not project:
            return jsonify({'error': 'Project not found'}), 404
        
        incomes = Income.query.filter_by(project_id=project_id).all()
        expenses = Expense.query.filter_by(project_id=project_id).all()
        savings = Savings.query.filter_by(project_id=project_id).all()
        investments = Investment.query.filter_by(project_id=project_id).all()
        
        total_income = sum(income.amount_income for income in incomes)
        total_expenses = sum(expense.amount_expense for expense in expenses)
        total_savings = sum(saving.amount_savings for saving in savings)
        total_investments = sum(investment.amount_investment for investment in investments)
        
        total_allocation = total_expenses + total_savings + total_investments
        net_cash_flow = total_income - total_allocation

        data = {
            'totalIncome': format_currency(total_income, project.currency),
            'totalAllocation': format_currency(total_allocation, project.currency),
            'totalExpenses': format_currency(total_expenses, project.currency),
            'totalSavings': format_currency(total_savings, project.currency),
            'totalInvestments': format_currency(total_investments, project.currency),
            'netCashFlow': format_currency(net_cash_flow, project.currency),
            'incomes': [income.to_dict() for income in incomes],
            'expenses': [expense.to_dict() for expense in expenses],
            'savings': [saving.to_dict() for saving in savings],
            'investments': [investment.to_dict() for investment in investments]
        }
        
        return jsonify(data)
    
    except Exception as e:
        current_app.logger.error(f"Error in get_financial_data: {str(e)}")
        current_app.logger.error(traceback.format_exc())
        return jsonify({"error": "Internal server error"}), 500
    


@finData.route("/delete_income/<int:record_id>", methods=['POST'])
@login_required
def delete_income(record_id):
    try:
        income = Income.query.get_or_404(record_id)
        if income.project.owner != current_user:
            return jsonify({'success': False, 'error': 'Unauthorized'}), 403
        db.session.delete(income)
        db.session.commit()
        return jsonify({'success': True})
    except Exception as e:
        current_app.logger.error(f"Error in get_financial_data: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@finData.route("/delete_expense/<int:record_id>", methods=['POST'])
@login_required
def delete_expense(record_id):
    expense = Expense.query.get_or_404(record_id)
    if expense.project.owner != current_user:
        return jsonify({'success': False, 'error': 'Unauthorized'}), 403
    db.session.delete(expense)
    db.session.commit()
    return jsonify({'success': True})

@finData.route("/delete_savings/<int:record_id>", methods=['POST'])
@login_required
def delete_savings(record_id):
    savings = Savings.query.get_or_404(record_id)
    if savings.project.owner != current_user:
        return jsonify({'success': False, 'error': 'Unauthorized'}), 403
    db.session.delete(savings)
    db.session.commit()
    return jsonify({'success': True})

@finData.route("/delete_investment/<int:record_id>", methods=['POST'])
@login_required
def delete_investment(record_id):
    investment = Investment.query.get_or_404(record_id)
    if investment.project.owner != current_user:
        return jsonify({'success': False, 'error': 'Unauthorized'}), 403
    db.session.delete(investment)
    db.session.commit()
    return jsonify({'success': True})