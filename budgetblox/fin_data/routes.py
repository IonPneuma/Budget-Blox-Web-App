from flask import Blueprint, render_template, redirect, url_for, flash, g, request, current_app, session
from budgetblox import db
from flask_login import login_user, current_user, logout_user, login_required
from budgetblox.models import Income, Expense, Project
from budgetblox.fin_data.forms import IncomeForm, ExpenseForm, SelectProjectForm, ProjectForm, UpdateProjectForm

finData = Blueprint('finData', __name__)

@finData.route("/dashboard")
@login_required
def dashboard():
    selected_project_id = session.get('selected_project_id')
    if selected_project_id:
        project = db.session.query(Project).filter_by(id=selected_project_id, user_id=current_user.id).first()
        if project is None:
            flash('Project not found or unauthorized action.', 'danger')
            return redirect(url_for('finData.create_project'))
    else:
        project = Project.query.filter_by(owner=current_user).first()
        if project is None:
            flash('No project found. Please create a project.', 'danger')
            return redirect(url_for('finData.create_project'))
        session['selected_project_id'] = project.id

    projects = Project.query.filter_by(owner=current_user).all()
    income_form = IncomeForm()
    expense_form = ExpenseForm()
    return render_template('dashboard.html', title='Dashboard', project=project, projects=projects, income_form=income_form, expense_form=expense_form)

@finData.route("/cashflow/<int:project_id>", methods=['GET', 'POST'])
@login_required
def cash_income(project_id):
    project = Project.query.get_or_404(project_id)
    income_form = IncomeForm()
    expense_form = ExpenseForm()

    # Define the currency choices
    currency_choices = [
        ('€', 'EUR', 'Euro'),
        ('$', 'USD', 'United States dollar'),
        ('$', 'AUD', 'Australian dollar'),
        ('£', 'GBP', 'Sterling'),
        ('$', 'XCD', 'Eastern Caribbean dollar'),
        ('F.CFA', 'XOF', 'West African CFA franc'),
        ('$', 'NZD', 'New Zealand dollar'),
        ('kr', 'NOK', 'Norwegian krone'),
        ('F.CFA', 'XAF', 'Central African CFA franc'),
        ('R', 'ZAR', 'South African rand'),
        ('₣', 'XPF', 'CFP franc'),
        ('$', 'CLP', 'Chilean peso'),
        ('kr', 'DKK', 'Danish krone'),
        ('₹', 'INR', 'Indian rupee'),
        ('₽', 'RUB', 'Russian rouble'),
        ('₺', 'TRY', 'Turkish lira'),
        ('DA', 'DZD', 'Algerian dinar'),
        ('UM', 'MRU', 'Mauritanian ouguiya'),
        ('DH', 'MAD', 'Moroccan dirham'),
        ('₪', 'ILS', 'Israeli new shekel'),
        ('د.أ', 'JOD', 'Jordanian dinar'),
        ('B$', 'BND', 'Brunei dollar'),
        ('S$', 'SGD', 'Singapore dollar'),
        ('元', 'HKD', 'Hong Kong dollar'),
        ('Fr', 'CHF', 'Swiss franc'),
        ('NAƒ', 'ANG', 'Netherlands Antillean guilder'),
        ('£', 'SHP', 'Saint Helena pound'),
        ('£', 'FKP', 'Falkland Islands pound'),
        ('$', 'CAD', 'Canadian Dollar')
        # Add more currencies as needed
    ]
    income_form.currency.choices = currency_choices


    if income_form.validate_on_submit():
        income = Income(
            title_income=income_form.title_income.data,
            amount_income=income_form.amount_income.data,
            date_income=income_form.date_income.data,
            currency=income_form.currency.data,
            project_id=project.id  # Add currency data
        )
        db.session.add(income)
        db.session.commit()
        flash('Income added successfully!', 'success')
        return redirect(url_for('finData.cash_income', project_id=project.id))

    incomes = Income.query.filter_by(project_id=project.id).all()
    expenses = Expense.query.filter_by(project_id=project.id).all()
    return render_template('cashflow.html', title='Cash', income_form=income_form, expense_form=expense_form, incomes=incomes, expenses=expenses, project=project)

@finData.context_processor
def inject_forms():
    if current_user.is_authenticated:
        select_project_form = SelectProjectForm()
        select_project_form.project.choices = [(p.id, p.name) for p in Project.query.filter(Project.owner.has(id=current_user.id)).all()]
        current_project = g.current_project  # Use g.current_project
        return dict(select_project_form=select_project_form, current_project=current_project, projects=current_user.projects)
    return dict(select_project_form=None, current_project=None, projects=None)



@finData.route("/create_project", methods=['GET', 'POST'])
@login_required
def create_project():
    form = ProjectForm()
    if form.validate_on_submit():
        project = Project(name=form.name.data, owner=current_user)
        db.session.add(project)
        db.session.commit()
        flash('Your project has been created!', 'success')
        return redirect(url_for('finData.create_project', project_id=project.id))
    projects = Project.query.filter_by(owner=current_user).all()  # Fetch all projects for the current user
    return render_template('create_project.html', title='Create Project', form=form, projects=projects)

@finData.route("/select_project/<int:project_id>")
@login_required
def select_project(project_id):
    project = db.session.query(Project).filter_by(id=project_id, user_id=current_user.id).first()
    if project and project.owner == current_user:
        session['selected_project_id'] = project.id
        flash(f'Selected project: {project.name}', 'success')
        return redirect(url_for('finData.dashboard', project_id=project.id))
    else:
        flash('Invalid project selection', 'danger')
        first_project = Project.query.filter_by(owner=current_user).first()
        return redirect(url_for('finData.dashboard', project_id=first_project.id if first_project else url_for('finData.create_project')))




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


