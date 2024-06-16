from flask import Flask, g, request, current_app
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, current_user, login_required
from flask_wtf.csrf import CSRFProtect
from flask_mail import Mail
from budgetblox.config import Config
from budgetblox.utils import format_currency
from budgetblox.models import Project

db = SQLAlchemy()
bcrypt = Bcrypt()
login_manager = LoginManager()
login_manager.login_view = 'users.login'
login_manager.login_message_category = 'info'
mail = Mail()
csrf = CSRFProtect()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    bcrypt.init_app(app)
    login_manager.init_app(app)
    mail.init_app(app)
    csrf.init_app(app)

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

    return app

    @app.context_processor
    def utility_processor():
        return dict(format_currency=format_currency)

    return app
