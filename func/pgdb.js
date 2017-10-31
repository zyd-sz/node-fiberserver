/**pg数据库功能
创建时间：2016-09-23
创建人：吕扶美
更新时间: 2017-10-30
更新内容:增加了query方法带参数功能
更新人:吕扶美
*/
var Fiber = require('fibers');
var pg = require('pg');
var config = require('./config.js');
var logs = require('./logs.js');
var poolModule = require('generic-pool');


var pgdb = {};


pgdb.pool = poolModule.Pool({
	name: 'postgresql',
    //将建 一个 连接的 handler
	create: function(callback) {
		if(config.get('app').main.dbType == 'mysql'){
			return;
		}
		var conf = config.get('app');
		var constring = "tcp://"+conf.postgresql.user+":"+conf.postgresql.pass+"@"+conf.postgresql.host+"/"+conf.postgresql.db;
		var client = new pg.Client(constring);
		client.connect(function(err){
			if(err){
				callback(err, null);
				throw err;
			}else{
                // console.log("PGSQL创建了一个连接！");
				callback(null, client);
			}
		});
    },
    // 释放一个连接的 handler
    destroy  : function(client) { 
    	client.end(function(err){
    		if (err){
                throw err;
            }else{
                // console.log("PGSQL断开了一个连接！");
            }
    	});
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



pgdb.open = function(cb){
	pgdb.pool.acquire(function(err, db) {
        cb(err,db);
    });
}



pgdb.close = function(client){
	pgdb.pool.release(client);
}

pgdb.query = function(client,sql,data){
	var err = 0;
	var result = 0;
	var fiber = Fiber.current;
     
	client.query(sql,data,function(sqlerr,resultdata){
		err = sqlerr;
		result = resultdata;
		fiber.run();
	});


	Fiber.yield();

	if(err){
		result = null;
		console.log(':'+sql+'执行错误:'+err.stack);
		logs.write('sql','错误语句:'+sql+'错误信息:'+err.stack);
		return result;
	}

	if(result.command == 'SELECT'){
		result = result.rows;
	}else if(result.command == 'INSERT'){
		result = result.rowCount;
	}else if(result.command == 'DELETE'){
		result = result.rowCount;
	}else if(result.command == 'UPDATE'){
		result = result.rowCount;
	}else if(result.command == 'BEGIN' || result.command == 'COMMIT' || result.command == 'ROLLBACK'){
		result = true;
	}
	

	return result;
}






module.exports = pgdb;