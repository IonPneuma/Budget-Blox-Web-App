from flask import Blueprint, render_template, redirect, url_for, flash, g, request, current_app, session
from budgetblox import db
from flask_login import login_user, current_user, logout_user, login_required
from budgetblox.models import Income, Expense, Project
from budgetblox.fin_data.forms import IncomeForm, ExpenseForm, SelectProjectForm, ProjectForm, UpdateProjectForm
from datetime import datetime, date

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



@finData.route("/delete_project/<int:project_id>", methods=['POST'])
@login_required
def delete_project(project_id):
    project = db.session.get(Project, project_id)
    user_projects = Project.query.filter_by(owner=current_user).all()

    if len(user_projects) <= 1:
        flash('You must have at least one project.', 'danger')
    elif project and project.owner == current_user:
        db.session.delete(project)
        db.session.commit()
        flash(f'Project "{project.name}" has been deleted.', 'success')
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


