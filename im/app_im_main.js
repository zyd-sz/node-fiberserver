var Fiber = require('fibers');
var fs = require('fs');
var config = require('../func/config.js');
var pgdb = require('../func/pgdb.js');
var mysql = require('../func/mysql.js');
var mongo = require('../func/mongo.js');
var redisdb = require('../func/redisdb.js');
var logs = require('../func/logs.js');
var cipher = require('../func/cipher.js');
var async = require('async');

var im = {};

im.index = function(body){


	var conf = config.get('app');
	var fiber = Fiber(function (obj){

		var func = require('./'+body.func+'.js');

		body.send = func.run(body,obj.db,obj.mongo,obj.redis);

			body.endTime = new Date().getTime();
			body.Time = body.endTime - body.startTime;

		if(body.func != 'time'){
			console.log('---------------------------------');
			console.log(body.date + '-IM接口:'+body.func+'---运行时间:'+body.Time+'毫秒');
			console.log('---------------------------------');
		}

		if(conf.main.dbType == 'mysql'){
			mysql.close(obj.db);
		}else{
			pgdb.close(obj.db);
		}


		if(conf.mongodb.使用 == '是'){
			mongo.close(obj.mongo);//连接释放
		}

		if(conf.redis.使用 == '是'){
			redisdb.destroy(obj.redis);//连接释放
		}
		fiber = null;
		obj = null;

		
	});



	var db_pools = require('../func/db_pools.js');
	db_pools('',function(name,db_obj){
		fiber.run(db_obj);
	});




}

im.searchfile = function(fileName){

	var files = fs.readdirSync(__dirname);
	for(var i = 0 ; i < files.length ; i++){
		if(files[i] == fileName+".js"){
			return true;
		}
	}

	return false;
}






module.exports = im;