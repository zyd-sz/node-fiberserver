var web_im = require('../func/web_im.js');
var cipher = require('../func/cipher.js');
var config = require('../func/config.js');
var mongo = require('../func/mongo.js');
var redisdb = require('../func/redisdb.js');
var pgdb = require('../func/pgdb.js');
var mysql = require('../func/mysql.js');
var moment = require("moment");
var uuid = require('uuid');

module.exports.run = function(body, db, mo, redis) {

	try{
		var data = JSON.parse(body.data);
		body.userid = data.userid;
		body.random = data.random;
	}catch(e){
		body.ack('数据格式错误');
	}


	///业务代码



	var d = mysql.query(db,"select * from dd");


	console.log(d);

	///业务代码



	//socket对象设置
	body.socket.userid = body.userid;
	body.socket.random = body.random;



	//设置在线状态    ---- 最后的60为客户端与服务60无心跳进行断线操作。
	var result = web_im.set_online(redis,body.userid,body.socket.id,'任意内容',60);

	if(result.code == 1){
		//成功
	}

	//回复客户端
	body.ack('连接成功');
	
	return ;


}