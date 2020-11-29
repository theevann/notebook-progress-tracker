from flask import Blueprint, request


sendcode_bp = Blueprint('sendcode', __name__)


@sendcode_bp.route('/get-send-code', methods=["GET"])
def get_send_code():
    return """
import io
import json
import requests
import inspect

def get_binary_image(plt_obj):
    with io.BytesIO() as buffer:
        plt_obj.savefig(buffer, format='jpeg', quality=20, dpi=70)
        return buffer.getvalue()

def send(data, q_nb):
    if 'npt_config' not in globals():
        print('Variable npt_config is not defined')
        return

    url = '{0}add-record'
    file = {{}}
    form = {{
        'question_nb': q_nb,
        'session_name': npt_config.get('session_name'),
        'part_name': npt_config.get('part_name', 'default'),
        'session_owner': npt_config.get('session_owner'),
        'sender_name': npt_config.get('sender_name')
    }}

    datatype = type(data).__name__
    if datatype in ["int", "float"]:
        form['type'] = "ndarray"
        form['data'] = json.dumps([data])
    elif datatype == "ndarray":
        form['type'] = datatype
        form['data'] = json.dumps(data.tolist())
    elif datatype == 'function':
        form['type'] = datatype
        form['data'] = inspect.getsource(data)
    elif datatype == 'module' and data.__name__ == 'matplotlib.pyplot':
        form['type'] = 'image'
        file['file'] = get_binary_image(data)
    else:
        form['type'] = datatype
        form['data'] = data

    response = requests.post(url, data=form, files=file)

    if npt_config.get('log', False):
        print(response.content.decode())
    return response
""".format(request.url_root)
