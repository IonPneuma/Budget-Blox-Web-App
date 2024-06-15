from flask import Blueprint

finData = Blueprint('finData', __name__)

from budgetblox.fin_data import routes
