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
    submit_income = SubmitField('Add')

class ExpenseForm(FlaskForm):
    title_expense = StringField('Source', validators=[DataRequired()])
    amount_expense = DecimalField('Amount', validators=[DataRequired()])
    date_expense = DateField('Date', format='%Y-%m-%d', validators=[DataRequired()])  
    submit_expense = SubmitField('Add')

class UpdateProjectForm(FlaskForm):
    name = StringField('Project Name', validators=[DataRequired()])
    submit = SubmitField('Update Project')
