/**pg数据库功能
创建时间：2017-05-06
创建人：吕扶美

更新时间
更新内容：
更新人：

*/
var Fiber = require('fibers');
var pg = require('pg');
var config = require('./config.js');
var logs = require('./logs.js');
var io = require('socket.io');
var redisdb = require('./redisdb.js');
var redis = require("redis");

var conf = config.get('app');
var web_im = {};





//找到socket对象
web_im.find_socket = function(id){
	return web_im.io.sockets.sockets[id];
}

//检查在线
web_im.get_online = function(redis,userid){
  var result = {};

	if(conf.redis.使用 != '是'){
		result.code = -1;
		return result;
	}

	if(redisdb.select(redis,conf.redis.web_imDB) != true){
		result.code = -2;
		return result;
	}

	var data = redisdb.get(redis,userid);

	if(data == null){
		result.code = -3;
		return result;
	}

	try{
		result = JSON.parse(data);
	}catch(e){
		result.code = -4;
		return result;
	}

	result.code = 1;

	return result;
}

//设置在线 
web_im.set_online = function(redis,userid,id,msg,outTime){

    var result = {};

	var data = {};
	data.userid = userid;
	data.socketid = id;
	data.msg = msg;


	if(conf.redis.使用 != '是'){
		result.code = -1;
		return result;
	}

	if(redisdb.select(redis,conf.redis.web_imDB) != true){
		result.code = -2;
		return code;
	}

	var save = redisdb.set(redis,userid,JSON.stringify(data));
	if(save != 'OK'){
		result.code = -3;
		return code;
	}

	var time = redisdb.expire(redis,userid,outTime);

	result.code = time;
	return result;

}

//发送私聊消息
web_im.send_message = function(socket,msg){
	var reTrue = false;
    var result = {};
    if(socket == null || socket == undefined || typeof(socket) != 'object'){
    	result.code = -1;
    	return result;
    }

    if(typeof(msg) == 'object'){

    	msg = JSON.stringify(msg);
    }

	var fiber = Fiber.current;

	var EventEmitter = require('events').EventEmitter; 
	var event = new EventEmitter(); 
	event.on('result', function() { 
		event.removeAllListeners();
		fiber.run();
	}); 

	setTimeout(function () {
		result.code = -2;
		event.emit('result'); 
	}, 2000);

	socket.emit('message',msg,function(data){
		result.code = 1;
		result.data = data;
		event.emit('result'); 
	});
	
	Fiber.yield();
	return result;



}



web_im.listen = function(server){
  web_im.io = io.listen(server,{
    "transports":['websocket']
  });
}



///channel监听
web_im.listen_channel = function(){

	if(conf.redis.使用 != '是'){
		return;
	}

	var client = redis.createClient(conf.redis.port, conf.redis.host, {});
	// 密码
	client.auth(conf.redis.password,function(err){
		if(err){

			console.error("监听web_im channel 认证出错!");
		}
	    // 选择数据库，比如第3个数据库，默认是第0个
	    client.select(conf.redis.web_imDB, function() { 

    		client.on("message", function (channel, message) {
			    console.log("监听到事件 " + channel + ": " + message);

			    var body = {};
				var time = new Date().getTime();
				body.startTime = time;
				body.func = 'channel';
				body.channel = channel;
				body.message = message;
				var main = require('../im/app_im_main.js');
				var bool = main.searchfile(body.func);
				if (bool) {
					main.index(body);
				} else {
					console.log("暂无 im/[ " + body.func + ".js] ... 文件!")
				}

			});

	    	for(var i = 0 ; i < conf.redis.web_imChannelList.length ; i ++){
				client.subscribe(conf.redis.web_imChannelList[i]);
				console.log('监听channel '+conf.redis.web_imChannelList[i]+' 成功!');
	    	}

	    });

	});
}

///socket监听
web_im.onObject = function(socket){

	socket.on('disconnect', function (data) {
		var body = {};
		body.startTime = new Date().getTime();
		body.func = 'disconnect';
		body.socket = socket;
		var main = require('../im/app_im_main.js');
		var bool = main.searchfile(body.func);
		if (bool) {
			main.index(body);
		} else {
			console.log("暂无 im/[ " + bo.func + ".js] ... 文件!")
		}

	})

	socket.on('auth', function (data,ack) {
		var body = {};
		body.startTime = new Date().getTime();
		body.func = 'auth';
		body.data = data;
		body.ack = ack;
		body.socket = socket;
		var main = require('../im/app_im_main.js');
		var bool = main.searchfile(body.func);
		if (bool) {
			main.index(body);
		} else {
			console.log("暂无 im/[ " + bo.func + ".js] ... 文件!")
		}

	})


	socket.on('time', function (data, ack) {
		var time = new Date().getTime();
		ack(time + '');
		var body = {};
		body.startTime = time;
		body.func = 'time';
		body.socket = socket;
		var main = require('../im/app_im_main.js');
		var bool = main.searchfile(body.func);
		if (bool) {
			main.index(body);
		} else {
			console.log("暂无 im/[ " + body.func + ".js] ... 文件!")
		}
	});


	socket.on('joinChatRoom',function(roomName,ack){
		var body = {};
		var time = new Date().getTime();
		body.startTime = time;
		body.func = 'joinChatRoom';
		body.ack = ack;
		body.roomName = roomName;
		body.userid = socket.userid;
		body.socket = socket;
		var main = require('../im/app_im_main.js');
		var bool = main.searchfile(body.func);
		if (bool) {
			main.index(body);
		} else {
			console.log("暂无 im/[ " + body.func + ".js] ... 文件!")
		}

	});


	socket.on('leaveChatRoom',function(roomName,ack){
		var body = {};
		var time = new Date().getTime();
		body.startTime = time;
		body.func = 'leaveChatRoom';
		body.ack = ack;
		body.roomName = roomName;
		body.userid = socket.userid;
		body.socket = socket;
		var main = require('../im/app_im_main.js');
		var bool = main.searchfile(body.func);
		if (bool) {
			main.index(body);
		} else {
			console.log("暂无 im/[ " + body.func + ".js] ... 文件!")
		}


	});


}



//检查用户是否在线  、、、新功能此废弃方法
web_im.checked_online = function(userid){
	for (var i = 0 ; i < web_im.sockets.length ; i++){
		//console.log(userid);
		
		if(web_im.sockets[i].userid == userid){
			
			return web_im.sockets[i]
		}
	}

	return null

}



//发送私聊消息  此方法将废弃
web_im.send_pryivte = function(socket,userid,data){
	var reTrue = false;
    var result = {};
    if(socket == null){
    	result.code = -1;
    	return result;
    }else{
    	var fiber = Fiber.current;

    	setTimeout(function () {

    		if(reTrue == false){
    			result.code = -2;
				reTrue = true;
				fiber.run();
    		}

		}, 2000);

		socket.emit('message',data,function(data){
			if(reTrue == false){
				result.code = 0;
				result.data = data;
				reTrue = true;
				fiber.run();
			}
		});
		
		Fiber.yield();
		return result;
    }


}





module.exports = web_im;







