from flask import Flask
from flask_migrate import Migrate

import routes
import models
import utils


# TODO: make an owner page, add more fields, max Q number
# Parameters : On/off switch latex, latex font-size
# Add dashboard page: List of sessions on the top, screen split in two with last records on the left, clickable bar graph with num people/question
# For records page : split record by session, allow search/filtering by people, add correct answer and check
# For sessions page : Add nb participants (https://docs.sqlalchemy.org/en/13/orm/tutorial.html#using-subqueries), are you sure delete button
# Other views : Follow one participant in a session, see number of participants who have answer each questions as a bar graph
# DDOS / Overflow protection (check IP sent ratio over last minute)
# All live with server push : https://stackoverflow.com/questions/12232304/how-to-implement-server-push-in-flask-framework


def create_app():
    app = Flask(__name__, static_folder='dist', static_url_path='/')
    app.config["DEBUG"] = True
    routes.init_app(app)
    models.init_app(app)
    utils.init_app(app)
    return app


app = create_app()
migrate = Migrate(app, models.db)


if __name__ == "__main__":
    print("======================== START ==========================")
    app.run(host='0.0.0.0', port=50001, debug=True, threaded=True)
