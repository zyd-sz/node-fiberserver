var crypto = require('crypto');
var https = require('https');
var config = require('./config.js');
var Fiber = require('fibers');


var qcloud = {};

/*
 *	nationcode	国家代码
 *	mobile		手机号码
 *	message		短信内容
 *	appid		腾讯云短信的appid
 *	appkey		腾讯云短信的appkey
*/

qcloud.sendsms = function(nationcode,mobile,message,appid,appkey){

	var fiber = Fiber.current;

	var result = {};

	var random = Math.random().toString().substring(2,12) * 1;

	var tel = {};

	//默认为中国代码86
	if(nationcode == ''|| nationcode == null || nationcode == undefined){
			tel.nationcode = '86';
	}else{
			tel.nationcode = nationcode;
	}


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
	    path: '/v3/tlssmssvr/sendsms?sdkappid=' +appid + '&random='+random,  
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




function md5(str){
	var md5 = crypto.createHash('md5');
	md5.update(str);
	var d = md5.digest('hex');
	return d;
}



module.exports = qcloud;



