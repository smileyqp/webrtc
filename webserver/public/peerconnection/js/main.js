'user strict'

var localvideo = document.querySelector('video#localvideo');
var remoteVideo = document.querySelector('video#remotevideo');

var btnStart = document.querySelector('button#start');
var btnCall = document.querySelector('button#call');
var btnHangup = document.querySelector('button#hangup');

btnStart.onclick = start;
btnCall.onclick = call;
btnHangup.onclick = hangup;



var localStream;
var pc1,pc2;
function getMediaStream (stream){
    localvideo.srcObject = stream;
    localStream = stream;
}
function handleError(err){
    console.err('Failed to get stream')
}

function start(){
    if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
        console.error('the getUserMedia is not support!')
        return;
    }else{
        var constraints = {
            video:true,
            audio:false
        }
        navigator.mediaDevices.getUserMedia(constraints).then(getMediaStream).catch(handleError)
    }
}

function getRemoteStream(e){
    remoteVideo.srcObject = e.streams[0];
}

function handleOfferError(err){
    console.error('Failed to create offer',err)
}

function handleAnswerError(err){
    console.log("Failed to create answer",err)
}

function getOffer(desc){
    pc1.setLocalDescription(desc);
    //send desc to signal
    //receive desc from signal
    pc2.setRemoteDescription(desc);

    pc2.createAnswer()
        .then(getAnswer)
        .catch(handleAnswerError);
}


function getAnswer(desc){
    pc2.setLocalDescription(desc);
    //send desc to signal和pc1进行交换
    //pc1 receive desc from signal

    pc1.setRemoteDescription(desc);
}

function call(){
    pc1 = new RTCPeerConnection();
    pc2 = new RTCPeerConnection();

    pc1.onicecandidate = (e) => {
        pc2.addIceCandidate(e.candidate)
    }

    pc2.onicecandidate = (e) => {
        pc1.addIceCandidate(e.candidate)
    }

    pc2.ontrack = getRemoteStream;


    localStream.getTracks().forEach((track) => {//localStream.getTracks()拿到音视频轨道；将本地采集的音视频流添加到peerconnection
        pc1.addTrack(track,localStream);
    });

    var offerOPtions = {
        offerToReceiveAudio:0,
        offerToReceiveVideo:1 
    }
    pc1.createOffer(offerOPtions)
        .then(getOffer)
        .catch(handleOfferError);



}


function hangup(){
    pc1.close();

    pc2.close();

    pc1 = null;
    pc2 = null;
}
