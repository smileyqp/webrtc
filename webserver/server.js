'use strict';

var http = require('http');
var https = require('https');
var fs = require('fs');//读取证书

var express = require('express');
var serveIndex = require('serve-index')


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
https_server.listen(9999, '0.0.0.0');

