/**短信功能
创建时间：2016-08-20
创建人：吕扶美

更新时间：2016-09-23
更新内容：增加设置缓存功能
更新人：吕扶美
*/

//cache.js
var fs = require('fs');
var cache = require('memory-cache');

var config = {};

/**
缓存配置模块！
注：此文件需要与配置文件放在同一目录中，配置文件必须是.json格式文件
使用方法:
var config = require('./config/config.js');
//读取或更新缓存
config.readfile();
//使用缓存内容
var conf = config.get("config");
console.log(conf.版本号);
*/

//更新缓存
config.readfile = function(){
	var dir = './config/';
	var files = fs.readdirSync(dir);
	for(var i = 0; i< files.length ; i++){
		var file = files[i];
		if(file.substring(file.length - 5, file.length ) == ".json"){
			var path = dir + "/" + file;
			var config = fs.readFileSync(path);
			try{
				var json = JSON.parse(config.toString());
				var key = 'config/' + file.substring(0, file.length - 5 );
				cache.put(key, json);
			}catch(e){
				console.error('读取配置文件出错误！！');
			}

		}
	}

	console.log('读取配置成功!');
}

//获取缓存
config.get = function(key){
	return cache.get('config/' + key);
}


//设置缓存
config.set = function(key,obj){
	try{
		cache.put('config/' + key, obj);
		return true;
	}catch(e){
		return false;
	}
	
}



module.exports = config;