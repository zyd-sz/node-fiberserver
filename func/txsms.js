/**腾讯云短信功能
创建时间：2016-09-23
创建人：吕扶美

更新时间
更新内容：
更新人：

*/
var crypto = require('crypto');
var https = require('https');
var config = require('./config.js');
var Fiber = require('fibers');

var txsms = {};

/**
[发送腾讯语音验证码

参数说明:mobile=手机号码,message=验证码内容 msg = 回复信息

回传参数:状态,信息



调用方法：

txsms.yy_yzm(mobile,message,function(msg){

	console.log(msg);

});


*/
txsms.yy_yzm = function(mobile,message){

	var fiber = Fiber.current;

	var result = {};

	var conf = config.get('txsms');

	if(conf == null){
		result.状态 = '失败';
		result.回复信息 = '读取配置文件失败';
		return result
	}

	var sdkappid = conf.sdkappid;
	var appkey = conf.appkey;

	var random = Math.random().toString().substring(2,12) * 1;

	var tel = {};

	tel.nationcode = '86';
	tel.phone = mobile;

	var data = {};

	data.tel = tel;
	data.type = '0';
	data.msg = message;
	data.sig = md5(appkey+mobile);
	data.extend = '';
	data.ext = 'some msg';


	var dataStr = JSON.stringify(data);

	var args = {
		headers: { "Content-Type": "application/json" }
	};


	var options = {  
		hostname: 'yun.tim.qq.com', 
		port: 443,  
		path: '/v3/tlsvoicesvr/sendvoice?sdkappid=' +sdkappid + '&random='+random,  
		method: 'POST',
		headers: {  
			'Content-Type':'application/json'  
		} 
	};  
	  
	var req = https.request(options, function (res) {  
	    var body = "";
	    res.on('data', function(data) {
	        body += data;
	    }).on('end', function() {
			result.状态 = '成功';
			result.回复信息 = JSON.parse(body);
			fiber.run();
	    });
	});

	req.on('error', function (e) {  
		result.状态 = '失败';
		result.回复信息 = '发送语音验证码失败';
		fiber.run();
	});

	req.write(dataStr + "\n"); 
	req.end();


	Fiber.yield();
	return result;

}

/**
]发送腾讯语音验证码*/


/**
[发送腾讯语音验证码

参数说明：mobile=手机号码,message=验证码内容 msg = 回复信息

调用方法：

txsms.sms(mobile,message,function(msg){

	console.log(msg);

});


*/
txsms.sendsms = function(mobile,message,callback){

	var fiber = Fiber.current;

	var result = {};

	var conf = config.get('txsms');

	if(conf == null){
		result.状态 = '失败';
		result.回复信息 = '读取配置文件失败';
		return result
	}
	var sdkappid = conf.sdkappid;
	var appkey = conf.appkey;


	var random = Math.random().toString().substring(2,12) * 1;

	var tel = {};

	tel.nationcode = '86';
	tel.phone = mobile;

	var data = {};

	data.tel = tel;
	data.type = '0';
	data.msg = message;
	data.sig = md5(appkey+mobile);
	data.extend = '';
	data.ext = 'some msg';


	var dataStr = JSON.stringify(data);

	var args = {
		headers: { "Content-Type": "application/json" }
	};


	var options = {  
	    hostname: 'yun.tim.qq.com', 
	    port: 443,  
	    path: '/v3/tlssmssvr/sendsms?sdkappid=' +sdkappid + '&random='+random,  
	    method: 'POST',
	    headers: {  
	        'Content-Type':'application/json'  
	    }  
	};  
	  
	var req = https.request(options, function (res) {  
	    var body = "";
	    res.on('data', function(data) {
	        body += data;
	    }).on('end', function() {
			result.状态 = '成功';
			result.回复信息 = JSON.parse(body);
			fiber.run();
	    });
	});

	req.on('error', function (e) {  
		result.状态 = '失败';
		result.回复信息 = '发送短信失败';
		fiber.run();
	});

	req.write(dataStr + "\n"); 

	req.end();

	Fiber.yield();

    return result;

}

/**
]发送腾讯语音验证码*/


function md5(str){
	var md5 = crypto.createHash('md5');
	md5.update(str);
	var d = md5.digest('hex');
	return d;
}





module.exports = txsms;