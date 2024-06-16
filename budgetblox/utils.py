# budgetblox/utils.py

from babel.numbers import format_currency as babel_format_currency

def format_currency(amount, currency_code):
    return babel_format_currency(amount, currency_code)
