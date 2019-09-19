'use strict';

if( !navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices ){
    console.log('enumerateDevices is not support!')
}else{
    navigator.mediaDevices.enumerateDevices()
    .then(gotDevices)
    .catch(handleError);
}

function gotDevices(deviceInfos) {
    deviceInfos.forEach((deviceInfo) => {
        console.log(navigator)
        console.log('00000000000000')
        console.log(deviceInfo.kind + ':label = ' + deviceInfo.label + ':id = ' + deviceInfo.deviceId + ':groupId = ' + deviceInfo.groupId);
    });
}

function handleError (err){
    console.log(err);
}