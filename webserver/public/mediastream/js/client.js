'use strict';

var videoplay = document.querySelector('video#player')


//设备的展示与选择
var audioSource = document.querySelector("select#audioSource");
var audioOutput = document.querySelector("select#audioOutput");
var videoSource = document.querySelector("select#videoSource");

var filtersSelect = document.querySelector("select#filter");

function gotDevices(deviceInfos) {      //参数deviceInfos是设备信息的数组
    deviceInfos.forEach((deviceInfo) => {
        console.log(deviceInfo.kind + ':label = ' + deviceInfo.label + ':id = ' + deviceInfo.deviceId + ':groupId = ' + deviceInfo.groupId);
        var option = document.createElement('option');
        option.value = deviceInfo.deviceId;
        option.text = deviceInfo.label;
        if(deviceInfo.kind === 'audioinput'){       //deviceInfo.kind来判断种类;音频
            audioSource.appendChild(option);
        }else if(deviceInfo.kind === 'audiooutput'){        //音频输出
            audioOutput.appendChild(option);
        }else if(deviceInfo.kind === 'videoinput' ){           //视频
            videoSource.appendChild(option);
        }

    });
}

//获取到流
function gotMediaStream (stream){
    videoplay.srcObject = stream;
    return navigator.mediaDevices.enumerateDevices();   //成功获取流；并返回一个promise；用于后边对设备的判断
}

//错误处理
function handleError (err){
    console.log(err);
}

function start(){
    if( !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia ){
        console.log('getUserMedia is not support!');
        return;
    }else{
        var deviceId = videoSource.value;   //获取设备ID；用于当设备选择改变的时候改变设备
        var constraints = {
            video : {
                width:640,
                height:480,
                frameRate:30,    //帧率
                facingMode:'enviroment',    //facingMode摄像头的q前置还是后置的设置
                deviceId:deviceId ? deviceId :undefined
            },
            audio : {
                noiseSupression:true,   //降噪
                echoCancellation:true,  //回音消除设置成true
            },
            
        }
        navigator.mediaDevices.getUserMedia(constraints)
        .then(gotMediaStream)   //获取流
        .then(gotDevices)       //设备获取处理
        .catch(handleError);
    }
}
start();
videoSource.onchange = start;       //在视频攒则改变的时候，即onchange时候重新调用start函数;实现设备的切换

filtersSelect.onchange = function(){        //视频特效
    videoplay.className = filtersSelect.value;
}
