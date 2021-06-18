import pytz
from datetime import datetime

from .base import db
from sqlalchemy.orm import relationship
from sqlalchemy.ext.associationproxy import association_proxy


paris = pytz.timezone('Europe/Paris')


class Session(db.Model):

    __tablename__ = "sessions"

    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    name = db.Column(db.String(100))
    description = db.Column(db.String(300))
    creation_date = db.Column(db.DateTime, default=datetime.utcnow)
    open = db.Column(db.Boolean, default=True)

    owner = relationship("User", foreign_keys=owner_id, back_populates="sessions")
    records = relationship("Record", back_populates="session")
    parts = relationship("SessionPart", back_populates="session")
    shared_users = association_proxy("session_sharings", "shared_user")

    def to_dict(self, sharing=False):
        fields = ['id', 'name', 'description', 'f_owner', 'f_creation_date', 'f_shared_users', 'open']
        return dict(sharing=sharing, **{f: getattr(self, f) for f in fields})

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

    @property
    def f_shared_users(self):
        return [u.username for u in self.shared_users]

    def delete(self):
        from .record import Record
        from .session_part import SessionPart
        from .session_sharing import SessionShare
        
        Record.query.filter_by(session_id=self.id).delete()
        SessionPart.query.filter_by(session_id=self.id).delete()
        SessionShare.query.filter_by(session_id=self.id).delete()
        db.session.delete(self)
        db.session.commit()

    def toggle_state(self):
        if not self.open:
            for s in Session.query.filter_by(owner=self.owner, name=self.name).all():
                s.open = False
        self.open = not self.open
        db.session.commit()
        return True
        
    @classmethod
    def register_new(cls, name, description, user):
        from .session_part import SessionPart
        if name == '':
            return False

        is_open = not any(map(lambda x: x[0], db.session.query(Session.open).filter(Session.owner == user, Session.name == name).all()))
        session = Session(name=name, owner=user, description=description, open=is_open)
        db.session.add(session)
        db.session.commit()
        default_part = SessionPart(session_id=session.id)
        db.session.add(default_part)
        db.session.commit()
        return True
