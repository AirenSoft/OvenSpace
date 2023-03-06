import base64
import requests
from flask import Flask, render_template
from flask_socketio import SocketIO, emit
from urllib import parse

from components.user import User

app = Flask(__name__)
app.config.from_pyfile('ovenspace.cfg')
socketio = SocketIO(app, cors_allowed_origins="*", async_handlers=True)


def get_http_protocol(enable_tls):
    protocol = 'http'

    if 'true' in enable_tls:
        protocol = 'https'

    return protocol


def get_ws_protocol(enable_tls):
    protocol = 'ws'

    if 'true' in enable_tls:
        protocol = 'wss'

    return protocol


def encode_access_token(token):
    return base64 \
        .b64encode(token.encode('utf-8')) \
        .decode('utf-8')


OME_HOST = app.config['OME_HOST']

OME_API_PROTOCOL = get_http_protocol(app.config['OME_API_ENABLE_TLS'])
OME_API_HOST = f'{OME_API_PROTOCOL}://{OME_HOST}:{app.config["OME_API_PORT"]}/v1'
OME_API_AUTH_HEADER = {'authorization': 'Basic ' +
                                        encode_access_token(app.config['OME_API_ACCESS_TOKEN'])}

OME_VHOST_NAME = app.config['OME_VHOST_NAME']
OME_APP_NAME = app.config['OME_APP_NAME']
OME_STREAM_NAME = app.config['OME_STREAM_NAME']

OME_API_GET_STREAMS = OME_API_HOST + \
                      f'/vhosts/{OME_VHOST_NAME}/apps/{OME_APP_NAME}/streams'

OME_RTMP_INPUT_URL = f'rtmp://{OME_HOST}:{ app.config["OME_RTMP_PROVIDER_PORT"]}/{OME_APP_NAME}'


percent_encoded_stream_id = parse.quote(f'srt://{OME_HOST}:{ app.config["OME_SRT_PROVIDER_PORT"]}/{OME_APP_NAME}/', safe='')
OME_SRT_INPUT_URL = f'srt://{OME_HOST}:{ app.config["OME_SRT_PROVIDER_PORT"]}?streamid={percent_encoded_stream_id}'

OME_WEBRTC_INPUT_PROTOCOL = get_ws_protocol(
    app.config['OME_WEBRTC_PROVIDER_ENABLE_TLS'])
OME_WEBRTC_INPUT_HOST = f'{OME_WEBRTC_INPUT_PROTOCOL}://{OME_HOST}:{app.config["OME_WEBRTC_PROVIDER_PORT"]}'

OME_WEBRTC_STREAMING_PROTOCOL = get_ws_protocol(
    app.config['OME_WEBRTC_PUBLISHER_ENABLE_TLS'])
OME_WEBRTC_STREAMING_HOST = f'{OME_WEBRTC_STREAMING_PROTOCOL}://{OME_HOST}:{app.config["OME_WEBRTC_PUBLISHER_PORT"]}'

OME_LLHLS_STREAMING_PROTOCOL = get_http_protocol(
    app.config['OME_LLHLS_PUBLISHER_ENABLE_TLS'])
OME_LLHLS_STREAMING_HOST = f'{OME_LLHLS_STREAMING_PROTOCOL}://{OME_HOST}:{app.config["OME_LLHLS_PUBLISHER_PORT"]}'

users = User.instance()


@app.route("/")
def space():
    return render_template(
        'index.html',
        app_name=OME_APP_NAME,
        stream_name=OME_STREAM_NAME,
        rtmp_input_url=OME_RTMP_INPUT_URL,
        srt_input_url=OME_SRT_INPUT_URL,
        webrtc_input_host=OME_WEBRTC_INPUT_HOST,
        webrtc_streaming_host=OME_WEBRTC_STREAMING_HOST,
        llhls_streaming_host=OME_LLHLS_STREAMING_HOST
    )


@app.route("/getStreams")
def get_streams():
    try:
        response = requests.get(OME_API_GET_STREAMS,
                                headers=OME_API_AUTH_HEADER, timeout=0.3)
        return response.json(), response.status_code
    except Exception as e:
        return str(e), 500


@socketio.on('connect')
def on_connect():
    users.add_user()

    emit('user count', {
        'user_count': users.get_user_count()
    }, broadcast=True)


@socketio.on('disconnect')
def on_disconnect():
    users.remove_user()

    emit('user count', {
        'user_count': users.get_user_count()
    }, broadcast=True)


if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000,
                 debug=True, use_reloader=True)
