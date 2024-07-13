from flask_wtf import FlaskForm
from wtforms import StringField, DecimalField, SelectField, SubmitField, DateField
from wtforms.validators import DataRequired


class ProjectForm(FlaskForm):
    name = StringField('Project Name', validators=[DataRequired()])
    currency = SelectField('Currency', choices=[
        ('GBP', 'GBP £ - Pound Sterling'),
        ('USD', 'USD $ - United States dollar'),
        ('EUR', 'EUR € - Euro'),
        ('CNY', 'CNY ¥ - China Renminbi'),
        ('JPY', 'JPY ¥ - Japanese'),
        ('BTC', 'BTC ₿ - Bitcoin'),
        ('INR', 'INR ₹ - Indian rupee'),
        ('RUB', 'RUB ₽ - Russian rouble'),
        ('SGD', 'SGD $ - Singapore dollar'),
        ('KRW', 'KRW ₩ - South Korean won'),
        ('VND', 'VND ₫ - Vietnamese đồng'),
        ('AUD', 'AUD $ - Australian dollar'),
        ('CAD', 'CAD $ - Canadian Dollar'),
        ('ILS', 'ILS ₪ - Israeli new shekel'),
        ('NGN', 'NGN ₦ - Nigerian naira'),
        ('DKK', 'DKK kr - Danish krone'),
        ('ETB', 'ETB Br - Ethiopian birr'),
        ('TRY', 'TRY ₺ - Turkish lira'),
        ('DZD', 'DZD DA - Algerian dinar'),
        ('MRU', 'MRU UM - Mauritanian ouguiya'),
        ('MAD', 'MAD DM - Moroccan dirham'),
        ('JOD', 'JOD JD - Jordanian dinar'),
        ('XCD', 'XCD $ - Eastern Caribbean dollar'),
        ('GHS', 'GHS ₵ - Ghanaian cedi'),
        ('BND', 'BND $ - Brunei dollar'),
        ('HKD', 'HKD $ - Hong Kong dollar'),
        ('CHF', 'CHF Fr - Swiss franc'),
        ('ANG', 'ANG ƒ - Netherlands Antillean guilder'),
        ('SHP', 'SHP £ - Saint Helena pound'),
        ('FKP', 'FKP £ - Falkland Islands pound')], validators=[DataRequired()])
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

class UpdateProjectForm(FlaskForm):
    name = StringField('Project Name', validators=[DataRequired()])
    submit = SubmitField('Update Project')


