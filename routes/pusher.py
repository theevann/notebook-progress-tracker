import os
import pusher
import hashlib
from dotenv import load_dotenv

from flask import Blueprint, request
from flask_login import login_required, current_user

from models import Session


project_folder = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(project_folder, os.pardir, 'app-env'))


pusher_bp = Blueprint('pusher', __name__)

pusher_client = pusher.Pusher(
    app_id=os.getenv("PUSHER_APPID"),
    key=os.getenv("PUSHER_KEY"),
    secret=os.getenv("PUSHER_SECRET"),
    cluster='eu',
    ssl=True
)


@pusher_bp.route('/send-push', methods=["POST"])
@login_required
def send_push():
    data = request.form
    session = Session.query.filter_by(name=data['session_name'], open=True, owner=current_user).first()
    if not session:
        return "Error: No such session open", 400

    all_channel = hashlib.md5("{}_{}".format(session.name, current_user.username).lower().encode()).hexdigest()
    pusher_client.trigger(all_channel, 'message', {
        'title': data['title'],
        'body': data['body'],
        'code': data['code'],
        'type': data['type'],
        'timeout': 0
    })

    return "Message sent"