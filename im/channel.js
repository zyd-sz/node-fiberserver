var web_im = require('../func/web_im.js');
var cipher = require('../func/cipher.js');
var config = require('../func/config.js');
var mongo = require('../func/mongo.js');
var pgdb = require('../func/pgdb.js');
var moment = require("moment");
var uuid = require('uuid');

module.exports.run = function(body, db, mo, redis) {
	console.log(body);
	console.log("channel-----");


	var data = JSON.parse(body.message);
	///对channel 消息进行处理请写在这里

	if(body.channel == 'message'){



		//查找socket对象
		var socket = web_im.find_socket(data.socketid);


		if(socket == null){
			//成功
		}


		//数据库查消息。。
		


		//直接发送私聊消息
		var send = web_im.send_message(socket,'message','消息内容');


		if(send.code == 1 ){
			//成功

		}




	}







}