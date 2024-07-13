from flask_wtf import FlaskForm
from wtforms import StringField, DecimalField, SelectField, SubmitField, DateField
from wtforms.validators import DataRequired
from budgetblox.currency_utils import get_currency_symbol


class ProjectForm(FlaskForm):
    name = StringField('Project Name', validators=[DataRequired()])
    currency = SelectField('Currency', choices=[
        ('GBP', f'{get_currency_symbol("GBP")} GBP - Pound Sterling'),
        ('USD', f'{get_currency_symbol("USD")} USD - United States Dollar'),
        ('EUR', f'{get_currency_symbol("EUR")} EUR - Euro'),
        ('CNY', f'{get_currency_symbol("CNY")} CNY - China Renminbi'),
        ('JPY', f'{get_currency_symbol("JPY")} JPY - Japanese Yen'),
        ('BTC', f'{get_currency_symbol("BTC")} BTC - Bitcoin'),
        ('INR', f'{get_currency_symbol("INR")} INR - Indian Rupee'),
        ('RUB', f'{get_currency_symbol("RUB")} RUB - Russian Rouble'),
        ('SGD', f'{get_currency_symbol("SGD")} SGD - Singapore Dollar'),
        ('KRW', f'{get_currency_symbol("KRW")} KRW - South Korean Won'),
        ('VND', f'{get_currency_symbol("VND")} VND - Vietnamese Đồng'),
        ('AUD', f'{get_currency_symbol("AUD")} AUD - Australian Dollar'),
        ('CAD', f'{get_currency_symbol("CAD")} CAD - Canadian Dollar'),
        ('ILS', f'{get_currency_symbol("ILS")} ILS - Israeli New Shekel'),
        ('NGN', f'{get_currency_symbol("NGN")} NGN - Nigerian Naira'),
        ('DKK', f'{get_currency_symbol("DKK")} DKK - Danish Krone'),
        ('ETB', f'{get_currency_symbol("ETB")} ETB - Ethiopian Birr'),
        ('TRY', f'{get_currency_symbol("TRY")} TRY - Turkish Lira'),
        ('DZD', f'{get_currency_symbol("DZD")} DZD - Algerian Dinar'),
        ('MRU', f'{get_currency_symbol("MRU")} MRU - Mauritanian Ouguiya'),
        ('MAD', f'{get_currency_symbol("MAD")} MAD - Moroccan Dirham'),
        ('JOD', f'{get_currency_symbol("JOD")} JOD - Jordanian Dinar'),
        ('XCD', f'{get_currency_symbol("XCD")} XCD - Eastern Caribbean Dollar'),
        ('GHS', f'{get_currency_symbol("GHS")} GHS - Ghanaian Cedi'),
        ('BND', f'{get_currency_symbol("BND")} BND - Brunei Dollar'),
        ('HKD', f'{get_currency_symbol("HKD")} HKD - Hong Kong Dollar'),
        ('CHF', f'{get_currency_symbol("CHF")} CHF - Swiss Franc'),
        ('ANG', f'{get_currency_symbol("ANG")} ANG - Netherlands Antillean Guilder'),
        ('SHP', f'{get_currency_symbol("SHP")} SHP - Saint Helena Pound'),
        ('FKP', f'{get_currency_symbol("FKP")} FKP - Falkland Islands Pound')], validators=[DataRequired()])
    submit = SubmitField('Create Project')

class SelectProjectForm(FlaskForm):
    project = SelectField('Select Project', coerce=int, choices=[])
    submit = SubmitField('Select')

class IncomeForm(FlaskForm):
    title_income = StringField('Source', validators=[DataRequired()])
    amount_income = DecimalField('Amount', validators=[DataRequired()])
    date_income = DateField('Date', format='%Y-%m-%d', validators=[DataRequired()])
    submit_income = SubmitField('Add')

class ExpenseForm(FlaskForm):
    title_expense = StringField('Source', validators=[DataRequired()])
    amount_expense = DecimalField('Amount', validators=[DataRequired()])
    date_expense = DateField('Date', format='%Y-%m-%d', validators=[DataRequired()]) 
    submit_expense = SubmitField('Add')

class SavingsForm(FlaskForm):
    title_savings = StringField('Source', validators=[DataRequired()])
    amount_savings = DecimalField('Amount', validators=[DataRequired()])
    date_savings = DateField('Date', format='%Y-%m-%d', validators=[DataRequired()])
    submit_savings = SubmitField('Add')

class InvestmentsForm(FlaskForm):
    stock = SelectField('Stock', choices=[('AAPL', 'Apple'), ('GOOGL', 'Google'), ('MSFT', 'Microsoft')], validators=[DataRequired()])
    amount_investment = DecimalField('Amount', validators=[DataRequired()])
    date_investment = DateField('Date', format='%Y-%m-%d', validators=[DataRequired()])
    submit_investment = SubmitField('Add')

class UpdateProjectForm(FlaskForm):
    name = StringField('Project Name', validators=[DataRequired()])
    currency = SelectField('Currency', choices=[
        ('GBP', f'{get_currency_symbol("GBP")} GBP - Pound Sterling'),
        ('USD', f'{get_currency_symbol("USD")} USD - United States Dollar'),
        ('EUR', f'{get_currency_symbol("EUR")} EUR - Euro'),
        ('CNY', f'{get_currency_symbol("CNY")} CNY - China Renminbi'),
        ('JPY', f'{get_currency_symbol("JPY")} JPY - Japanese Yen'),
        ('BTC', f'{get_currency_symbol("BTC")} BTC - Bitcoin'),
        ('INR', f'{get_currency_symbol("INR")} INR - Indian Rupee'),
        ('RUB', f'{get_currency_symbol("RUB")} RUB - Russian Rouble'),
        ('SGD', f'{get_currency_symbol("SGD")} SGD - Singapore Dollar'),
        ('KRW', f'{get_currency_symbol("KRW")} KRW - South Korean Won'),
        ('VND', f'{get_currency_symbol("VND")} VND - Vietnamese Đồng'),
        ('AUD', f'{get_currency_symbol("AUD")} AUD - Australian Dollar'),
        ('CAD', f'{get_currency_symbol("CAD")} CAD - Canadian Dollar'),
        ('ILS', f'{get_currency_symbol("ILS")} ILS - Israeli New Shekel'),
        ('NGN', f'{get_currency_symbol("NGN")} NGN - Nigerian Naira'),
        ('DKK', f'{get_currency_symbol("DKK")} DKK - Danish Krone'),
        ('ETB', f'{get_currency_symbol("ETB")} ETB - Ethiopian Birr'),
        ('TRY', f'{get_currency_symbol("TRY")} TRY - Turkish Lira'),
        ('DZD', f'{get_currency_symbol("DZD")} DZD - Algerian Dinar'),
        ('MRU', f'{get_currency_symbol("MRU")} MRU - Mauritanian Ouguiya'),
        ('MAD', f'{get_currency_symbol("MAD")} MAD - Moroccan Dirham'),
        ('JOD', f'{get_currency_symbol("JOD")} JOD - Jordanian Dinar'),
        ('XCD', f'{get_currency_symbol("XCD")} XCD - Eastern Caribbean Dollar'),
        ('GHS', f'{get_currency_symbol("GHS")} GHS - Ghanaian Cedi'),
        ('BND', f'{get_currency_symbol("BND")} BND - Brunei Dollar'),
        ('HKD', f'{get_currency_symbol("HKD")} HKD - Hong Kong Dollar'),
        ('CHF', f'{get_currency_symbol("CHF")} CHF - Swiss Franc'),
        ('ANG', f'{get_currency_symbol("ANG")} ANG - Netherlands Antillean Guilder'),
        ('SHP', f'{get_currency_symbol("SHP")} SHP - Saint Helena Pound'),
        ('FKP', f'{get_currency_symbol("FKP")} FKP - Falkland Islands Pound')], validators=[DataRequired()])
    submit = SubmitField('Update Project')


