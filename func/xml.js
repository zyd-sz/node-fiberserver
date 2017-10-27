/**日志功能
创建时间：2016-09-23
创建人：吕扶美

更新时间：
更新内容：XML字符转json函数的同步问题
更新人：钟宝森

*/
var xml2js = require('xml2js');
var Fiber = require('fibers');




var xml = {};

/**XML字符转javascript 对象*/
xml.obj = function(xmlStr){
	var result = {};
	var fiber = Fiber.current;
	var parser = new xml2js.Parser();
	var result = Fiber(function () {

    parser.parseString(xmlStr, function (err, data) {
		if(err){
			result = null;
		}else{
			result = data;
		}
	});

	Fiber.yield(result);
	}).run();
	
    return result;
}

/**javascript 对象 转 XML字符*/
xml.from = function(obj){
	var builder = new xml2js.Builder();
	var xmlStr = builder.buildObject(obj);
	return xmlStr;
}



module.exports = xml;