/*

创建人:钟宝森
创建时间:2017-02-07 16:03:36

更新时间:2017-03-18 17:00:44
更新内容：把业务型函数封装成通用型函数
*/

var WXPay = require('weixin-pay');
var Fiber = require('fibers');

var config = require('../func/config.js');
var request = require('../func/request.js');

var url = require("url");            //解析GET请求  
var query = require("querystring");    //解析POST请求
var parseString = require('xml2js').parseString;
var moment = require('moment');
var cipher = require('../func/cipher.js');

var querystring = require('querystring');
var xml = require('../func/xml.js');
var logs = require('../func/logs.js');

var pay = {};

/* [支付宝下单 */

    var request = require('request');
	var fs = require('fs');
	var crypto = require('crypto');

	
	
	/*对待签名参数进行签名方法*/
	function signer(algorithm,key,data){
    var sign = crypto.createSign(algorithm);
    sign.update(data, 'utf-8');
    sig = sign.sign(key,'base64','utf-8');
    return sig;
	}

/*
封装的方法：Alireturn
subject = 商品名称
body = 商品描述
total_fee = 总金额
notify_url = 回调网址
out_trade_no = 订单编号
*/

/*
支付宝下单支付
privatePem 支付宝私钥证书{string} (必传)
publicPem 支付宝公钥证书 {string} (必传)
data 传入的数据 {object} (必传)
格式:
var data = {};
data.partner = "2088521599218220";
data.seller_id = "link@abcaaa.top";
data.notify_url = "http://zyktest.zyk-hlk.com:9090/pay/";
data.show_url = "http://baidu.com";
data.id = "15817319768_20170318160436";
data.商品 = "XXXXX";
data.金额 = 0.01;
var ali = pay.Alireturn(data);
console.log(ali);
*/

pay.Alireturn = function (privatePem,publicPem,data){

	var jsons = {};

	if(typeof(data) != "object" || data == ""){
		jsons.状态 = "传入参数不完整或有误";
		return jsons;
	}

	if(data.partner == null || data.partner == ""){
		jsons.状态 = "支付宝合作者身份ID不能为空";
		return jsons;
	}

	if(data.seller_id == null || data.seller_id == ""){
		jsons.状态 = "卖家支付宝账号不能为空";
		return jsons;
	}

	if(data.notify_url == null || data.notify_url == ""){
		jsons.状态 = "回调地址不能为空";
		return jsons;
	}

	if(data.show_url == null || data.show_url == ""){
		jsons.状态 = "展示地址不能为空";
		return jsons;
	}

	

	var info = data;
	
	var subject = info.商品;
	var total_fee = (Number(info.金额)).toFixed(2);
	var body = cipher.aesencode(info.账号+'|'+total_fee,cipher.md5(info.id));
	var partner = info.partner;
	var seller_id = info.seller_id;
	var algorithm = 'RSA-SHA1';    //加密算法类型
	var out_trade_no = info.out_trade_no;    //生成以时间开头后10位随机数的订单号
	var notify_url = encodeURIComponent(info.notify_url);   //回调网址
	var show_url = encodeURIComponent(info.show_url);   //展示网址
	var privatePem = fs.readFileSync('./config/rsa_private_key.pem');
	if(!privatePem){
		jsons.状态 = "私钥读取失败";
		return jsons;
	}
	
	var publicPem = fs.readFileSync('./config/rsa_public_key.pem');
	if(!publicPem){
		jsons.状态 = "公钥读取失败";
		return jsons;
	}
	
	var ldata = 'service="mobile.securitypay.pay"&partner="'+partner+'"&_input_charset="UTF-8"&body="'+body+'"&out_trade_no="'+out_trade_no+'"&payment_type="1"&seller_id="'+seller_id+'"&subject="'+subject+'"&total_fee="'+total_fee+'"&it_b_pay="1d"&notify_url="'+notify_url+'"&show_url="'+show_url+'"';   //传输的数据
	var key = privatePem.toString();
	var sig = signer(algorithm,key,ldata); //对订单进行签名
	
	var pubkey = publicPem.toString();
	var yanzheng = crypto.createVerify('RSA-SHA1').update(ldata, 'utf-8').verify(pubkey, sig, 'base64');//验证数据，通过公钥、数字签名 =》是原始数据
	
	var encodesig = encodeURIComponent(sig);   //把签完名作为URI 组件进行编码
	
	if(yanzheng == true){
		//console.log("------------公钥签名匹配------------");
		jsons.状态 = "成功";
		var 内容 = ldata+'&sign="'+encodesig+'"&sign_type="RSA"';

		var logs = require('./logs.js');

        //下单日志
        logs.write('pay/alipay','\n\n【'+data.类别+'_支付宝】\n'+moment().format('YYYY-MM-DD HH:mm:ss')+'\n'+内容);
		jsons.return_info = encodeURIComponent(内容);
	}else{
		//console.log("------------公钥签名不匹配------------");
		jsons.状态 = "下单失败";
		jsons.return_info = "";
	}

	 return jsons;
}

/* ]支付宝下单 */





/* [微信订单查询 */
pay.wx_look = function(id){
	    var pay = config.get('pay');
		var 时间戳 = Date.now();
		时间戳 = ((String)(时间戳)).slice(0,10);	
		var wxpay = WXPay({
			appid: pay.微信支付.appid,
			mch_id: pay.微信支付.mch_id,
			partner_key: pay.微信支付.partner_key //微信商户平台API密钥
			//pfx: fs.readFileSync('./wxpay_cert.p12') //微信商户平台证书
		});
		var result = {};
	    var fiber = Fiber.current;

	wxpay.queryOrder({
		transaction_id: id
	}, function(err, data){
		result = data;
		fiber.run();
		
	});	

	Fiber.yield();
	return result;
}
/* ]微信订单查询 */




/*[微信支付下单*/
/*
appid 应用ID {string} (必传)
mch_id 微信支付商户号 {string} (必传)
partner_key 微信商户平台API密钥 {string} (必传)
html 服务器异步通知页面路径 {string} (必传)
data 传入的数据 {object} (必传)
格式:
var data = {};
data.appid = "wxb4b9aebf38287f88";
data.mch_id = "1369941002";
data.partner_key = "5f09850e702fd461a106802b24a31605";
data.html = "http://zyktest.zyk-hlk.com:9090/pay/";
data.id = "15817319768_20170318160436";
data.商品 = "XXXXX";
data.金额 = 0.01;
var ali = pay.Alireturn(data);

其中appid是应用ID
其中mch_id是微信支付商户号
其中partner_key是微信商户平台API密钥
其中html服务器异步通知页面路径
其中id是订单id
商品是商品名称
金额是下单金额
*/
pay.Winxinorder = function(data){
	
	var jsons = {};
    if(typeof(data) != "object" || data == ""){
		jsons.状态 = "传入参数不完整或有误";
		return jsons;
	}

	if(data.appid == null || data.appid == ""){
		jsons.状态 = "支付宝合作者身份ID不能为空";
		return jsons;
	}

	if(data.mch_id == null || data.mch_id == ""){
		jsons.状态 = "卖家支付宝账号不能为空";
		return jsons;
	}

	if(data.partner_key == null || data.partner_key == ""){
		jsons.状态 = "回调地址不能为空";
		return jsons;
	}

	if(data.html == null || data.html == ""){
		jsons.状态 = "展示地址不能为空";
		return jsons;
	}
	   
       
	    var info = data;

		var 时间戳 = Date.now();
		时间戳 = ((String)(时间戳)).slice(0,10);	
		var wxpay = WXPay({
			appid: data.appid,
			mch_id: data.mch_id,
			partner_key: data.partner_key //微信商户平台API密钥
			//pfx: fs.readFileSync('./wxpay_cert.p12') //微信商户平台证书
		});
		info.金额 = Number(info.金额) * 100;
		info.金额 = (info.金额).toFixed(0);
		var result = {};
	    var fiber = Fiber.current;
		wxpay.createUnifiedOrder({
			body: info.商品,
			out_trade_no: info.out_trade_no,
			total_fee: info.金额,
			spbill_create_ip: '0.0.0.0',
			notify_url: info.html,
			trade_type: 'APP',
			product_id: '1234567890'
		}, function(err, data){

			if(err){
				result = err;
			}else{
				result = data;				
			}

            fiber.run();
						
		});	

			Fiber.yield();


			var ret = {
				appid: result.appid,
				partnerid: result.mch_id,
				prepayid: result.prepay_id,
				noncestr: result.nonce_str,
				timestamp: 时间戳,
				package: 'Sign=WXPay',
		
			};
		
			ret.sign = wxpay.sign(ret);

			var logs = require('./logs.js');

			//下单日志
			logs.write('pay/wx/','\n\n【'+info.商品+'_微信支付】\n'+moment().format('YYYY-MM-DD HH:mm:ss')+'\n'+JSON.stringify(ret));
			
			if( result.result_code == 'SUCCESS')
				ret.状态 = '成功';
			else
				ret.状态 = result.err_code_des;
			return ret;
}
/*]微信支付下单*/



/*回调处理*/
pay.pay_returns = function(body,type){
	var err_code = {};
	var sql = '';
	var r_order = '';
	if(type == 'alipay'){

		logs.write('pay/alipay', '\n\n【' + type + '】\n' + moment().format('YYYY-MM-DD HH:mm:ss') + '\n' + body);
		var r_alipay = {};
		r_alipay.a_返回状态 = body.trade_status;
		r_alipay.a_总金额 = body.total_fee;
		r_alipay.a_支付订单号 = body.trade_no;
		r_alipay.a_订单id = body.out_trade_no;
		r_alipay.a_商户订单号 = body.out_trade_no;
		r_alipay.a_商品名称 = body.subject;
		r_alipay.a_买家支付宝账号 = body.buyer_email;
		r_alipay.a_卖家支付宝用户号 = body.seller_id;
		r_alipay.a_交易创建时间 = body.gmt_create;
		r_alipay.a_通知时间 = body.notify_time;
		r_alipay.a_交易付款时间 = body.gmt_payment;
		r_alipay.a_卖家支付宝账号 = body.seller_email;
		r_alipay.func = 'return_back';
		return r_alipay;
		//console.log(r_alipay)
	}else if(type == 'wx'){
		logs.write('pay/wx', '\n\n【' + type + '】\n' + moment().format('YYYY-MM-DD HH:mm:ss') + '\n' + body);
		
		var r_wx = {};
		
		r_wx.w_公众账号ID = body.appid[0];
		r_wx.w_用户标识 = body.openid[0];
		r_wx.w_返回状态 = body.result_code[0];
		r_wx.w_商户号 = body.mch_id[0];
		r_wx.w_总金额 = body.total_fee[0];
		r_wx.w_支付订单号 = body.transaction_id[0];
		r_wx.w_商户订单号 = body.out_trade_no[0];
		r_wx.w_交易类型 = body.trade_type[0];
		r_wx.w_状态码 = body.return_code[0];
		r_wx.w_订单id = body.out_trade_no[0];
		r_wx.w_总金额 = Number(r_wx.w_总金额) / 100;
		r_wx.w_总金额 = (r_wx.w_总金额).toFixed(2);
		r_wx.func = 'return_back';
		//console.log(r_wx)
		return r_wx;
	}else{
		err_code.状态 = '支付类型异常';
		return err_code;
	}
	
}
//处理支付回调查找文件
function returnfind(fileName,files){

	var files = fs.readdirSync(__dirname+"/api"+files);
	for(var i = 0 ; i < files.length ; i++){
		if(files[i] == fileName+".js"){
			return true;
		}
	}

	return false;
}



module.exports = pay;