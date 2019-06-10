from flask import Blueprint, render_template

index_bp = Blueprint('index', __name__)


@index_bp.route('/', methods=["GET"])
def index():
    return render_template("index.html")
