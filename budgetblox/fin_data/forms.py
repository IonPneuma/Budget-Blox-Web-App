from flask_wtf import FlaskForm
from wtforms import StringField, DecimalField, SelectField, SubmitField, DateField
from wtforms.validators import DataRequired


class ProjectForm(FlaskForm):
    name = StringField('Project Name', validators=[DataRequired()])
    submit = SubmitField('Create Project')

class SelectProjectForm(FlaskForm):
    project = SelectField('Select Project', coerce=int, choices=[])
    submit = SubmitField('Select')

class IncomeForm(FlaskForm):
    title_income = StringField('Source', validators=[DataRequired()])
    amount_income = DecimalField('Amount', validators=[DataRequired()])
    date_income = DateField('Date', format='%Y-%m-%d', validators=[DataRequired()])
    currency = SelectField('Currency', choices=[
        ('EUR', 'Euro'),
        ('USD', 'United States dollar'),
        ('AUD', 'Australian dollar'),
        ('GBP', 'Sterling'),
        ('XCD', 'Eastern Caribbean dollar'),
        ('XOF', 'West African CFA franc'),
        ('NZD', 'New Zealand dollar'),
        ('NOK', 'Norwegian krone'),
        ('XAF', 'Central African CFA franc'),
        ('ZAR', 'South African rand'),
        ('XPF', 'CFP franc'),
        ('CLP', 'Chilean peso'),
        ('DKK', 'Danish krone'),
        ('INR', 'Indian rupee'),
        ('RUB', 'Russian rouble'),
        ('TRY', 'Turkish lira'),
        ('DZD', 'Algerian dinar'),
        ('MRU', 'Mauritanian ouguiya'),
        ('MAD', 'Moroccan dirham'),
        ('ILS', 'Israeli new shekel'),
        ('JOD', 'Jordanian dinar'),
        ('BND', 'Brunei dollar'),
        ('SGD', 'Singapore dollar'),
        ('HKD', 'Hong Kong dollar'),
        ('CHF', 'Swiss franc'),
        ('ANG', 'Netherlands Antillean guilder'),
        ('SHP', 'Saint Helena pound'),
        ('FKP', 'Falkland Islands pound'),
        ('CAD', 'Canadian Dollar')], validators=[DataRequired()])

        # Add more currencies as needed

    submit_expense = SubmitField('Add')
    submit_income = SubmitField('Add')

class ExpenseForm(FlaskForm):
    title_expense = StringField('Source', validators=[DataRequired()])
    amount_expense = DecimalField('Amount', validators=[DataRequired()])
    date_expense = DateField('Date', format='%Y-%m-%d', validators=[DataRequired()]) 
    currency = SelectField('Currency', choices=[
        ('EUR', 'Euro'),
        ('USD', 'United States dollar'),
        ('AUD', 'Australian dollar'),
        ('GBP', 'Sterling'),
        ('XCD', 'Eastern Caribbean dollar'),
        ('XOF', 'West African CFA franc'),
        ('NZD', 'New Zealand dollar'),
        ('NOK', 'Norwegian krone'),
        ('XAF', 'Central African CFA franc'),
        ('ZAR', 'South African rand'),
        ('XPF', 'CFP franc'),
        ('CLP', 'Chilean peso'),
        ('DKK', 'Danish krone'),
        ('INR', 'Indian rupee'),
        ('RUB', 'Russian rouble'),
        ('TRY', 'Turkish lira'),
        ('DZD', 'Algerian dinar'),
        ('MRU', 'Mauritanian ouguiya'),
        ('MAD', 'Moroccan dirham'),
        ('ILS', 'Israeli new shekel'),
        ('JOD', 'Jordanian dinar'),
        ('BND', 'Brunei dollar'),
        ('SGD', 'Singapore dollar'),
        ('HKD', 'Hong Kong dollar'),
        ('CHF', 'Swiss franc'),
        ('ANG', 'Netherlands Antillean guilder'),
        ('SHP', 'Saint Helena pound'),
        ('FKP', 'Falkland Islands pound'),
        ('CAD', 'Canadian Dollar')], validators=[DataRequired()])

        # Add more currencies as needed
        #  
    submit_expense = SubmitField('Add')

class UpdateProjectForm(FlaskForm):
    name = StringField('Project Name', validators=[DataRequired()])
    submit = SubmitField('Update Project')


