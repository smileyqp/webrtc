'use strict';

var audioSource = document.querySelector("select#audioSource");
var audioOutput = document.querySelector("select#audioOutput");
var videoSource = document.querySelector("select#videoSource");

if( !navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices ){
    console.log('enumerateDevices is not support!')
}else{
    navigator.mediaDevices.enumerateDevices()
    .then(gotDevices)
    .catch(handleError);
}

function gotDevices(deviceInfos) {
    deviceInfos.forEach((deviceInfo) => {
        console.log(deviceInfo.kind + ':label = ' + deviceInfo.label + ':id = ' + deviceInfo.deviceId + ':groupId = ' + deviceInfo.groupId);
        var option = document.createElement('option');
        option.value = deviceInfo.deviceId;
        option.text = deviceInfo.label;
        if(deviceInfo.kind === 'audioinput'){
            audioSource.appendChild(option);
        }else if(deviceInfo.kind === 'audiooutput'){
            audioOutput.appendChild(option);
        }else if(deviceInfo.kind === 'videoinput' ){
            videoSource.appendChild(option);
        }

    });
}

function handleError (err){
    console.log(err);
}