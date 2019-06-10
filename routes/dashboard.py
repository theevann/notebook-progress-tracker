from models import Session

from flask import Blueprint, render_template, request
from flask_login import login_required

dashboard_bp = Blueprint('dashboard', __name__)


@dashboard_bp.route('/dashboard', methods=["GET"])
@login_required
def get_bar():
    sid = request.args.get('id', None)
    return render_template("bar_graph.html", sid=sid, sessions=Session.query.order_by(Session.id).all(), fields=Session.columns())
