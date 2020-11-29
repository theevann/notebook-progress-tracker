from models.base import db
from models import Session, Record, SessionPart

from sqlalchemy import func
from flask import Blueprint, render_template, request, redirect, url_for, jsonify
from flask_login import login_required, current_user

sessions_bp = Blueprint('sessions', __name__)


@sessions_bp.route('/sessions', methods=["GET"])
@login_required
def show_sessions():
    return render_template("sessions.html")


@sessions_bp.route('/sessions/<session_id>', methods=["GET"])
@login_required
def show_session(session_id):
    session = Session.query.filter_by(owner=current_user, id=session_id).first()
    if not session:
        return redirect(url_for('sessions.show_sessions'))
    return render_template("session_management.html", session=session)


@sessions_bp.route('/get-sessions', methods=["GET"])
@login_required
def get_sessions():
    all_sessions = Session.query.order_by(Session.id).filter_by(owner=current_user).all()
    dict_sessions = [s.to_dict() for s in all_sessions]
    return jsonify(dict_sessions)


@sessions_bp.route('/get-session', methods=["GET"])
@login_required
def get_session():
    dict_session = Session.query.filter_by(owner=current_user, id=request.args['id']).one().to_dict()
    dict_session['parts'] = [p.to_dict() for p in SessionPart.query.filter_by(session_id=request.args['id']).all()]
    return jsonify(dict_session)


@sessions_bp.route("/add-session", methods=["POST"])
@login_required
def add_session():
    data = request.form
    register_session(data['name'], data['description'])
    return redirect(url_for('sessions.show_sessions'))


@sessions_bp.route("/del-session", methods=["GET"])
@login_required
def del_session():
    if 'id' in request.args:
        sid = int(request.args['id'])
        delete_session(sid)
    return redirect(url_for('sessions.show_sessions'))


@sessions_bp.route("/toggle-session", methods=["GET"])
@login_required
def toggle_session():
    if 'id' in request.args:
        sid = int(request.args['id'])
        toggle_session_state(sid)
    return redirect(url_for('sessions.show_sessions'))


@sessions_bp.route("/update-session", methods=["POST"])
@login_required
def update_session():
    data = request.form
    session = Session.query.filter_by(id=data['id'], owner=current_user).first()
    if not session:
        return "No such session", 400
        
    session.name = data['name']
    session.description = data['description']

    if Session.query.filter_by(name=data['name'], owner=current_user, open=True).first():
        session.open = False

    db.session.commit()
    return "OK", 200


@sessions_bp.route("/add-part", methods=["POST"])
@login_required
def add_part():
    data = request.form
    required_keys = ['session_id', 'name', 'description', 'number']
    if set(required_keys) != set(data.keys()):
        return "Error: Incorrect keys", 400

    # Check session is owned by user
    session = Session.query.filter_by(id=data['session_id'], owner_id=current_user.id)
    if not session.first():
        return "Error: Wrong ownership", 400

    # Check name is not already used
    part = SessionPart.query.filter_by(name=data['name'], session_id=data['session_id']) \
            .join(Session).filter_by(owner_id=current_user.id)
    if part.first():
        return "Error: Part with name exists", 400

    part = SessionPart(**data)
    db.session.add(part)
    db.session.commit()
    return "Part added", 200


@sessions_bp.route("/del-part", methods=["GET"])
@login_required
def del_part():
    pid = int(request.args['id'])
    SessionPart.query.join(Session).filter(SessionPart.id == pid, Session.owner_id == current_user.id).delete()
    # TODO: Here add check that session still has other parts 
    db.session.commit()
    return 200, "OK"


@sessions_bp.route("/update-part", methods=["POST"])
@login_required
def update_part():
    # TODO:
    session = Session.query.filter_by(id=sid, owner=current_user)
    if not session.first():
        return False
    part = SessionPart(session_id=session.id, name=name, description=description, number=number)
    
    db.session.add(part)
    db.session.commit()
    return True




def register_session(name, description=""):
    if name == '':
        return False

    is_open = not any(db.session.query(Session.open).filter(Session.owner == current_user, Session.name == name).all())
    session = Session(name=name, owner=current_user, description=description, open=is_open)
    db.session.add(session)
    db.session.commit()
    default_part = SessionPart(session_id=session.id)
    db.session.add(default_part)
    db.session.commit()
    return True


def delete_session(sid):
    session = Session.query.filter_by(id=sid, owner=current_user)
    if not session.first():
        return False
    Record.query.filter_by(session_id=sid).delete()
    SessionPart.query.filter_by(session_id=sid).delete()
    session.delete()
    db.session.commit()
    return True


def toggle_session_state(sid):
    session = Session.query.filter_by(id=sid, owner=current_user).first()
    if not session:
        return False
    if not session.open:
        for s in Session.query.filter_by(owner=current_user, name=session.name).all():
            s.open = False
    session.open = not session.open
    db.session.commit()
    return True


def check_session_owner(sid):
    # TODO: To use as decorator ?
    return bool(Session.query.filter_by(id=sid, owner=current_user).first())
