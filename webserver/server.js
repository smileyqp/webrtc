'use strict';

var http = require('http');
var https = require('https');
var fs = require('fs');//读取证书

var express = require('express');
var serveIndex = require('serve-index')


var socketIo = require('socket.io')
var log4js = require('log4js');
log4js.configure({
	appenders:{
		file:{
			type:'file',
			filename:'app.log',
			layout:{
				type:'pattern',
				pattern:'%r %p - %m'
			}
		}
	},
	categories:{
		default:{
			appenders:['file'],
			level:'debug'
		}
	}

});
var logger = log4js.getLogger();

var app = express();//实例化express模块

app.use(serveIndex('./public'));//浏览目录
app.use(express.static('./public'));//发布静态目录的位置；发布路径





//http server服务创建
var http_server = http.createServer(app);
http_server.listen(8080, '0.0.0.0');


//创建http server
var options = {
	key : fs.readFileSync('./cert/1557605_www.learningrtc.cn.key'),
	cert: fs.readFileSync('./cert/1557605_www.learningrtc.cn.pem')
}

var https_server = https.createServer(options, app);
var io = socketIo.listen(https_server);//socketio进行绑定监听
io.sockets.on('connection',(socket)=>{	//sockets可以忽略，这样写代表这个客户端下面的所有的连接；socket代表每隔客户端
	socket.on('join',(room)=>{
		socket.join(room);//加入房间

		var myRoom = io.sockets.adapter.rooms[room];//io.sockets.adapter.rooms拿到房间
		var users = Object.keys(myRoom.sockets).length;//拿到房间之后可以拿到这个房间的所有用户myRoom.sockets,然后length拿到房间中用户的数量
		logger.log('the num of users in room is'+users)
		// socket.emit('joined',room,socket.id);//给加入的房间的这个人回消息
		// socket.to(room).emit('joined',room,socket.id);//给房间除了自己之外的所有人回消息
		// io.in(room).emit('emit',room,socket.id);//给这个房间的所有人回消息
		// socket.broadcast.emit('joined',room,socket.id);//除了自己给整个站点的所有人发消息；包括其他room的
	})
	socket.on('leave',(room)=>{
		var myRoom = io.sockets.adapter.rooms[room];//io.sockets.adapter.rooms拿到房间
		var users = Object.keys(myRoom.sockets).length;//拿到房间之后可以拿到这个房间的所有用户myRoom.sockets,然后length拿到房间中用户的数量
		//最终的用户数量为 users-1
		logger.log('the num of users in room is'+users-1)
		socket.leave(room);
	
	})

})
https_server.listen(9999, '0.0.0.0');

