/**加密模块
创建时间：2016-11-16
创建人：吕扶美

更新时间
更新内容：
更新人：

*/

var crypto = require('crypto');


var cipher = {};


/*[MD5 加密
调用方法:
str:内容
*/
cipher.md5 = function(str){
	var md5 = crypto.createHash('md5');
	md5.update(str);
	var d = md5.digest('hex');
	return d;
}


/**
sha1
*/
cipher.sha1 = function(str){
	var shasum = crypto.createHash('sha1');
    shasum.update(str);
	return shasum.digest('hex');
}


/*AES加密
	
	参数说明：
	data 加密前原文数据
	key 加密密钥（长度必须为32位）

	调用范例：
	var cipher =  require('./cipher.js');
	var str = cipher.aesencode(data,key);

	*/

cipher.aesencode = function(data,key){


	//编码设置
	var clearEncoding = 'utf8';
	//加密方式
	var algorithm = 'aes-256-ecb';
	//向量
	var iv = "";
	//加密类型 base64/hex...
	var cipherEncoding = 'hex';


	if(key == null || data == null){
		return null;
	}
	
	if(key.length != 32){
		return null;
	}

	var datastr = ""
	/*判读是否为字符串,不是转成字符串*/
	if(typeof(data) === 'string'){
		datastr = data;
	}else{
		datastr = JSON.stringify(data);
	}

	/*加密前先进行BASE64编码，编码后进行AES加密*/
	try{
		var buf = new Buffer(datastr);
		var base64String = buf.toString('base64');
	}catch(e){
		return null;
	}

	try{
		var cipher = crypto.createCipheriv(algorithm, key, iv);
		var cipherChunks = [];
		cipherChunks.push(cipher.update(base64String, clearEncoding, cipherEncoding));
		cipherChunks.push(cipher.final(cipherEncoding));
		return cipherChunks.join('');
	}catch(e){
		return null;
	}
}
/*AES解密


	参数说明：
	data 密文数据
	key 加密密钥（长度必须为32位）

	调用范例：
	var cipher =  require('./cipher.js');
	var str = cipher.aesdecode(data,key);

	*/

cipher.aesdecode = function(data,key){

	//编码设置
	var clearEncoding = 'utf8';
	//加密方式
	var algorithm = 'aes-256-ecb';
	//向量
	var iv = "";
	//加密类型 base64/hex...
	var cipherEncoding = 'hex';


	if(key == null || data == null){
		return null;
	}
	
	if(key.length != 32){
		return null;
	}
	
	try{
		var cipherChunks = [data];
		var decipher = crypto.createDecipheriv(algorithm, key, iv);
		var plainChunks = [];
		for (var i = 0;i < cipherChunks.length;i++) {
			plainChunks.push(decipher.update(cipherChunks[i], cipherEncoding, clearEncoding));
		}
		plainChunks.push(decipher.final(clearEncoding));

		/*AES解密后是BASE64编码，将BASE64编码进行解码*/
		// console.log("解密后base64编码:"+plainChunks.join(''));
		var base64buf = new Buffer(plainChunks.join(''), 'base64')
		var enString = base64buf.toString();
		/*AES解密后是BASE64编码，将BASE64编码进行解码*/
		return  enString
	}catch(e){
		return null;
	}
}




module.exports = cipher;