import logging

import flask
import flask_cors
from flask import request

import kitty_cam.turret

logging.basicConfig()

_log = logging.getLogger(__name__)

app = flask.Flask(__name__)
app.config.update({
    'LIRCD_SOCKET': '/run/lircd/lircd.sock',
})
app.config.from_envvar('KITTY_CAM_SETTINGS', silent=True)

log_level = logging.INFO

# Don't cache in debug mode
if app.config['DEBUG']:
    log_level = logging.DEBUG
    app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

logging.getLogger(__package__).setLevel(log_level)

# Allow cross-origin requests
flask_cors.CORS(app)

_turret = kitty_cam.turret.Turret(socket=app.config['LIRCD_SOCKET'])


@app.route('/')
def root():
    return flask.render_template('index.html')


@app.route('/move', methods=('POST',))
def move():
    command = request.get_json()
    _turret.move(command['pan_speed'], command['tilt_speed'])
    return '', 204
