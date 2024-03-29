from models.base import db
from models import Session, Record, SessionPart, SessionShare
from .auth import load_user

from sqlalchemy import or_
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
    dict_sessions = [s.to_dict() for s in current_user.sessions]
    dict_sessions += [s.to_dict(sharing=True) for s in current_user.shared_sessions]
    return jsonify(dict_sessions)


@sessions_bp.route('/get-session', methods=["GET"])
@login_required
def get_session():
    dict_session = Session.query.filter_by(owner=current_user, id=request.args['id']).one().to_dict()
    dict_session['parts'] = [p.to_dict() for p in SessionPart.query.filter_by(session_id=request.args['id']).all()]
    return jsonify(dict_session)


@sessions_bp.route("/add-share", methods=["GET"])
@login_required
def add_share():
    if not 'sid' in request.args or not 'username' in request.args:
        return "Fail"  

    sid = int(request.args['sid'])
    session = Session.query.filter_by(id=sid, owner=current_user).first()
    if not session:
        return "Fail"
        
    username = request.args['username']
    shared_user = load_user(username)
    if shared_user is None or shared_user == current_user:
        return "Fail"

    share = SessionShare.query.filter_by(session=session, shared_user_id=shared_user.id).first()
    if share:
        return "Fail"
        
    share = SessionShare(session=session, shared_user_id=shared_user.id)
    db.session.add(share)
    db.session.commit()
    return "Success"


@sessions_bp.route("/del-share", methods=["GET"])
@login_required
def del_share():
    if not 'sid' in request.args:
        return "Fail"

    sid = int(request.args['sid'])
    session = Session.query.filter_by(id=sid).filter(or_(Session.owner == current_user, Session.shared_users.contains(current_user)))
    if not session.first():
        return "Fail"

    if 'username' in request.args:
        username = request.args['username']
        shared_user = load_user(username)
    else:
        shared_user = current_user

    if shared_user is None:
        return "Fail"

    SessionShare.query.filter_by(session_id=sid, shared_user=shared_user).delete()
    db.session.commit()
    return "Success"


@sessions_bp.route("/add-session", methods=["POST"])
@login_required
def add_session():
    data = request.form
    Session.register_new(data['name'], data['description'], current_user)
    return redirect(url_for('sessions.show_sessions'))


@sessions_bp.route("/del-session", methods=["GET"])
@login_required
def del_session():
    if 'id' in request.args:
        sid = int(request.args['id'])
        session = get_session_by_id(sid)
        if session is not None:
            session.delete()
    return redirect(url_for('sessions.show_sessions'))


@sessions_bp.route("/toggle-session", methods=["GET"])
@login_required
def toggle_session():
    if 'id' in request.args:
        sid = int(request.args['id'])
        session = get_session_by_id(sid)
        if session is not None:
            session.toggle_state()
    return redirect(url_for('sessions.show_sessions'))


@sessions_bp.route("/update-session", methods=["POST"])
@login_required
def update_session():
    if 'id' in request.form:
        data = request.form
        session = get_session_by_id(data['id'])
        if not session:
            return "No such session", 400
            
        session.name = data['name']
        session.description = data['description']

        if Session.query.filter_by(name=data['name'], owner=current_user, open=True).first():
            session.open = False

        db.session.commit()
    return "OK", 200



# SESSION-PARTS RELATED


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
    return "OK", 200


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



def get_session_by_id(sid):
    return Session.query.filter_by(id=sid, owner=current_user).first()
