var web_im = require('../func/web_im.js');
var cipher = require('../func/cipher.js');
var config = require('../func/config.js');
var mongo = require('../func/mongo.js');
var pgdb = require('../func/pgdb.js');
var moment = require("moment");
var uuid = require('uuid');

module.exports.run = function(body, db, mo, redis) {

	body.socket.leave(body.roomName);

	var data = {};
	data.action = 'leaveChatRoom';
	data.roomName = body.roomName;
	data.userid = body.socket.userid;
	web_im.io.to(body.roomName).emit('chatRoomMessage',JSON.stringify(data));
	body.ack('ok');


}