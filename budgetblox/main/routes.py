from flask import Blueprint, render_template, url_for, flash, redirect, request
from flask_login import current_user, login_required
from budgetblox.models import Project

main = Blueprint('main', __name__)

@main.route("/")
def home():
    if current_user.is_authenticated:
        first_project = Project.query.filter_by(owner=current_user).first()
        if first_project:
            return redirect(url_for('finData.dashboard', project_id=first_project.id))
        else:
            return redirect(url_for('finData.create_project'))  # Redirect to create project if none exists
    return redirect(url_for('users.login'))

@main.route("/about")
def about():
    return render_template('about.html', title='About')
