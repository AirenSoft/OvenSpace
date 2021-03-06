let currentStreams = [];
let localStreams = [];
let selectedInputStreamName = null;
let shareMode = null;
let webRTCInput = null;
let tryToStreaming = false;

const SEAT_COUNT = 9;

const seatArea = $('#seat-area');
const seatTemplate = _.template($('#seat-template').html());

const inputVideo = document.getElementById('input-video');

const beforeStreamingTitle = $('#before-streaming-title');

const deviceInputPreviewArea = $('#device-input-preview-area');
const rtmpInputPreviewArea = $('#rtmp-input-preview-area');
const captureSelectArea = $('#capture-select-area');

const videoSourceSelect = $('#video-source-select');
const audioSourceSelect = $('#audio-source-select');
const constraintsSelect = $('.constraints-select');

const rtmpInputUrlInput = $('#rtmp-input-url-input');
const rtmpInputStreamkeyInput = $('#rtmp-input-streamkey-input');
const waitingRtmpInputText = $('#waiting-rtmp-input-text');
const connectedRtmpInputText = $('#connected-rtmp-input-text');

const shareDeviceButton = $('#share-device-button');
const shareDisplayButton = $('#share-display-button');
const shareRtmpButton = $('#share-rtmp-button');

const backToCaptureSelectButton = $('.back-to-capture-select-button');
const startShareButton = $('#start-share-button');

const inputErrorMessage = $('#input-error-message');

const inputDeviceModal = $('#input-device-modal');

const totalUserCountSpan = $('#total-user-count-span');
const videoUserCountSpan = $('#video-user-count-span');

shareDeviceButton.on('click', function () {

    shareMode = 'device';

    OvenLiveKit.getDevices()
        .then(function (devices) {

            if (devices) {
                renderDevice('video', videoSourceSelect, devices.videoinput,);
                renderDevice('audio', audioSourceSelect, devices.audioinput);
            }

            createWebRTCInput();
        })
        .catch(function (error) {

            showErrorMessage(error);
        });
});

shareRtmpButton.on('click', function () {
    shareMode = 'rtmp';
    readyStreaming();
});

constraintsSelect.on('change', function () {

    if (webRTCInput) {

        webRTCInput.remove();
        webRTCInput = null;
    }

    createWebRTCInput();
});

shareDisplayButton.on('click', function () {

    shareMode = 'display';

    createWebRTCInput();
});

backToCaptureSelectButton.on('click', function () {

    cancelReadyStreaming();
});

startShareButton.on('click', function () {

    startStreaming();
});

function renderDevice(type, select, devices) {

    select.empty();

    if (devices.length === 0) {

        select.append('<option value="">No Source Available</option>')
    } else {

        _.each(devices, function (device) {

            let option = $('<option></option>');

            option.text(device.label);
            option.val(device.deviceId);

            select.append(option);
        });
    }

    select.find('option').eq(0).prop('selected', true);
}

function createWebRTCInput(streamName) {

    webRTCInput = OvenLiveKit.create({
        callbacks: {
            connected: function () {

                console.log('App Connected');

                if (tryToStreaming) {

                    createLocalPlayer(selectedInputStreamName);
                    inputDeviceModal.modal('hide');

                    tryToStreaming = false;
                }
            },
            connectionClosed: function (type, event) {

                console.log('App Connection Closed');

                if (type === 'websocket') {

                }
                if (type === 'ice') {

                }
            },
            iceStateChange: function (state) {

                console.log('App ICE State', state);
            },
            error: function (error) {

                console.log('App Error On OvenLiveKit', error);

                if (tryToStreaming) {

                    localStreams.pop(selectedInputStreamName);
                    currentStreams.pop(selectedInputStreamName);
                    tryToStreaming = false;
                }

                showErrorMessage(error);
            }
        }
    });

    webRTCInput.attachMedia(inputVideo);

    if (shareMode === 'device') {

        webRTCInput.getUserMedia(getDeviceConstraints()).then(function (stream) {


            deviceInputPreviewArea.removeClass('d-none');
            readyStreaming();
        }).catch(function (error) {
            cancelReadyStreaming();
            showErrorMessage(error);
        });
    }

    if (shareMode === 'display') {

        webRTCInput.getDisplayMedia(getDisplayConstraints()).then(function (stream) {

            readyStreaming();
        }).catch(function (error) {
            cancelReadyStreaming();
            showErrorMessage(error);
        });
    }
}

function readyStreaming() {

    captureSelectArea.addClass('d-none');
    inputErrorMessage.addClass('d-none').text('');

    if (shareMode === 'device' || shareMode === 'display') {
        deviceInputPreviewArea.find('button').prop('disabled', false);
        beforeStreamingTitle.text('Click start button to share your WebCam / Mic');
    }

    if (shareMode === 'rtmp') {
        rtmpInputPreviewArea.find('button').prop('disabled', false);
        rtmpInputPreviewArea.removeClass('d-none');
        beforeStreamingTitle.text('Send the input stream using a live encoder.');

        rtmpInputUrlInput.val(OME_RTMP_INPUT_URL);
        rtmpInputStreamkeyInput.val(selectedInputStreamName);
    }

}

function resetInputUI() {

    inputVideo.srcObject = null;
    selectedInputStreamName = null;
    shareMode = null;

    deviceInputPreviewArea.addClass('d-none');
    deviceInputPreviewArea.find('button').prop('disabled', true);

    rtmpInputPreviewArea.addClass('d-none');
    rtmpInputPreviewArea.find('button').prop('disabled', true);

    rtmpInputUrlInput.val('');
    rtmpInputStreamkeyInput.val('');

    waitingRtmpInputText.removeClass('d-none');
    connectedRtmpInputText.addClass('d-none');


    beforeStreamingTitle.text('Please choose sharing mode');
    captureSelectArea.removeClass('d-none');

    inputErrorMessage.addClass('d-none').text('');
}

function cancelReadyStreaming() {

    if (webRTCInput) {

        webRTCInput.remove();
        webRTCInput = null;
    }

    resetInputUI();
}

function showErrorMessage(error) {

    let errorMessage = '';

    if (error.message) {

        errorMessage = error.message;
    } else if (error.name) {

        errorMessage = error.name;
    } else {

        errorMessage = error.toString();
    }

    if (errorMessage === 'OverconstrainedError') {

        errorMessage = 'The input device does not support the specified resolution or frame rate.';
    }

    if (errorMessage === 'Cannot create offer') {

        errorMessage = 'Cannot create stream.';
    }

    inputErrorMessage.removeClass('d-none').text(errorMessage);
}

function startStreaming() {

    if (selectedInputStreamName && webRTCInput) {

        tryToStreaming = true;
        localStreams.push(selectedInputStreamName);
        currentStreams.push(selectedInputStreamName);

        webRTCInput.startStreaming(OME_WEBRTC_INPUT_HOST + '/' + APP_NAME + '/' + selectedInputStreamName + '?direction=send&transport=tcp', {
            maxVideoBitrate: 500
        });
    }
}

inputDeviceModal.on('hidden.bs.modal', function () {
    resetInputUI();
});

function getDeviceConstraints() {

    let videoDeviceId = videoSourceSelect.val();
    let audioDeviceId = audioSourceSelect.val();

    let newConstraints = {};

    if (videoDeviceId) {
        newConstraints.video = {
            deviceId: {
                exact: videoDeviceId
            },
            width: {
                ideal: 1280
            },
            height: {
                ideal: 720
            }
        };
    }

    if (audioDeviceId) {
        newConstraints.audio = {
            deviceId: {
                exact: audioDeviceId
            }
        };
    }

    newConstraints.aspectRatio = {
        ideal: 16 / 9
    };

    return newConstraints;
}

function getDisplayConstraints() {

    let newConstraint = {};

    newConstraint.video = true;
    newConstraint.audio = true;

    return newConstraint;
}

function renderSeats() {

    let seatRendered = 0;

    for (let i = 0; i < SEAT_COUNT; i++) {

        const seat = $(seatTemplate({
            streamName: STREAM_NAME + seatRendered
        }));

        seat.find('.join-button ').data('stream-name', STREAM_NAME + seatRendered);

        seat.find('.join-button ').on('click', function (e) {

            selectedInputStreamName = $(this).data('stream-name');

            inputDeviceModal.modal('show');
        });

        seat.on('mouseenter', function () {

            seat.find('.local-player-span').fadeIn();
        });

        seat.on('mouseleave', function () {
            seat.find('.local-player-span').fadeOut();
        });


        seatArea.append(seat);

        seatRendered++;
    }
}

function createLocalPlayer(streamName) {

    const seat = $('#seat-' + streamName);

    seat.addClass('seat-on');

    seat.find('.local-player-area').removeClass('d-none');

    document.getElementById('local-player-' + streamName).srcObject = webRTCInput.stream;
}

function createPlayer(streamName) {

    const seat = $('#seat-' + streamName);

    seat.addClass('seat-on');

    seat.find('.player-area').removeClass('d-none');

    const playerOption = {
        // image: OME_THUMBNAIL_HOST + '/' + APP_NAME + '/' + streamName + '/thumb.png',
        autoStart: true,
        sources: [
            {
                type: 'webrtc',
                file: OME_WEBRTC_STREAMING_HOST + '/' + APP_NAME + '/' + streamName + '?transport=tcp'
            }
        ]
    };

    const player = OvenPlayer.create(document.getElementById('player-' + streamName), playerOption);

    player.on('error', function (error) {

        console.log('App Error On Player', error);

        destroyPlayer(streamName);
    });
}

function destroyPlayer(streamName) {
    console.log('>>> destroyPlayer', streamName);
    currentStreams.pop(streamName);
    localStreams.pop(streamName);

    const seat = $('#seat-' + streamName);
    seat.removeClass('seat-on');

    seat.find('.player-area').addClass('d-none');

    const player = OvenPlayer.getPlayerByContainerId('player-' + streamName);

    if (player) {

        player.remove();
    }

    seat.find('.local-player-area').addClass('d-none');

    const localPlayer = document.getElementById('local-player-' + streamName);

    if (localPlayer) {

        localPlayer.srcObject = null;
    }
}

async function getStreams() {

    const promise = await $.ajax({
        method: 'get',
        url: '/getStreams',
    });

    return promise;
}

function gotStreams(resp) {

    if (resp.statusCode === 200) {

        const streams = resp.response;

        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');

        // handled streams in OvenSpace. Local streams + Remote streams.
        console.log('>>> currentStreams', currentStreams);

        // Local streams sending to OvenMediaEngine from user device.
        console.log('>>> local  Streams', localStreams);

        // All streams created in OvenMediaEngine.
        console.log('>>> ome    streams', streams);


        const missingLocalStreams = [];

        // Care ome stream creating is slow
        localStreams.forEach(streamName => {

            if (!streams.includes(streamName)) {
                missingLocalStreams.push(streamName);
            }
        });

        console.log('>>> missingStreams', missingLocalStreams);

        missingLocalStreams.forEach(streamName => {
            streams.push(streamName);
        });

        streams.forEach((streamName, index) => {

            // Create player when new stream is detected
            if (!currentStreams.includes(streamName)) {

                // rtmp input stream detected
                if (shareMode === 'rtmp'
                    && streamName === selectedInputStreamName) {

                    waitingRtmpInputText.addClass('d-none');
                    connectedRtmpInputText.removeClass('d-none');

                    setTimeout(function () {

                        inputDeviceModal.modal('hide');
                    }, 3000)
                }

                // making peer connection with zero delay don't work well...
                setTimeout(function () {
                    console.log('>>> createPlayer', streamName);
                    createPlayer(streamName);
                }, 200 * index);
            }
        });

        currentStreams.forEach(streamName => {

            // Delete player when exising stream is removed
            if (!streams.includes(streamName) && !localStreams.includes(streamName)) {

                destroyPlayer(streamName);
            }
        });

        currentStreams = streams;

        videoUserCountSpan.text(currentStreams.length);
    }
}

function checkStream() {

    getStreams().then(gotStreams).catch(function (e) {
        console.error('Could not get streams from OME.');
    });
}

function startStreamCheckTimer() {

    checkStream();

    setInterval(() => {

        checkStream();
    }, 2500);
}

let socket = io({
    transports: ['websocket']
});

socket.on('user count', function (data) {
    totalUserCountSpan.text(data.user_count);
});

renderSeats();

checkStream();

startStreamCheckTimer();