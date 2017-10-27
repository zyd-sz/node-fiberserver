var async = require('async');
var config = require('./config.js');
var pgdb = require('./pgdb.js');
var mongo = require('./mongo.js');
var redisdb = require('./redisdb.js');
var mysql = require('./mysql.js');

function db_pools(name,callback){
	var obj = new Object();
	var conf = config.get('app');
	async.waterfall([
		function(cb){
			if(conf.main.dbType == 'mysql'){
				mysql.open(function(err,client){
					if(err){
						console.log('连接mysql数据库失败!');
						logs.write('err','错误:连接mysql数据库失败,错误信息:'+err);
					}else{
						obj.db = client;
						cb(null,'');
					}
				});
			}else{
				pgdb.open(function(err,client){
				if(err){
					console.log('连接pg数据库失败!');
					logs.write('err','错误:连接PG数据库失败,错误信息:'+err);
				}else{
					obj.db = client;
					cb(null,'');
				}
			});
			}

		},		
		function(j,cb){
			if(conf.mongodb.使用 != '是'){
				cb(null,'');
				return;
			}
			mongo.open(function(err,db){
				if(err){
					console.log(err);
					console.log('连接Mongo数据库失败!');
					logs.write('mongodb','错误:连接Mongo数据库失败,错误信息:'+err);
				}else{
					obj.mongo = db;
					cb(null,'');
				}
			});
		},
		function(j,cb){
			if(conf.redis.使用 != '是'){
				cb(null,'');
				return;
			}
			redisdb.create(function(err,client){
				if(err){
					console.log('连接redis数据库失败!');
					logs.write('err','错误:连接redis数据库失败,错误信息:'+err);
				}else{
					obj.redis = client;
					cb(null,'');
				}
			});
		}
	], function (err, result) {

		callback(name,obj);

	})


}


module.exports = db_pools;