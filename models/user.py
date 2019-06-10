import pytz
from datetime import datetime

from .base import db
from sqlalchemy.orm import relationship

from flask_login import UserMixin
from werkzeug.security import check_password_hash

paris = pytz.timezone('Europe/Paris')


class User(UserMixin, db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(128), unique=True)
    email = db.Column(db.String(128), unique=True)
    password_hash = db.Column(db.String(128))
    signup_date = db.Column(db.DateTime, default=datetime.now)
    admin = db.Column(db.Boolean, default=False)

    sessions = relationship("Session", back_populates="owner")


    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def get_id(self):
        return self.username
