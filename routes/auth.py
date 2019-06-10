from models import User

from flask import redirect, url_for
from flask_login import LoginManager
from werkzeug.security import generate_password_hash

login_manager = LoginManager()


@login_manager.user_loader
def load_user(user_id):
    return User.query.filter_by(username=user_id).first()


@login_manager.unauthorized_handler
def unauthorized_callback():
    return redirect(url_for('login.login'))
