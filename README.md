# "Conference Call on the Web" OvenSpace

## What is OvenSpace?
OvenSpace started with the idea of a more fun way to test WebRTC input, which was a new feature in [OvenMediaEngine](https://github.com/AirenSoft/OvenMediaEngine), Open-Source Streaming Server with Sub-Second Latency.

OvenSpace is basically built with OvenMediaEngine as a streaming server and OvenPlayer as an HTML5 player. So everyone can easily build a more reliable conference call and video chat system on the web using our open-source projects.

## What is the goal of this project?
AirenSoft aims to make it easier for you to build a stable broadcasting/streaming service with Sub-Second Latency. Therefore, we will continue developing and providing the most optimized tools for smooth Sub-Second Latency Streaming.

Would you please click on each link below for details:

- ["Live Streaming Encoder for Mobile" OvenLiveKit SDK](https://www.airensoft.com/olk)
- ["Sub-Second Latency Streaming Server" OvenMediaEngine](https://www.ovenmediaengine.com/ome)
- ["HTML5 Player" OvenPlayer](https://www.ovenmediaengine.com/ovenplayer)
## Try out OvenSpace
Visit the [space.ovenplayer.com](https://space.ovenplayer.com/) and start a conference call.

## Features
- Can Instantly start Sub-Second Latency Online Video Conference Call
- Available on desktop and mobile browsers. No plugins are required.
- Can configure to use your own OvenMediaEngine.

## Installation
Describes things about installing OvenSpace.
### Python3.6 is required
OvenSpace is running using [Flask](https://flask.palletsprojects.com/en/2.0.x/) web framework in Python 3.6 environment. If you do not have Python 3.6 installed on your operating system, you will need to install it.

### Install OvenSpace
Clone the repository and navigate into project directory
```
$ git clone https://github.com/AirenSoft/OvenSpace.git && cd OvenSpace
```
Create python virtual environments. Please make sure you are using 3.6.x version of Python. And activate virtual environment. Detailed explanation is [here](https://docs.python.org/3.6/library/venv.html#creating-virtual-environments).
```
$ python -m venv venv
$ source venv/bin/activate
```
Install all python modules that OvenSpace requires.
```
(venv) $ pip install -r requirements.txt
```
Launch OvenSpace. You can check the OvenSpace running at http://localhost:5000. This is simple method for testing and development purposes. Running OvenSpace in a real environment is described in the Deploy OvenSpace topic.
```
(venv) $ python OvenSpacy.py
```

## Configuration
### OvenSpace configuration
The `ovenspace.cfg` file allows you to configure the settings needed to connect with the OvenMediaEngine from the OvenSpace.
The settings are as follows:
```python
OME_HOST = 'your.oven_media_engine.com'

OME_API_ENABLE_TLS = 'true'
OME_API_PORT = '8082'
OME_API_ACCESS_TOKEN = 'your_api_access_token'

OME_VHOST_NAME = 'default'
OME_APP_NAME = 'app'
OME_STREAM_NAME = 'stream'

OME_WEBRTC_PROVIDER_ENABLE_TLS = 'true'
OME_WEBRTC_PROVIDER_PORT = '3333'

OME_WEBRTC_PUBLISHER_ENABLE_TLS = 'true'
OME_WEBRTC_PUBLISHER_PORT = '3333'
```
#### `OME_HOST`
Sets the OvenMediaEngine's domain or IP address. In case of TLS connection, set the domain.
#### `OME_API_ENABLE_TLS`
`'true'` or `'false'`. Determines whether to use TLS when calling OvenMediaEngine's REST API. 
#### `OME_API_PORT`
Sets the [port of OvenMediaEngine's REST API Server](https://airensoft.gitbook.io/ovenmediaengine/rest-api#port). If you set `OME_API_ENABLE_TLS` to `'true'` use  the `TLSPort` of OvenMediaEngine API Server.
#### `OME_API_ACCESS_TOKEN`
Sets the [token to be used for authentication](https://airensoft.gitbook.io/ovenmediaengine/rest-api#host-and-permissions) when calling the OvenMediEngin REST APIs.
#### `OME_VHOST_NAME`
Sets the [virtual host](https://airensoft.gitbook.io/ovenmediaengine/configuration#virtual-host) of OvenMediaEngine that OvenSpace will use.

#### `OME_APP_NAME`
Sets the [application name](https://airensoft.gitbook.io/ovenmediaengine/configuration#application) of OvenMediaEngine that OvenSpace will use.

#### `OME_STREAM_NAME`
Sets the stream name that OvenSpace will use to send or receive streams to the OvenMediaEngine. If `OME_STREAM_NAME` is set to `'stream-'`, OvenSpace sends and receives streams in the format `'stream-0'`, `'stream-1'`, `'stream-2'`.

#### `OME_WEBRTC_PROVIDER_ENABLE_TLS`
`'true'` or `'false'`. Determines whether to use TLS when signalling with OvenMediaEngine's [WebRTC Provider](https://airensoft.gitbook.io/ovenmediaengine/live-source/webrtc-beta).

#### `OME_WEBRTC_PROVIDER_PORT`
Sets the [signalling port of WebRTC Provider](https://airensoft.gitbook.io/ovenmediaengine/live-source/webrtc-beta#bind). If you set `OME_WEBRTC_PROVIDER_ENABLE_TLS` to `'true'` use  the `TLSPort` of  [WebRTC Provider](https://airensoft.gitbook.io/ovenmediaengine/live-source/webrtc-beta).

#### `OME_WEBRTC_PUBLISHER_ENABLE_TLS`
`'true'` or `'false'`. Determines whether to use TLS when signalling with OvenMediaEngine's [WebRTC Publisher](https://airensoft.gitbook.io/ovenmediaengine/streaming/webrtc-publishing).

#### `OME_WEBRTC_PUBLISHER_PORT`
Sets the [signalling port of WebRTC Publisher](https://airensoft.gitbook.io/ovenmediaengine/streaming/webrtc-publishing#configuration). If you set `OME_WEBRTC_PUBLISHER_ENABLE_TLS` to `'true'` use  the `TLSPort` of  [WebRTC Publisher](https://airensoft.gitbook.io/ovenmediaengine/streaming/webrtc-publishing).

## For more information
- [OvenSpace Demo](https://space.ovenplayer.com/)
- [OvenMediaEngine Website](https://ovenmediaengine.com/)
- [OvenMediaEngine GitHub](https://github.com/AirenSoft/OvenMediaEngine)
- [OvenMediaEngine Tutorial](https://airensoft.gitbook.io/ovenmediaengine/)
- [OvenPlayer Github](https://github.com/AirenSoft/OvenPlayer)
- [OvenPlayer Tutorial](https://airensoft.gitbook.io/ovenplayer)
- [AirenSoft Website](https://www.airensoft.com/)
