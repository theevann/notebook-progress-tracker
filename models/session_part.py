from .base import db
from sqlalchemy.orm import relationship


class SessionPart(db.Model):

    __tablename__ = "session_parts"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    number = db.Column(db.Integer)
    description = db.Column(db.String(300))
    session_id = db.Column(db.Integer, db.ForeignKey('sessions.id'))

    session = relationship("Session", foreign_keys=session_id, back_populates="parts")
    records = relationship("Record", back_populates="part")

    def to_dict(self):
        fields = ['id', 'name', 'number', 'description']
        return {f: getattr(self, f) for f in fields}

    @classmethod
    def columns(cls):
        return cls.__table__.columns._data.keys()
