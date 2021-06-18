from flask import Blueprint, request


sendcode_bp = Blueprint('sendcode', __name__)


@sendcode_bp.route('/get-send-code', methods=["GET"])
def get_send_code():
    return f"""
import io
import sys
import json
import uuid
import platform
import hashlib
import requests
import inspect

from IPython.core.magics.code import extract_symbols

_npt_config = {{
    'sender_uuid': hashlib.md5((platform.node() + str(uuid.getnode())).encode()).hexdigest(),
    'server_url': '{request.url_root}'
}}

def npt_init_pusher():
    if 'npt_config' not in globals():
        print('Variable npt_config is not defined')
        return

    own_channel = hashlib.md5("{{session_name}}_{{session_owner}}_{{sender_uuid}}".format(**npt_config, **_npt_config).lower().encode()).hexdigest()
    all_channel = hashlib.md5("{{session_name}}_{{session_owner}}".format(**npt_config).lower().encode()).hexdigest()

    # Make server url available in JS
    serverurl_js_code = r"window._npt_server_url = '%s';" % _npt_config['server_url']
    # Make channels names available in JS
    channels_js_code = r"window._npt_all_channel = '%s';window._npt_own_channel = '%s';" % (all_channel, own_channel)
    # Load Vanillatoast and Pusher
    client_js_code = requests.get("{{}}js/jpt-client.js".format(_npt_config['server_url'])).content.decode()
    
    display(Javascript(serverurl_js_code + "\\n" + channels_js_code + "\\n" + client_js_code))


def _npt_get_class_code(cls):
    cell_code = "".join(inspect.linecache.getlines(_npt_get_file(cls)))
    class_code = extract_symbols(cell_code, cls.__name__)[0][0]
    return class_code

def _npt_get_file(object):
    if not inspect.isclass(object):
        return inspect.getfile(object)
    
    if hasattr(object, '__module__'):
        object_ = sys.modules.get(object.__module__)
        if hasattr(object_, '__file__'):
            return object_.__file__
    
    for name, member in inspect.getmembers(object):
        if inspect.isfunction(member) and object.__qualname__ + '.' + member.__name__ == member.__qualname__:
            return inspect.getfile(member)
    raise TypeError('Source for {{!r}} not found'.format(object))

def _npt_get_binary_image(img, save_fn):
    with io.BytesIO() as buffer:
        getattr(img, save_fn)(buffer, format='jpeg', quality=20)
        return buffer.getvalue()

def send(data, q_nb):
    if 'npt_config' not in globals():
        print('Variable npt_config is not defined')
        return

    url = _npt_config['server_url'] + 'add-record'
    file = {{}}
    form = {{
        'question_nb': q_nb,
        'session_name': npt_config.get('session_name'),
        'part_name': npt_config.get('part_name', 'default'),
        'session_owner': npt_config.get('session_owner'),
        'sender_name': npt_config.get('sender_name'),
        'sender_uuid': _npt_config.get('sender_uuid')
    }}

    datatype = type(data).__name__
    if datatype == 'str':
        form['type'] = datatype
        form['data'] = data
    elif datatype in ['int', 'float']:
        form['type'] = 'ndarray'
        form['data'] = json.dumps([data])
    elif datatype == 'list':
        form['type'] = datatype
        form['data'] = json.dumps(data)
    elif datatype == 'dict':
        form['type'] = datatype
        form['data'] = json.dumps(data)
    elif datatype == 'ndarray':
        form['type'] = datatype
        form['data'] = json.dumps(data.tolist())
    elif datatype == 'Tensor':
        form['type'] = 'ndarray'
        form['data'] = json.dumps(data.numpy().tolist())
    elif datatype == 'function':
        form['type'] = 'code'
        form['data'] = inspect.getsource(data)
    elif inspect.isclass(data):
        form['type'] = 'code'
        form['data'] = _npt_get_class_code(data)
    elif 'torch.nn.modules' in type(data).__module__:
        form['type'] = 'code'
        form['data'] = str(data)
    elif datatype == 'Figure' or (datatype == 'module' and data.__name__ == 'matplotlib.pyplot'):
        data = data if datatype == 'Figure' else plt.gcf()
        if not data.get_axes():
            print("! Warning, your figure is blank !\\nMake sure the send function is in the same cell as the plot, or send the matplotlib figure itself.")
        form['type'] = 'image'
        file['file'] = _npt_get_binary_image(data, 'savefig')
    elif datatype == 'JpegImageFile':
        form['type'] = 'image'
        file['file'] = _npt_get_binary_image(data, 'save')

    else:
        print('Datatype not supported')
        return

    response = requests.post(url, data=form, files=file)

    if npt_config.get('log', False):
        print(response.content.decode())
    return response
"""
