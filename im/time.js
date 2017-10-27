var web_im = require('../func/web_im.js');
var cipher = require('../func/cipher.js');
var config = require('../func/config.js');
var mongo = require('../func/mongo.js');
var pgdb = require('../func/pgdb.js');
var moment = require("moment");
var uuid = require('uuid');
var redisdb = require('../func/redisdb.js');


module.exports.run = function(body, db, mo, redis) {

	if(body.socket.userid == undefined){
		//用户未认证;
		body.socket.emit('connectionResult', body.socket.id);
		return;
	}

	//设置在线状态    ---- 最后的60为客户端与服务60无心跳进行断线操作。
	var result = web_im.set_online(redis,body.socket.userid,body.socket.id,'任意内容',60);


	if(result.code = 1){
		//成功
	}


	//下面是业务代码






	///********发送相关代码


	//查检是否在线
	var online = web_im.get_online(redis,'userid');

	if(online.code == 1){
		//成功
	}






	//查找socket对象
	var socket = web_im.find_socket(online.socketid);


	if(socket != null){
		//成功
	}







	//直接发送私聊消息
	var send = web_im.send_message(socket,'消息内容');


	if(send.code == 1 ){
		//成功

	}



	console.log(send);



	//发送消息到频道








}