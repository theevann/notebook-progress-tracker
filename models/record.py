import io
import pytz
from base64 import b64encode
from datetime import datetime
import numpy as np

from .base import db
from sqlalchemy.orm import relationship


paris = pytz.timezone('Europe/Paris')
np.set_printoptions(4)


class Record(db.Model):

    __tablename__ = "records"

    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.Integer, db.ForeignKey('sessions.id'))
    part_id = db.Column(db.Integer, db.ForeignKey('session_parts.id'))
    sender_name = db.Column(db.String(100))
    sender_ip = db.Column(db.String(15))
    question_nb = db.Column(db.Integer)
    # question_name = db.Column(db.String(100))
    time = db.Column(db.DateTime, default=datetime.now)
    type = db.Column(db.String(20))
    data = db.Column(db.BLOB)

    session = relationship("Session", foreign_keys=session_id, back_populates="records")
    part = relationship("SessionPart", foreign_keys=part_id, back_populates="records")

    def to_dict(self):
        # fields = ['id', 'session_id', 'sender_name', 'sender_ip', 'question_nb', 'question_name', 'f_time', 'type', 'f_data']
        fields = ['id', 'session_id', 'sender_name', 'sender_ip', 'question_nb', 'f_time', 'type', 'f_data']
        return {f: getattr(self, f) for f in fields}

    def format_data(self):
        data = "Not Supported"
        if self.type == 'ndarray':
            data = format_array(np.load(io.BytesIO(self.data), allow_pickle=True))
        elif self.type == 'str':
            data = self.data.decode('utf-8')
        elif self.type == 'function':
            data = self.data.decode('utf-8')
        elif self.type == 'image':
            data = b64encode(self.data).decode()
        return data

    @property
    def f_data(self):
        return self.format_data()

    @property
    def f_time(self):
        date = pytz.utc.localize(self.time).astimezone(paris)
        return date.strftime("%d/%m/%Y  %H:%M")


def format_array(a):
    if len(a.shape) > 2:
        return str(a)
    if a.size == 1:
        return '$$%s$$' % str(a.flatten()[0])
    lines = str(a).replace('[', '').replace(']', '').splitlines()
    rv = [r'\begin{bmatrix}']
    rv += ['  ' + ' & '.join(l.split()) + r'\\' for l in lines]
    rv +=  [r'\end{bmatrix}']
    return '\n'.join(rv)
