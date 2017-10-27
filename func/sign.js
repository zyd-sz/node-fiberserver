/**签名算法
创建时间：2017-04-21 16:46:28
创建人：钟宝森

更新时间
更新内容：
更新人：

*/


/*[签名
param.appid  例如:appid
type  为数组,填写为满足条件的数据 例如type = ['appid']
app_key   为密钥
*/

var md5 = require('MD5')


var sign = {};


sign.autograph = function(param,type,app_key){
	var querystring = Object.keys(param).filter(function(key){
		if(type == null || type == '')
		return param[key] !== undefined && param[key] !== '' && ['sign','key'].indexOf(key)<0;
		else{
			return param[key] !== undefined && param[key] !== '' && ['sign','key'].indexOf(key)<0 && type.indexOf(key)>=0;
		}
	}).sort().map(function(key){
		return key + '=' + param[key];
	}).join("&") + "&key="+app_key;
	return md5(querystring).toUpperCase();
}
/*]签名*/

module.exports = sign;