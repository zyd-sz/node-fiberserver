var Fiber = require('fibers');
var fs = require('fs');
var config = require('../func/config.js');
var pgdb = require('../func/pgdb.js');
var mysql = require('../func/mysql.js');
var mongo = require('../func/mongo.js');
var redisdb = require('../func/redisdb.js');
var logs = require('../func/logs.js');
var async = require('async');

var api = {};

api.index = function(req,res,body){
	var conf = config.get('app');

	var fiber = Fiber(function (obj){


		var func = require('./'+body.func+'.js');

		body.send = func.run(body,obj.db,obj.mongo,obj.redis);

		res.status(200).send(body.send);
		res.end();
		body.endTime = new Date().getTime();
		body.Time = body.endTime - body.startTime;
		if(body.Time > 1000){
			logs.write('apiLogs','apiRunning_Timeout_func:'+body.func+'---'+body.Time);
		}
		console.log('---------------------------------');
		console.log(body.date+'-api接口:'+body.func+'---运行时间:'+body.Time+'毫秒');
		console.log('---------------------------------');

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

api.searchfile = function(fileName){

	var files = fs.readdirSync(__dirname);
	for(var i = 0 ; i < files.length ; i++){
		if(files[i] == fileName+".js"){
			return true;
		}
	}

	return false;
}


module.exports = api;