var mongo = require('../func/mongo.js');
var mysql = require('../func/mysql.js');
var querystring = require('querystring');
// var seeding = require('../func/seeding.js');
var web_im = require('../func/web_im.js');
var io = require('socket.io');
var redisdb = require('../func/redisdb.js');
var config = require('../func/config.js');
var fs = require('fs');
var path = require('path');

module.exports.run = function(body,db,mo,redis){

	console.log(body);

	var p = {};

	var apns = require('../func/apns.js');

	//设备token
	var tokens = ['2eaffcef05dd6b12037d21a5c94c233326be39698dad45f29a6f002f4783128d'];

	///初始化
	var push = apns.init({
 		 cert: path.join('./','config','apns-dev-cert.pem'),
 		 key: path.join('./','config','apns-dev-key.pem'),
 		 gateway: "gateway.sandbox.push.apple.com",
 		 // gateway: "gateway.push.apple.com"; //线上地址
 		 // port: 2195, //端口
 		 passphrase: "123456" //pem证书密码
	});



	/////创建消息
	var msg = apns.note();
	msg.badge = 11;//桌面图片圆点数字
	msg.sound = "ping.aiff";//提示声音类型
	msg.alert = "\uD83D\uDCE7 \u2709 消息1111111!!";//提示消息
	msg.payload = {'messageFrom': 'John Appleseed'};//推送的数据
	msg.topic = "com.qqxnz.chatTestApp";//appid

	console.log(msg.compile());


	////发送
	var push_result1  = push.send(msg,tokens);



	/////创建消息
	var msg = apns.note();
	msg.badge = 11;//桌面图片圆点数字
	msg.sound = "ping.aiff";//提示声音类型
	msg.alert = "\uD83D\uDCE7 \u2709 消息22222!!";//提示消息
	msg.payload = {'messageFrom': 'John Appleseed'};//推送的数据
	msg.topic = "com.qqxnz.chatTestApp";//appid


	////发送
	var push_result2  = push.send(msg,tokens);





	///关闭操作
	push.close();




	p._isRander = 'y';


	return p;



}


