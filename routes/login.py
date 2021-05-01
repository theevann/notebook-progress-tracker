import re
from .auth import load_user
from models import User, db

from flask import Blueprint, render_template, request, redirect, url_for
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash

login_bp = Blueprint('login', __name__)


@login_bp.route('/signup', methods=["GET", "POST"])
def signup():
    if current_user.is_authenticated:
        return redirect(url_for('sessions.show_sessions'))

    if request.method == "GET":
        return render_template("signup.html", error="")

    errors = []
    username = request.form["username"]
    user = load_user(username)
    if user is not None:
        errors += ["Username already in use"]

    password = request.form["password"]
    if len(password) < 3:
        errors += ["Password too short"]

    email = request.form["email"]
    if not check_email(email):
        errors += ["Email is incorrect"]
    elif User.query.filter_by(email=email).first():
        errors += ["A user with this email already exists"]

    if errors:
        return render_template("signup.html", error=" - ".join(errors))

    user = User(username=username, email=email, password_hash=generate_password_hash(password))
    db.session.add(user)
    db.session.commit()

    return redirect(url_for('login.login'))


@login_bp.route('/login', methods=["GET", "POST"])
def login():
    if not current_user.is_authenticated:
        if request.method == "GET":
            return render_template("login.html", error=False)

        user = load_user(request.form["username"])
        if user is None:
            return render_template("login.html", error=True)

        if not user.check_password(request.form["password"]):
            return render_template("login.html", error=True)

        login_user(user)

    return redirect(url_for('sessions.show_sessions'))


@login_bp.route("/logout/")
@login_required
def logout():
    logout_user()
    return redirect(url_for('login.login'))


def check_email(email):
    pattern = r"\"?([-a-zA-Z0-9.`?{}]+@\w+\.\w+)\"?"
    return re.match(pattern, email) is not None



@login_bp.route('/delete-account', methods=["GET"])
@login_required
def delete_account():
    current_user.delete()
    return redirect(url_for('index'))
