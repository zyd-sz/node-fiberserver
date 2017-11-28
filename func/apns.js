
/**

ios离线APNs推送功能
创建时间：2017-11-28
创建人：吕扶美

*/


var apn = require("apn");
var Fiber = require('fibers');

var apns = new Object();


apns.init = function(congfig){
	let obj = new Object();
	let service = new apn.Provider(congfig);
	obj.service = service;
	obj.send = function sendMessage(note,tokens){
		var res = null;
		var fiber = Fiber.current;
		// console.log('-------------');
		// console.log(`Sending: ${note.compile()} to ${tokens}`);
		// console.log('-------------');
		this.service.send(note,tokens).then( result => {
		  res = result;
		  fiber.run();
		});
		Fiber.yield();
		return res;
	}
	///关闭推送
	obj.close = function(){
		this.service.shutdown();
	}
	return obj;
}

apns.note = function getNote(alert){
	return new apn.Notification(alert);
}




module.exports =  apns;





