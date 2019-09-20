'use strict';

var videoplay = document.querySelector('video#player')

function gotMediaStream (stream){
    videoplay.srcObject = stream;
}

function handleError (err){
    console.log(err);
}

if( !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia ){
    console.log('getUserMedia is not support!')
}else{
    var constraints = {
        video : true,
        audio : true
    }
    navigator.mediaDevices.getUserMedia(constraints)
    .then(gotMediaStream)
    .catch(handleError);
}


