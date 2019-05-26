import pytz
from datetime import datetime

from .base import db
from sqlalchemy.orm import relationship


paris = pytz.timezone('Europe/Paris')


class Session(db.Model):

    __tablename__ = "sessions"
    __table_args__ = (db.PrimaryKeyConstraint('name', 'owner'), {})

    id = db.Column(db.Integer, unique=True)
    name = db.Column(db.String(100))
    owner = db.Column(db.String(100))
    creation_date = db.Column(db.DateTime, default=datetime.now)
    open = db.Column(db.Boolean, default=True)

    records = relationship("Record", back_populates="session")

    @classmethod
    def columns(cls):
        return cls.__table__.columns._data.keys()

    @property
    def f_creation_date(self):
        date = pytz.utc.localize(self.creation_date).astimezone(paris)
        return date.strftime("%d/%m/%Y - %H:%M")