/**pg数据库功能
创建时间：2016-09-23
创建人：吕扶美

更新时间
更新内容：
更新人：

*/
var Fiber = require('fibers');
var my = require('mysql');
var config = require('./config.js');
var logs = require('./logs.js');
var poolModule = require('generic-pool');


var mysql = {};


mysql.pool = poolModule.Pool({
	name: 'mysql',
    //将建 一个 连接的 handler
	create: function(callback) {
		if(config.get('app').main.dbType != 'mysql'){
			return;
		}
		var conf = config.get('app');
		var connection = my.createConnection({
			  host     : conf.mysql.host,
			  user     : conf.mysql.user,
			  password : conf.mysql.pass,
			  database : conf.mysql.db
			});

		connection.connect();
		callback(null,connection);
    },
    // 释放一个连接的 handler
    destroy  : function(client) { 
    	client.end();
    },
    // 连接池中最大连接数量
    max      : 50,
    // 连接池中最少连接数量
    min      : 10, 
    // 如果一个线程30秒钟内没有被使用过的话。那么就释放
    idleTimeoutMillis : 30000,
    // 如果 设置为 true 的话，就是使用 console.log 打印入职，当然你可以传递一个 function 最为作为日志记录handler
    log : false 
});



mysql.open = function(cb){
	mysql.pool.acquire(function(err, db) {
        cb(err,db);
    });
}



mysql.close = function(client){
	mysql.pool.release(client);
}

mysql.query = function(client,sql){
	var result = 0;
	var fiber = Fiber.current;
	client.query(sql,function(err,data,fields){
		// console.log(err);
		// console.log(data);
		if(err){
			result = null;
			console.log(':'+sql+'执行错误:'+err.stack);
			logs.write('sql','错误语句:'+sql+'错误信息:'+err.stack);
			fiber.run();
		}else{

			if(data.affectedRows == undefined){
				result = data;
			}else{
				result = data.affectedRows;
			}
			fiber.run();
			
		}
	});

	Fiber.yield();

	return result;
}






module.exports = mysql;