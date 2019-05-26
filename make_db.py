from models import db
from flask_app import create_app

with create_app().app_context():
    db.create_all()
