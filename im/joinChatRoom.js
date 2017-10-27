var web_im = require('../func/web_im.js');
var cipher = require('../func/cipher.js');
var config = require('../func/config.js');
var mongo = require('../func/mongo.js');
var pgdb = require('../func/pgdb.js');
var moment = require("moment");
var uuid = require('uuid');
var redisdb = require('../func/redisdb.js');
var io = require('socket.io');

module.exports.run = function(body, db, mo, redis) {


	// if(redisdb.select(redis,config.get('app').web_im.redisDBNum) != true){
	// 	body.ack('服务器错误1');
	// 	return;
	// }


	// var data  = redisdb.get(redis,body.socket.userid);

	// var obj = JSON.parse(data);

	// obj.chatRoom = body.roomName;

	// redisdb.set(redis,body.socket.userid,JSON.stringify(obj));



	body.socket.join(body.roomName);

	var data = {};
	data.action = 'joinChatRoom';
	data.roomName = body.roomName;
	data.userid = body.socket.userid;
	web_im.io.to(body.roomName).emit('chatRoomMessage',JSON.stringify(data));

	body.ack('ok');


		// console.log(body.roomName +'连接----11111---------');
		// console.log(body.socket.id);
		// console.log(body.roomName +'连接----11111---------');
		// console.log(body.roomName +'连接------2222222-------');
		// console.log(web_im.io.sockets.sockets[body.socket.id].rooms);///找到对象

		// //console.log(web_im.io.sockets.rooms);//输出为空
		// // console.log(web_im.io.sockets);//输出为空

		// console.log(body.roomName +'连接-------2222222------');


}