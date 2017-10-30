/**腾讯云短信功能
创建时间：2016-09-23
创建人：吕扶美

更新时间:2017-10-30
更新内容：可发国际短信
更新人：吕扶美

*/
var crypto = require('crypto');
var https = require('https');
var config = require('./config.js');
var Fiber = require('fibers');

var txsms = {};


//appid和appkey实例化
txsms.init = function(appid,appkey){
	var sms = new Object();
	sms.appid = appid;
	sms.appkey = appkey;
	sms.sendvoice = sendvoice;
	sms.sendsms = sendsms;
	return sms;
}


module.exports = txsms;


///发送语音验证码
function sendvoice(nationcode,mobile,message){

	var fiber = Fiber.current;

	var result = {};

	var sdkappid = this.appid;
	var appkey = this.appkey;

	var random = Math.random().toString().substring(2,12) * 1;

	var tel = {};

	tel.nationcode = nationcode;
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

			try{
				result = JSON.parse(body);
			}catch(e){
				result.result = 2001;
				result.errmsg = '服务器返回数据解析失败';
			}
			
			fiber.run();
	    });
	});

	req.on('error', function (e) {  
		result.result = 2002;
		result.回复信息 = '请求失败';
		fiber.run();
	});

	req.write(dataStr + "\n"); 
	req.end();


	Fiber.yield();
	return result;

}

////发送本短信
function sendsms(nationcode,mobile,message){

	var fiber = Fiber.current;

	var result = {};

	var sdkappid = this.appid;
	var appkey = this.appkey;


	var random = Math.random().toString().substring(2,12) * 1;

	var tel = {};

	//tel.nationcode = '86';	//中国
	//tel.nationcode = '1';	//美国
	tel.nationcode = nationcode;	
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

			try{
				result = JSON.parse(body);
			}catch(e){
				result.result = 100000;
				result.errmsg = '服务器返回数据解析失败';
			}

			fiber.run();
	    });
	});

	req.on('error', function (e) {  
		result.result = 2002;
		result.回复信息 = '请求失败';
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


