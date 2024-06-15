from datetime import datetime
from itsdangerous import URLSafeTimedSerializer as Serializer
from budgetblox import db, login_manager
from flask import current_app
from budgetblox.extensions import db, login_manager
from flask_login import UserMixin

@login_manager.user_loader
def load_user(user_id):
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
    date_created = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
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

    def to_dict(self):
        return {
            'id': self.id,
            'title_income': self.title_income,
            'amount_income': self.amount_income,
            'date_income': self.date_income.strftime('%Y-%m-%d'),
            'project_id': self.project_id
        }

    def __repr__(self):
        return f"Income('{self.title_income}', '{self.amount_income}', Project ID: '{self.project_id}')"

class Expense(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title_expense = db.Column(db.String(100), nullable=False)
    amount_expense = db.Column(db.Float, nullable=False)
    date_expense = db.Column(db.Date, nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'title_expense': self.title_expense,
            'amount_expense': self.amount_expense,
            'date_expense': self.date_expense.strftime('%Y-%m-%d'),
            'project_id': self.project_id
        }

    def __repr__(self):
        return f"Expense('{self.title_expense}', '{self.amount_expense}', Project ID: '{self.project_id}')"
