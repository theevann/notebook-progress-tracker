import pytz
from datetime import datetime

from .base import db
from sqlalchemy.orm import relationship


paris = pytz.timezone('Europe/Paris')


class Session(db.Model):

    __tablename__ = "sessions"

    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    name = db.Column(db.String(100))
    description = db.Column(db.String(300))
    creation_date = db.Column(db.DateTime, default=datetime.now)
    open = db.Column(db.Boolean, default=True)

    owner = relationship("User", foreign_keys=owner_id, back_populates="sessions")
    records = relationship("Record", back_populates="session")

    def to_dict(self):
        fields = ['id', 'name', 'description', 'f_owner', 'f_creation_date', 'open']
        return {f: getattr(self, f) for f in fields}

    @classmethod
    def columns(cls):
        return cls.__table__.columns._data.keys()

    @property
    def f_creation_date(self):
        date = pytz.utc.localize(self.creation_date).astimezone(paris)
        return date.strftime("%d/%m/%Y - %H:%M")

    @property
    def f_owner(self):
        return self.owner.username
