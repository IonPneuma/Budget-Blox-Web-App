from flask import Blueprint, render_template, url_for, redirect
from flask_login import current_user
from budgetblox.models import Project

main = Blueprint('main', __name__)

@main.route("/")
def home():
    if current_user.is_authenticated:
        first_project = Project.query.filter_by(owner=current_user).first()
        return redirect(url_for('finData.dashboard', project_id=first_project.id if first_project else 1))
    return redirect(url_for('users.register'))

@main.route("/about")
def about():
    return render_template('about.html', title='About')
