import re
from models import db

from flask import Blueprint, render_template, request
from flask_login import login_required, current_user
from werkzeug.security import generate_password_hash

settings_bp = Blueprint('settings', __name__)


@settings_bp.route('/change-password', methods=["POST"])
@login_required
def change_password():
    errors = []
    current_password = request.form["current_password"]
    new_password = request.form["new_password"]
    
    if not current_user.check_password(current_password):
        errors += ["Current password is incorrect"]
    elif len(new_password) < 3:
        errors += ["New password is too short"]
    
    if errors:
        return render_template("settings.html", user=current_user, error=" - ".join(errors))

    current_user.password_hash = generate_password_hash(new_password)
    db.session.commit()

    return render_template("settings.html", user=current_user, success_pwd=True)


@settings_bp.route("/settings", methods=["GET"])
@login_required
def show_settings():
    return render_template("settings.html", user=current_user)



def _check_email(email):
    pattern = r"\"?([-a-zA-Z0-9.`?{}]+@\w+\.\w+)\"?"
    return re.match(pattern, email) is not None
