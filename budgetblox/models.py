from datetime import datetime
from itsdangerous import URLSafeTimedSerializer as Serializer
from flask import current_app
from flask_login import UserMixin
from babel.numbers import format_currency
from budgetblox import db

def load_user(user_id):
    from budgetblox import db, login_manager  # Local import to avoid circular import issues
    return User.query.get(int(user_id))

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), nullable=False, unique=True)
    email = db.Column(db.String(120), nullable=False, unique=True)
    image_file = db.Column(db.String(20), nullable=False, default='default.jpg')
    password = db.Column(db.String(60), nullable=False)
    projects = db.relationship('Project', backref='owner', lazy=True)

    def get_reset_token(self, expires_sec=1800):
        s = Serializer(current_app.config['SECRET_KEY'])
        return s.dumps({'user_id': self.id}, salt=current_app.config['SECURITY_PASSWORD_SALT'])
    
    @staticmethod
    def verify_reset_token(token):
        s = Serializer(current_app.config['SECRET_KEY'])
        try:
            user_id = s.loads(token, salt=current_app.config['SECURITY_PASSWORD_SALT'])['user_id']
        except Exception:
            return None
        return User.query.get(user_id)

    def __repr__(self):
        return f"User('{self.username}', '{self.email}', '{self.image_file}')"

class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    date_created = db.Column(db.DateTime, nullable=False, default=datetime.date)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    incomes = db.relationship('Income', backref='project', lazy=True)
    expenses = db.relationship('Expense', backref='project', lazy=True)

    def __repr__(self):
        return f"Project('{self.name}', '{self.date_created}')"

class Income(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title_income = db.Column(db.String(100), nullable=False)
    amount_income = db.Column(db.Float, nullable=False)
    date_income = db.Column(db.Date, nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)
    currency = db.Column(db.String(10), nullable=False, default='GBP')

    def to_dict(self):
        return {
            'id': self.id,
            'title_income': self.title_income,
            'amount_income': float(self.amount_income),  # Convert to float for JSON serialization
            'date_income': self.date_income.isoformat() if self.date_income else None,
            'project_id': self.project_id,
            'currency': self.currency
        }

    def format_amount(self):
        return format_currency(self.amount_income, self.currency)

    def __repr__(self):
        return f"Income('{self.title_income}', '{self.amount_income}', Project ID: '{self.project_id}')"

class Expense(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title_expense = db.Column(db.String(100), nullable=False)
    amount_expense = db.Column(db.Float, nullable=False)
    date_expense = db.Column(db.Date, nullable=False)
    currency = db.Column(db.String(10), nullable=False, default='GBP')
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'title_expense': self.title_expense,
            'amount_expense': float(self.amount_expense),
            'date_expense': self.date_expense.isoformat() if self.date_expense else None,
            'project_id': self.project_id,
            'currency': self.currency
        }

    # Consider adding a format_amount method similar to the Income model
    def format_amount(self):
        return format_currency(self.amount_expense, self.currency)

    def __repr__(self):
        return f"Expense('{self.title_expense}', '{self.amount_expense}', Project ID: '{self.project_id}')"
