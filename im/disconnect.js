var cipher = require('../func/cipher.js');
var config = require('../func/config.js');
var logs = require('../func/logs.js');
var mongo = require('../func/mongo.js');
var pgdb = require('../func/pgdb.js');
var request = require('../func/request.js');
var txsms = require('../func/txsms.js');
var rongcloud = require('../func/rongcloud.js');
var moment = require("moment");
var uuid = require('uuid');
var transliteration = require('transliteration');
var redisdb = require('../func/redisdb.js');

var web_im = require('../func/web_im.js');

module.exports.run = function(body,db,mo,redis){

	///如果未认证
	if(body.socket.userid == undefined){
		console.log('用户未认证');
		body.socket.emit('connectionResult', body.socket.id);
		return data;
	}
	



	//设置在线状态    ---- 最后的0 代表客户已断开。
	var result = web_im.set_online(redis,body.socket.userid,'','',0);

	delete body.socket.userid;
	delete body.socket.random;



}