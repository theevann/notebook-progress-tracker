import os
from .auth import login_manager

from .index import index_bp
from .login import login_bp
from .sessions import sessions_bp
from .records import records_bp
from .dashboard import dashboard_bp
from .settings import settings_bp
from .sendcode import sendcode_bp
from .pusher import pusher_bp


def init_app(app):
    app.register_blueprint(index_bp)
    app.register_blueprint(login_bp)
    app.register_blueprint(sessions_bp)
    app.register_blueprint(records_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(settings_bp)
    app.register_blueprint(sendcode_bp)
    app.register_blueprint(pusher_bp)
    app.secret_key = os.getenv("SECRET_KEY")
    login_manager.init_app(app)
