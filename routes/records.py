import io
import json
import pickle
import numpy as np
from datetime import datetime, timedelta

from models.base import db
from models import Session, SessionPart, Record, User

from sqlalchemy import func, or_
from flask import Blueprint, render_template, request, redirect, url_for, make_response, jsonify
from flask_login import login_required, current_user

from .auth import load_user

records_bp = Blueprint('records', __name__)


@records_bp.route('/records', methods=["GET"])
@login_required
def show_records():
    return render_template("records.html")


@records_bp.route('/get-records', methods=["GET"])
@login_required
def get_records():
    sid = request.args.get('sid', None, type=int)
    records = Record.query.join(Session).filter(or_(Session.owner == current_user, Session.shared_users.contains(current_user)))
    if sid is not None:
        records = records.filter(Session.id==sid)
    since = request.args.get('since', 0, type=int)
    if since is not None:
        since = datetime.fromtimestamp(since / 1000)
        records = records.filter(Record.time > since)
    dict_records = [s.to_dict() for s in records.all()]
    return jsonify(dict_records)


@records_bp.route('/del-records', methods=["DELETE"])
@login_required
def del_records():
    data = request.form
    record_ids = data.getlist("record_ids[]")
    records = Record.query.filter(Record.session_id == Session.id, Session.owner_id == current_user.id, Record.id.in_(record_ids));
    records.delete(synchronize_session=False)
    db.session.commit()
    return "OK", 200


@records_bp.route('/add-record', methods=["POST"])
def add_record():
    # TODO: remove session id from record
    # import pdb; pdb.set_trace();
    required_keys = ['session_owner', 'session_name', 'part_name', 'sender_name', 'sender_uuid', 'question_nb', 'type']
    record = request.form
    file = request.files.get('file', None)

    if any(key not in record for key in required_keys):
        return "Error: Missing key", 400

    user = load_user(record['session_owner'])
    if not user:
        return "Error: No such owner", 400

    session = Session.query.filter_by(name=record['session_name'], open=True, owner=user).first()
    if not session:
        return "Error: No such session open", 400

    part = SessionPart.query.filter_by(name=record['part_name'], session_id=session.id).first()
    if not part:
        return "Error: No such part", 400

    ### PROTECTION

    if Record.query.filter_by(part=part, sender_name=record['sender_name']).filter(Record.time > datetime.utcnow() - timedelta(minutes=1)).count() > 20:
        return "Error: Too many recent records - Try again later", 400

    sender_reccount = Record.query.filter_by(part=part, sender_name=record['sender_name']).count()
    if sender_reccount >= 50:
        return "Error: Too many records for this sender", 400

    session_sendercount = db.session.query(Record.sender_name).filter_by(part=part).distinct().count()
    if sender_reccount == 0 and session_sendercount >= 50:
        return "Error: Too many different senders in session", 400

    ### PREPARING DATA

    if record['type'] in ("list", "dict"):
        data = pickle.dumps(json.loads(record['data']))
    elif record['type'] == "ndarray":
        data = np.array(json.loads(record['data'])).dumps() #TODO: pickle dump only as list, as numpy arrays take more space
    elif record['type'] in ("str","code"):
        data = str.encode(record['data'])
    elif record['type'] == "image":
        buffer = io.BytesIO()
        file.save(buffer)
        data = buffer.getvalue()
        buffer.close()
    else:
        return "Server error: DataType is not supported", 400


    existing_record = db.session.query(Record).filter(Record.session_id == session.id,
                                                      Record.part_id == part.id,
                                                      Record.sender_uuid == record['sender_uuid'],
                                                      Record.question_nb == record['question_nb']
                                                      ).first()
    if existing_record:
        existing_record.type = record['type']
        existing_record.data = data
        existing_record.sender_name = record['sender_name']
        existing_record.time = datetime.utcnow()
        existing_record.ip = request.remote_addr
    else:
        db.session.add(Record(
            session_id=session.id,
            part_id=part.id,
            sender_name=record['sender_name'],
            sender_uuid=record['sender_uuid'],
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
    elif not db.session.query(Session.id).filter_by(id=sid).filter(or_(Session.owner == current_user, Session.shared_users.contains(current_user))).first():
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
