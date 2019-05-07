import os
import numpy as np
from datetime import datetime

from flask import Flask, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func

# TODO: Use DB, make an owner page, protect by password, add more fields, make other views (aggregées), split record by session, allow search/filtering by people, add correct answer and check
# On/off switch latex, more types, new affichage, nav bar
# For sessions: create date / close date / nb participants


app = Flask(__name__)
app.config["DEBUG"] = True


################################## Database conf


SQLALCHEMY_DATABASE_URI = "mysql+mysqlconnector://{username}:{password}@{hostname}/{databasename}".format(
    username=os.getenv("DB_USERNAME"),
    password=os.getenv("DB_PASSWORD"),
    hostname=os.getenv("DB_HOSTNAME"),
    databasename="courdier$notebook-tracker",
)
app.config["SQLALCHEMY_DATABASE_URI"] = SQLALCHEMY_DATABASE_URI
app.config["SQLALCHEMY_POOL_RECYCLE"] = 299
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)


################################## Session Class

class Session(db.Model):

    __tablename__ = "sessions"

    id = db.Column(db.Integer)
    name = db.Column(db.String(100))
    owner = db.Column(db.String(100))

    __table_args__ = (db.PrimaryKeyConstraint('name', 'owner'), {})

    @classmethod
    def columns(cls):
        return cls.__table__.columns._data.keys()

class Record(db.Model):

    __tablename__ = "records"

    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.Integer, db.ForeignKey('sessions.id'))
    sender_name = db.Column(db.String(100))
    sender_ip = db.Column(db.String(15))
    question_nb = db.Column(db.Integer)
    time = db.Column(db.DateTime, default=datetime.now)
    type = db.Column(db.String(20))
    data = db.Column(db.BLOB)
    f_data = db.Column(db.String(4096))


################################## Actual Code

def get_time():
    return datetime.now()


def format_time(timestamp):
    return timestamp.strftime("%Y-%m-%d %H:%M:%S")

def bmatrix(a):
    if len(a.shape) > 2:
        return "<br />".join(str(a).split("\n"))
    lines = str(a).replace('[', '').replace(']', '').splitlines()
    rv = [r'\begin{bmatrix}']
    rv += ['  ' + ' & '.join(l.split()) + r'\\' for l in lines]
    rv +=  [r'\end{bmatrix}']
    return '\n'.join(rv)


def register_session(owner, name):
    if db.session.query(Session.id).filter(Session.owner==owner, Session.name==name).first():
        return False

    sid = (db.session.query(func.max(Session.id)).scalar() or 0) + 1
    session = Session(id=sid, name=name, owner=owner)
    db.session.add(session)
    db.session.commit()
    return True


def delete_session(sid):
    Session.query.filter(Session.id == sid).delete()
    db.session.commit()
    return True


def register_sender(name):
    global senders
    if any(s['name'] == name for s in senders):
        return False
    senders.append({'id': len(senders), 'name': name})
    return True


sessions = []
senders = []
records = []


print( "======================== TEST ==========================")


@app.route("/", methods=["GET"])
def index():
    return "Welcome"


@app.route('/log', methods=["POST"])
def log():
    global records
    record = request.json
    if not db.session.query(Session.id).filter(Session.id==record['session_id']).first():
        return "Error: No such session", 400
    record['time'] = format_time(get_time())
    record['sender_ip'] = request.remote_addr
    record['data'] = np.array(record['data'])
    record['f_data'] = bmatrix(record['data'])
    out = register_sender(record['sender_name'])
    records.append(record)
    return 'Success (Sender is ' + ("new" if out else "already in") + ')'



@app.route('/records', methods=["GET"])
def get_records():
    global records
    filtered_records = records
    if 'id' in request.args:
        sid = int(request.args['id'])
        filtered_records = [rec for rec in records if rec['session_id'] == sid]
    to_show=['session_id', 'sender_name', 'time', 'question_nb', 'f_data']
    return render_template("records.html", records=filtered_records, toshow=to_show)



@app.route("/add-session", methods=["POST"])
def add_session():
    data = request.form
    register_session(data['owner'], data['name'])
    return redirect(url_for('get_sessions'))


@app.route("/del-session", methods=["GET"])
def del_session():
    if 'id' in request.args:
        sid = int(request.args['id'])
        delete_session(sid)
    return redirect(url_for('get_sessions'))


@app.route('/sessions', methods=["GET"])
def get_sessions():
    return render_template("sessions.html", sessions=Session.query.all(), fields=Session.columns())



# TEST


# def send(array, q_nb):
#     import requests
#     url = "http://courdier.pythonanywhere.com/log"
#     data = {'session_id': session_t, 'sender_name': name_t, 'question_nb': q_nb, 'type': 'array', 'data': array.tolist()}
#     response = requests.post(url, json=data)
#     print(response.content)

# name_t = 'evann'
# session_t = 0
# register_session('evann', 'test')
