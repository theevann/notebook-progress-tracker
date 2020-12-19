import os
from dotenv import load_dotenv

from .base import db
from .record import Record
from .session import Session
from .session_sharing import SessionShare
from .session_part import SessionPart
from .user import User


project_folder = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(project_folder, os.pardir, 'app-env'))

SQLALCHEMY_DATABASE_URI = "mysql+mysqlconnector://{username}:{password}@{hostname}/{databasename}".format(
    username=os.getenv("DB_USERNAME"),
    password=os.getenv("DB_PASSWORD"),
    hostname=os.getenv("DB_HOSTNAME"),
    databasename=os.getenv("DB_NAME"),
)


def init_app(app):
    app.config["SQLALCHEMY_DATABASE_URI"] = SQLALCHEMY_DATABASE_URI
    app.config["SQLALCHEMY_POOL_RECYCLE"] = 299
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    db.init_app(app)
