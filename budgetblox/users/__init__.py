from flask import Blueprint

users = Blueprint('users', __name__)

from budgetblox.users import routes
