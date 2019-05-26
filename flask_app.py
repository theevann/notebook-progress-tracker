import io
import os
import re
import json
import pytz
import numpy as np
from datetime import datetime
from base64 import b64encode

from flask import Flask, render_template, request, redirect, url_for, make_response
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship
from sqlalchemy import func
from jinja2 import evalcontextfilter, Markup, escape


################################## Load env variables

import os
from dotenv import load_dotenv

project_folder = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(project_folder, 'app-env'))



# TODO: make an owner page, protect by password, add more fields
# Parameters : On/off switch latex, latex font-size
# Add dashboard page: List of sessions on the top, screen split in two with last records on the left, clickable bar graph with num people/question
# For records page : split record by session, allow search/filtering by people, add correct answer and check
# For sessions page : Add nb participants (https://docs.sqlalchemy.org/en/13/orm/tutorial.html#using-subqueries), are you sure delete button
# Other views : Follow one participant in a session, see number of participants who have answer each questions as a bar graph
# DDOS / Overflow protection (check IP sent ratio over last minute)
# More data types: plot
# All live with server push : https://stackoverflow.com/questions/12232304/how-to-implement-server-push-in-flask-framework
# React


app = Flask(__name__)
app.config["DEBUG"] = True


################################## Database conf

SQLALCHEMY_DATABASE_URI = "mysql+mysqlconnector://{username}:{password}@{hostname}/{databasename}".format(
    username=os.getenv("DB_USERNAME"),
    password=os.getenv("DB_PASSWORD"),
    hostname=os.getenv("DB_HOSTNAME"),
    databasename=os.getenv("DB_NAME"),
)

app.config["SQLALCHEMY_DATABASE_URI"] = SQLALCHEMY_DATABASE_URI
app.config["SQLALCHEMY_POOL_RECYCLE"] = 299
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)


################################## Session Class

np.set_printoptions(4)
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

    session = relationship("Session", back_populates="records")

    def format_data(self):
        data = "Not Supported"
        if self.type == 'ndarray':
            data = bmatrix(np.load(io.BytesIO(self.data)))
        elif self.type == 'str':
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




################################## Actual Code


def get_time():
    return datetime.now()


def format_time(timestamp):
    return timestamp.strftime("%Y-%m-%d %H:%M:%S")


def bmatrix(a):
    if len(a.shape) > 2:
        return str(a)
    if a.size == 1:
        return '$$%s$$' % str(a.flatten()[0])
    lines = str(a).replace('[', '').replace(']', '').splitlines()
    rv = [r'\begin{bmatrix}']
    rv += ['  ' + ' & '.join(l.split()) + r'\\' for l in lines]
    rv +=  [r'\end{bmatrix}']
    return '\n'.join(rv)


def register_session(owner, name):
    if owner == '' or name == '':
        return False

    if db.session.query(Session.id).filter(Session.owner==owner, Session.name==name).first():
        return False

    sid = (db.session.query(func.max(Session.id)).scalar() or 0) + 1
    session = Session(id=sid, name=name, owner=owner)
    db.session.add(session)
    db.session.commit()
    return True


def delete_session(sid):
    Record.query.filter_by(session_id=sid).delete()
    Session.query.filter(Session.id == sid).delete()
    db.session.commit()
    return True

def toggle_session_state(sid):
    session = Session.query.filter(Session.id == sid).first()
    if not session:
        return False
    session.open = not session.open
    db.session.commit()
    return True



print( "======================== START ==========================")


@app.route("/", methods=["GET"])
def index():
    return "Welcome to the notebook progress tracker :)"


########## RECORDS ##########


@app.route('/records', methods=["GET"])
def get_records():
    fields=[('Session ID', 'session_id'), ('Name', 'sender_name'), ('Date', 'f_time'), ('Question number', 'question_nb'), ('Answer', 'f_data')]
    records = db.session.query(Record)

    if 'sid' in request.args:
        sid = int(request.args['sid'])
        records = records.filter(Record.session_id==sid)

    if 'orderby' in request.args and hasattr(Record, request.args['orderby']):
        field_to_order = getattr(Record, request.args['orderby'])
        if 'order' in request.args and request.args['order'] == "desc":
            field_to_order = field_to_order.desc()
        records = records.order_by(field_to_order)

    return render_template("records.html", records=records, fields=fields)


@app.route('/add-record', methods=["POST"])
def add_record():
    # import pdb; pdb.set_trace();
    required_keys = ['session_id', 'sender_name', 'question_nb', 'type']
    record = request.form
    file = request.files.get('file', None)

    if any(key not in record for key in required_keys):
        return "Error: Missing key", 400

    if not db.session.query(Session.id).filter(Session.id==record['session_id']).first():
        return "Error: No such session", 400

    if not db.session.query(Session.open).filter(Session.id==record['session_id']).first()[0]:
        return "Error: Session is closed", 400


    if record['type'] == "ndarray":
        data = np.array(json.loads(record['data'])).dumps()
    elif record['type'] == "str":
        data = str.encode(record['data'])
    elif record['type'] == "image":
        buffer = io.BytesIO()
        file.save(buffer)
        data = buffer.getvalue()
        buffer.close()
    elif record['type'] == "list":
        data = record['data']
    else:
        return "Error: DataType is not supported", 400


    existing_record = db.session.query(Record).filter(Record.session_id==record['session_id'], Record.sender_name==record['sender_name'], Record.question_nb==record['question_nb']).first()
    if existing_record:
        existing_record.type = record['type']
        existing_record.data = data
        existing_record.time = datetime.now()
        existing_record.ip = request.remote_addr
    else:
        new_record = Record(
                        session_id=record['session_id'], \
                        sender_name=record['sender_name'], \
                        sender_ip=request.remote_addr, \
                        question_nb=record['question_nb'], \
                        type=record['type'], \
                        data=data
                    )
        db.session.add(new_record)
    db.session.commit()

    return 'Success: Record ' + ('updated' if existing_record else 'inserted')

@app.route('/rec-count', methods=["GET"])
def get_record_count_per_question():
    sid = request.args.get('sid', None, type=int)
    if sid is None:
        return "Error: Missing sid", 400
    elif not db.session.query(Session.id).filter_by(id=sid).first():
        return "Error: No such session", 400

    query = db.session.query(Record.question_nb, func.count('*').label('record_count')).filter(Record.session_id==sid).group_by(Record.question_nb).all()
    return json.dumps(query)


@app.route('/rec-image', methods=["GET"])
def get_rec_image():
    image_binary = db.session.query(Record.data).filter(Record.type=='image').first().data
    response = make_response(image_binary)
    response.headers.set('Content-Type', 'image/jpeg')
    response.headers.set('Content-Disposition', 'attachment', filename='test.jpg')
    return response


########## SESSIONS ##########


@app.route('/sessions', methods=["GET"])
def get_sessions():
    fields=[('ID', 'id'), ('Name', 'name'), ('Owner', 'owner'), ('Creation Date', 'f_creation_date'), ('Status', 'open')]
    return render_template("sessions.html", sessions=Session.query.order_by(Session.id).all(), fields=fields)


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


@app.route("/toggle-session", methods=["GET"])
def toggle_session():
    if 'id' in request.args:
        sid = int(request.args['id'])
        toggle_session_state(sid)
    return redirect(url_for('get_sessions'))


########## BAR-GRAPH ##########

@app.route('/dashboard', methods=["GET"])
def get_bar():
    sid = request.args.get('id', None)
    return render_template("bar_graph.html", sid=sid, sessions=Session.query.order_by(Session.id).all(), fields=Session.columns())


########## SEND-CODE ##########

@app.route('/get-send-code', methods=["GET"])
def get_send_code():
    return """
import io
import json
import requests

def get_binary_image(plt_obj):
    with io.BytesIO() as buffer:
        plt_obj.savefig(buffer, format='jpeg', quality=20, dpi=70)
        return buffer.getvalue()

def send(data, q_nb):
    url = "http://courdier.pythonanywhere.com/add-record"
    file = {}
    form = {'session_id': session, 'sender_name': name, 'question_nb': q_nb}

    datatype = type(data).__name__
    if datatype == "ndarray":
        form['type'] = datatype
        form['data'] = json.dumps(data.tolist())
    elif datatype == "module" and data.__name__ == "matplotlib.pyplot":
        form['type'] = 'image'
        file['file'] = get_binary_image(data)
    else:
        form['type'] = datatype
        form['data'] = data

    response = requests.post(url, data=form, files=file)
    print(response.content.decode())
    return response
        """

_paragraph_re = re.compile(r'(?:\r\n|\r|\n){2,}')

@app.template_filter()
@evalcontextfilter
def nl2br(eval_ctx, value):
    result = u'\n\n'.join(u'<p>%s</p>' % p.replace('\n', '<br>\n') \
                          for p in _paragraph_re.split(escape(value)))
    if eval_ctx.autoescape:
        result = Markup(result)
    return result

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=50000, debug=True, threaded=True)
