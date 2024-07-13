from flask import Flask, g, logging, request, current_app
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, current_user
from flask_wtf.csrf import CSRFProtect
from flask_mail import Mail
from budgetblox.config import Config
from flask_migrate import Migrate

db = SQLAlchemy()
migrate = Migrate()
bcrypt = Bcrypt()
login_manager = LoginManager()
login_manager.login_view = 'users.login'
login_manager.login_message_category = 'info'
mail = Mail()
csrf = CSRFProtect()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(Config)
    app.config['DEBUG'] = True

    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    login_manager.init_app(app)
    mail.init_app(app)
    csrf.init_app(app)
    

    with app.app_context():
        from budgetblox.models import User, Project, Income, Expense
        db.create_all()

    from budgetblox.users.routes import users
    from budgetblox.fin_data.routes import finData
    from budgetblox.main.routes import main

    app.register_blueprint(users)
    app.register_blueprint(finData)
    app.register_blueprint(main)
    

    @app.before_request
    def set_current_project():
        if current_user.is_authenticated:
            project_id = request.args.get('project_id')
            if project_id:
                g.current_project = Project.query.filter_by(id=project_id, owner=current_user).first()
            else:
                g.current_project = Project.query.filter_by(owner=current_user).first()

    def format_currency(value, currency):
        if currency == 'USD':
            return f"${value:,.2f}"
        elif currency == 'EUR':
            return f"€{value:,.2f}"
        elif currency == 'GBP':
            return f"£{value:,.2f}"
        else:
            return f"{value:,.2f} {currency}"

    def format_date(date_str):
        from datetime import datetime
        return datetime.strptime(date_str, '%Y-%m-%d').strftime('%d-%m-%Y')

    app.jinja_env.globals.update(format_currency=format_currency, format_date=format_date)

    return app

@login_manager.user_loader
def load_user(user_id):
    from budgetblox.models import User
    return User.query.get(int(user_id))
