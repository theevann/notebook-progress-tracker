from .base import db
from sqlalchemy.orm import relationship, backref


class SessionShare(db.Model):

    __tablename__ = "session_sharing"

    id = db.Column(db.Integer, primary_key=True)
    shared_user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    session_id = db.Column(db.Integer, db.ForeignKey('sessions.id'), nullable=False)

    shared_user = relationship("User", foreign_keys=shared_user_id, backref=backref("session_sharings", cascade="all, delete-orphan"))
    session = relationship("Session", foreign_keys=session_id, backref=backref("session_sharings", cascade="all, delete-orphan"))

    @classmethod
    def columns(cls):
        return cls.__table__.columns._data.keys()
