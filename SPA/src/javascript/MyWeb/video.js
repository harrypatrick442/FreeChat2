
//This is very fucking useful. It gets rid of those stupid api differences between browsers.
var RTCPeerConnection = null;
var getUserMedia = null;
var attachMediaStream = null;
var reattachMediaStream = null;
var webrtcDetectedBrowser = null;
function trace(text) {
    if (text[text.length - 1] == '\\') {
        text = text.substring(0, text.length - 1);
    }
    console.log((performance.now() / 1000).toFixed(3) + ": " + text);
}

if (navigator.mozGetUserMedia) {
    console.log("This appears to be Firefox");
    webrtcDetectedBrowser = "firefox";

    RTCPeerConnection = mozRTCPeerConnection;
    RTCSessionDescription = mozRTCSessionDescription;
    RTCIceCandidate = mozRTCIceCandidate;
    getUserMedia = navigator.mozGetUserMedia.bind(navigator);
    attachMediaStream = function (element, stream) {
        console.log("Attaching media stream");
        element.mozSrcObject = stream;
        element.play();
    };
    reattachMediaStream = function (to, from) {
        console.log("Reattaching media stream");
        to.mozSrcObject = from.mozSrcObject;
        to.play();
    };
    MediaStream.prototype.getVideoTracks = function () {
        return [];
    };
    MediaStream.prototype.getAudioTracks = function () {
        return [];
    };
} else if (navigator.webkitGetUserMedia) {
    console.log("This appears to be Chrome");
    webrtcDetectedBrowser = "chrome";
    RTCPeerConnection = webkitRTCPeerConnection;
    getUserMedia = navigator.webkitGetUserMedia.bind(navigator);

    attachMediaStream = function (element, stream) {
        if (typeof element.srcObject !== 'undefined') {
            element.srcObject = stream;
        } else
        {
            if (typeof element.mozSrcObject !== 'undefined') {
                element.mozSrcObject = stream;
            } else
            {
                if (typeof element.src !== 'undefined') {
                    element.src = URL.createObjectURL(stream);
                } else {
                    console.log('Error attaching stream to element.');
                }
            }
        }
    };
    reattachMediaStream = function (to, from) {
        to.src = from.src;
    };
    if (!webkitMediaStream.prototype.getVideoTracks) {
        webkitMediaStream.prototype.getVideoTracks = function () {
            return this.videoTracks;
        };
        webkitMediaStream.prototype.getAudioTracks = function () {
            return this.audioTracks;
        };
    }
    if (!webkitRTCPeerConnection.prototype.getLocalStreams) {
        webkitRTCPeerConnection.prototype.getLocalStreams = function () {
            return this.localStreams;
        };
        webkitRTCPeerConnection.prototype.getRemoteStreams = function () {
            return this.remoteStreams;
        };
    }
} else {
    console.log("Browser does not appear to be WebRTC-capable");
}

navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia || navigator.msGetUserMedia;
window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
window.RTCIceCandidate = window.RTCIceCandidate || window.mozRTCIceCandidate || window.webkitRTCIceCandidate;
window.RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;

function Video(callbacks, type)
{
    var self = this;
    this.div = document.createElement('div');
    this.div.style.width = '100%';
    this.div.style.height = '100%';
    this.div.style.backgroundColor = '#aaaaaa';
    var remoteVideo = document.createElement('video');
    remoteVideo.style.width = '100%';
    remoteVideo.style.height = '100%';
    this.div.appendChild(remoteVideo);
    if (!navigator.getUserMedia) {
        return alert('getUserMedia not supported in this browser.');
    }
    var pc;
    var remoteStream;
    this.connected = false;
    function createNewPC() {
        pc = new RTCPeerConnection(null);
        self.connected = true;//moved from inside onaddstream.
        pc.onaddstream = function (event) {
            //put in function to set div visible and size.
            attachMediaStream(remoteVideo, event.stream);
            remoteStream = event.stream;
            if(callbacks&&callbacks.addedStream)
            {
            callbacks.addedStream();
            }
        };
        pc.onremovestream = function (event) {
            if (callbacks&&callbacks.removedStream)
            {
                callbacks.removedStream();
            }
        };
        pc.oniceconnectionstatechange = function () {
            if (pc.iceConnectionState == 'disconnected') {
                self.disconnect();
            }
        };
        pc.onicecandidate = function gotIceCandidate(event) {
            if (event.candidate != null) {
                callbacks.send({webcam_type: 'ice', ice: event.candidate});
            }
        };
    }
    self.recievedIce = function (jObject) {
        if (jObject.ice != undefined) {
            pc.addIceCandidate(new RTCIceCandidate(jObject.ice));
        }
    };
    this.disconnect = function ()
    {
        console.log('closed');
        if (pc)
        {
            pc.close();
        }
        self.connected = false;
        if (callbacks.disconnected) {
            callbacks.disconnected();
        }
    };
    this.connect = function ()
    {
        pc = undefined;
        createNewPC();
        Video.getWebcamPermission(function () {
            pc.addStream(Video.localStream);
            console.log('ADDED STREEM');
            pc.createOffer(function (offer)
            {
                pc.setLocalDescription(new RTCSessionDescription(offer), function ()
                {
                    callbacks.send({webcam_type: 'request', offer: offer});
                }, err.bind(null, 'connect 2'));
            }, err.bind(null, 'connect 1'));
        });
    };
    this.recievedOffer = function (jObject)
    {
        if (jObject.offer)
        {
            createNewPC();
            pc.setRemoteDescription(new RTCSessionDescription(jObject.offer), function ()
            {
                callbacks.ask(jObject.offer);
            }, err.bind(null, 'recievedOffer'));
        }
    };
    this.accept = function ()
    {
        Video.getWebcamPermission(function () {
            pc.addStream(Video.localStream);
            pc.createAnswer(function (answer)
            {
                    var rtcSessionDescription = new RTCSessionDescription(answer);
                    //This is where the problem occurs, around here. If there is a delay, its fine.
                    pc.setLocalDescription(rtcSessionDescription, function () {
                        callbacks.send({webcam_type: 'reply', accepted: true, answer: answer});
                        callbacks.connected();
                    }, err.bind(null, 'accept 2'));
            }, err.bind(null, 'accept 1'));
        });
    };
    this.decline = function ()
    {
        callbacks.send({webcam_type: 'reply', accepted: false});
    };
    this.accepted = function (jObject)
    {
        pc.setRemoteDescription(new RTCSessionDescription(jObject.answer), function () {
            callbacks.connected();
        }, err.bind(null, 'accepted'));
    };
    this.showMe = function (bool)
    {
        if (bool)
        {
            pc.addStream(Video.localStream);
        }
        else
        {
            pc.removeStream(Video.localStream);
        }
    };
}
Video.Type = {both: 'both', recieving: 'recieving', sending: 'sending'};
Video.mediaOptions = {audio: false, video: true};
Video.getWebcamPermission = function (funct) {
    if (Video.localStream)
    {
        if (funct)
        {
            funct();
        }
    }
    else
    {
        if (navigator.getUserMedia)
        {
            navigator.getUserMedia(Video.mediaOptions, function (stream)
            {
                Video.localStream = stream;
                if (funct)
                {
                    funct();
                }
            }, err.bind(null, 'getWebcamPermission'));
        }
    }
};
function err(source, message)
{
    console.log(source);
    console.log(message);
}