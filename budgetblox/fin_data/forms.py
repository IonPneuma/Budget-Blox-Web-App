from flask_wtf import FlaskForm
from wtforms import StringField, DecimalField, SelectField, SubmitField, DateField
from wtforms.validators import DataRequired

class ProjectForm(FlaskForm):
    name = StringField('Project Name', validators=[DataRequired()])
    submit = SubmitField('Create Project')

class SelectProjectForm(FlaskForm):
    project = SelectField('Select Project', coerce=int)
    submit = SubmitField('Select')

class IncomeForm(FlaskForm):
    title_income = StringField('Source', validators=[DataRequired()])
    amount_income = DecimalField('Amount', validators=[DataRequired()])
    date_income = DateField('Date', format='%Y-%m-%d', validators=[DataRequired()])
    currency = SelectField('Currency', choices=[], validators=[DataRequired()])  # Placeholder for choices
    submit_income = SubmitField('Add')

class ExpenseForm(FlaskForm):
    title_expense = StringField('Source', validators=[DataRequired()])
    amount_expense = DecimalField('Amount', validators=[DataRequired()])
    date_expense = DateField('Date', format='%Y-%m-%d', validators=[DataRequired()]) 
    currency = SelectField('Currency', choices=[
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
    ]) 
    submit_expense = SubmitField('Add')

class UpdateProjectForm(FlaskForm):
    name = StringField('Project Name', validators=[DataRequired()])
    submit = SubmitField('Update Project')


