from .base import login_manager, load_user
from flask_login import login_user, logout_user, login_required, current_user
from flask import Blueprint, render_template, request, redirect, url_for


login_bp = Blueprint('login', __name__)


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
