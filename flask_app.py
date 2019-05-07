import os
import numpy as np
import datetime

from flask import Flask, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy

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
    databasename="courdier$comments",
)
app.config["SQLALCHEMY_DATABASE_URI"] = SQLALCHEMY_DATABASE_URI
app.config["SQLALCHEMY_POOL_RECYCLE"] = 299
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

################################## Comment Class

class Comment(db.Model):

    __tablename__ = "comments"

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(4096))


################################## Actual Code

def get_time():
    return datetime.datetime.now()


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
    global sessions
    if any(s['name'] == name and s['owner'] == owner for s in sessions):
        print('not added')
        return False
    sessions.append({'id': len(sessions), 'owner': owner, 'name': name})
    print('added')
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
    if not any(s['id'] == record['session_id'] for s in sessions):
        return "No such session", 400
    record['time'] = format_time(get_time())
    record['sender_ip'] = request.remote_addr
    record['data'] = np.array(record['data'])
    record['f_data'] = bmatrix(record['data'])
    out = register_sender(record['sender_name'])
    records.append(record)
    return 'ok - sender : ' + ("new" if out else "already in")



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


@app.route('/sessions', methods=["GET"])
def get_sessions():
    global sessions
    return render_template("sessions.html", sessions=sessions)



# TEST


def send(array, q_nb):
    import requests
    url = "http://courdier.pythonanywhere.com/log"
    data = {'session_id': session_t, 'sender_name': name_t, 'question_nb': q_nb, 'type': 'array', 'data': array.tolist()}
    response = requests.post(url, json=data)
    print(response.content)

name_t = 'evann'
session_t = 0
register_session('evann', 'test')

def test():
    send(np.eye(3), 0)


# from threading import Timer
# t = Timer(15.0, test)
# t.start()