from models.base import db
from models import Session, Record

from sqlalchemy import func
from flask import Blueprint, render_template, request, redirect, url_for, jsonify


sessions_bp = Blueprint('sessions', __name__)


@sessions_bp.route('/sessions', methods=["GET"])
def show_sessions():
    return render_template("sessions.html")


@sessions_bp.route('/get-sessions', methods=["GET"])
def get_sessions():
    all_sessions = Session.query.order_by(Session.id).all()
    dict_sessions = [s.to_dict() for s in all_sessions]
    return jsonify(dict_sessions)


@sessions_bp.route("/add-session", methods=["POST"])
def add_session():
    data = request.form
    register_session(data['owner'], data['name'], data['description'])
    return redirect(url_for('sessions.show_sessions'))


@sessions_bp.route("/del-session", methods=["GET"])
def del_session():
    if 'id' in request.args:
        sid = int(request.args['id'])
        delete_session(sid)
    return redirect(url_for('sessions.show_sessions'))


@sessions_bp.route("/toggle-session", methods=["GET"])
def toggle_session():
    if 'id' in request.args:
        sid = int(request.args['id'])
        toggle_session_state(sid)
    return redirect(url_for('sessions.show_sessions'))


def register_session(owner, name, description=""):
    if owner == '' or name == '':
        return False

    if db.session.query(Session.id).filter(Session.owner == owner, Session.name == name).first():
        return False

    sid = (db.session.query(func.max(Session.id)).scalar() or 0) + 1
    session = Session(id=sid, name=name, owner=owner, description=description)
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
