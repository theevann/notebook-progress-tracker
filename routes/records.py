import io
import json
import numpy as np
from datetime import datetime

from models.base import db
from models import Session, Record, User

from sqlalchemy import func
from flask import Blueprint, render_template, request, redirect, url_for, make_response, jsonify
from flask_login import login_required, current_user

records_bp = Blueprint('records', __name__)


@records_bp.route('/records', methods=["GET"])
@login_required
def show_records():
    return render_template("records.html")


@records_bp.route('/get-records', methods=["GET"])
@login_required
def get_records():
    all_records = Record.query.join(Session).filter_by(owner_id=current_user.id).all()
    dict_records = [s.to_dict() for s in all_records]
    return jsonify(dict_records)


@records_bp.route('/add-record', methods=["POST"])
def add_record():
    # import pdb; pdb.set_trace();
    required_keys = ['session_id', 'sender_name', 'question_nb', 'type']
    record = request.form
    file = request.files.get('file', None)

    if any(key not in record for key in required_keys):
        return "Error: Missing key", 400

    session = db.session.query(Session).filter_by(id=record['session_id']).first()
    if not session:
        return "Error: No such session", 400

    if not session.open:
        return "Error: Session is closed", 400


    if record['type'] == "ndarray":
        data = np.array(json.loads(record['data'])).dumps()
    elif record['type'] == "str":
        data = str.encode(record['data'])
    elif record['type'] == "function":
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


    existing_record = db.session.query(Record).filter(Record.session_id == record['session_id'],
                                                      Record.sender_name == record['sender_name'],
                                                      Record.question_nb == record['question_nb']
                                                      ).first()
    if existing_record:
        existing_record.type = record['type']
        existing_record.data = data
        existing_record.time = datetime.now()
        existing_record.ip = request.remote_addr
    else:
        db.session.add(Record(
            session_id=record['session_id'],
            sender_name=record['sender_name'],
            sender_ip=request.remote_addr,
            question_nb=record['question_nb'],
            type=record['type'],
            data=data
        ))
    db.session.commit()

    return 'Success: Record ' + ('updated' if existing_record else 'inserted')


@records_bp.route('/rec-count', methods=["GET"])
@login_required
def get_record_count_per_question():
    sid = request.args.get('sid', None, type=int)
    if sid is None:
        return "Error: Missing sid", 400
    elif not db.session.query(Session.id).filter_by(id=sid, owner_id=current_user.id).first():
        return "Error: No such session", 400

    query = db.session.query(Record.question_nb, func.count('*').label('record_count')).filter_by(session_id=sid).group_by(Record.question_nb).all()
    return json.dumps(query)


# @records_bp.route('/rec-image', methods=["GET"])
# def get_rec_image():
#     image_binary = db.session.query(Record.data).filter(Record.type=='image').first().data
#     response = make_response(image_binary)
#     response.headers.set('Content-Type', 'image/jpeg')
#     response.headers.set('Content-Disposition', 'attachment', filename='test.jpg')
#     return response
