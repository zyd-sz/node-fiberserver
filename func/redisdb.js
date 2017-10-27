/**redis数据库
创建时间：2016-09-23
创建人：吕扶美



更新时间：2016-12-20 11:39:32
更新内容： 
        result = false; 全都改成result = null;
        优化细节
更新人：钟宝森



更新时间：2017-10-17 11:39:32
更新内容： 增加setnx方法
更新人：吕扶美


*/
var Fiber = require('fibers');
var poolModule = require('generic-pool');
var redis = require("redis");
var config = require('./config.js');




var redisdb = {};

redisdb.pool = poolModule.Pool({
    name: 'redis',
    //将建 一个 连接的 handler
    create: function(callback) {
	    var conf = config.get('app');
        if(conf.redis.使用 == '是'){
            var client = redis.createClient(conf.redis.port, conf.redis.host, {});
            client.auth(conf.redis.password,function(err){
                if(err){
                    callback(err,null);
                }else{
                    callback(null,client);
                }
            });
        }
    },
    // 释放一个连接的 handler
    destroy  : function(db) { db.quit();},
    // 连接池中最大连接数量
    max      : 500,
    // 连接池中最少连接数量
    min      : 100, 
    // 如果一个线程30秒钟内没有被使用过的话。那么就释放
    idleTimeoutMillis : 30000,
    // 如果 设置为 true 的话，就是使用 console.log 打印入职，当然你可以传递一个 function 最为作为日志记录handler
    log : false 
});

/**打开redis数据库连接*/
redisdb.open = function(){
    var result = {};
    var fiber = Fiber.current;
    var conf = config.get('app');
    var client = redis.createClient(conf.redis.port, conf.redis.host, {});
    client.auth(conf.redis.password,function(err){
        if(err){
            result = false;
        }else{
            result = client;
        }
        fiber.run();
    });
    Fiber.yield();

    return result;
}

/**关闭redis数据库连接*/
redisdb.close = function(db){
    if(db == undefined){
        return;
    }
    db.quit();
    return;
}

/**通过连接池连接*/
redisdb.create = function(cb){
	redisdb.pool.acquire(function(err, db) {
        cb(err,db);
    });
}

/**释放连接池连接*/
redisdb.destroy = function(db){
	redisdb.pool.release(db);
}

/**选择子数据库*/
redisdb.select = function(db,num){
    if(db == undefined){
        console.error('Redis 未连接！！！');
        return false;
    }
    var result = {};
    var fiber = Fiber.current;
    db.select(num, function(err) { 
        if(err){
            result = false;
        }else{
            result = true;
        }
        fiber.run();
    });
    Fiber.yield();
    return result;
}

/**从尾部追加队列*/
redisdb.rpush = function(db,queue,data){
    if(db == undefined){
        console.error('Redis 未连接！！！');
        return false;
    }
    if(typeof(data) == 'object'){
        data = JSON.stringify(data);
    }
    var result = {};
    var fiber = Fiber.current;
    db.rpush(queue,data,function(err,data){
        if(err){
            result = false;
        }else{
            result = data;
        }
         fiber.run();
    });
    Fiber.yield();
    return result;
}

/**从头部追加队列*/
redisdb.lpush = function(db,queue,data){
    if(db == undefined){
        console.error('Redis 未连接！！！');
        return false;
    }
    if(typeof(data) == 'object'){
        data = JSON.stringify(data);
    }
    var result = {};
    var fiber = Fiber.current;
    db.lpush(queue,data,function(err,data){
        if(err){
            result = false;
        }else{
            result = data;
        }
         fiber.run();
    });
    Fiber.yield();
    return result;
}


/**发送数据到频道*/
redisdb.publish = function(db,channel,data){
    if(db == undefined){
        console.error('Redis 未连接！！！');
        return false;
    }
    if(typeof(data) == 'object'){
        data = JSON.stringify(data);
    }
    var result = {};
    var fiber = Fiber.current;
    db.publish(channel,data,function(err,data){
        if(err){
            result = false;
        }else{
            result = true;
        }
         fiber.run();
    });
    Fiber.yield();
    return result;
}

/**取出队列第一条*/
redisdb.blpop = function(db,queue,time){
    if(db == undefined){
        console.error('Redis 未连接！！！');
        return false;
    }
    var result = {};
    var fiber = Fiber.current;
    db.blpop(queue,time,function(err,data){
        if(err){
            // console.log('queue err'+err);
            result = false;
        }else if(data){
            // console.log(data);
            result = data[1];
        }else{
            // console.log('queue all null');
            result = '';
        }

        fiber.run();
    })
    Fiber.yield();
    return result;
}

/**
 hset 命令用于为哈希表中的key_name字段的field域赋value值
 如果哈希表不存在,一个新的哈希表被创建并进行 HSET 操作
 如果字段已经存在于哈希表中,旧值将被覆盖
 返回数字1代表成功
*/
redisdb.hset = function(db,key_name,field,value){
    if(db == undefined){
        console.error('Redis 未连接！！！');
        return false;
    }
	var result = {};
	var fiber = Fiber.current;
	db.hset(key_name,field,value,function(err,data){
        if(err){
            result = false;
		}else{
			result = data;
		}
		fiber.run();
	})
	Fiber.yield();
    return result;
}

/**
 hget 命令用于取哈希表中的key_name字段的field域的value值
 */
redisdb.hget = function(db,key_name,field){
    if(db == undefined){
        console.error('Redis 未连接！！！');
        return false;
    }
	var result = {};
	var fiber = Fiber.current;
	db.hget(key_name,field,function(err,data){
		if(err){
            result = false;
		}else{
			result = data;
		}
		fiber.run();
	})
	Fiber.yield();
    return result;
}

/**
 expire用于给指定的key设置过期时间
 返回数字1代表成功
 */
redisdb.expire = function(db,key_name,time){
    if(db == undefined){
        console.error('Redis 未连接！！！');
        return false;
    }
	var result = {};
	var fiber = Fiber.current;
	db.expire(key_name,time,function(err,data){
		if(err){
            result = false;
		}else{
			result = data;
		}
		fiber.run();
	}) 
	Fiber.yield();
    return result;
}

/**
 hmset 命令用于同时将多个 field-value (域-值)对设置到哈希表 key 中
 field是一个数组
 返回OK代表成功
 */
redisdb.hmset = function(db,key_name,field){
    if(db == undefined){
        console.error('Redis 未连接！！！');
        return false;
    }
	var result = {};
	var fiber = Fiber.current;
	db.hmset(key_name,field,function (err, data) {
		if(err){
            result = false;
		}else{
			result = data;
		}
		fiber.run();
	})
	Fiber.yield();
    return result;
}

/**
 hgetall 命令用于获取在哈希表中指定 key 的所有字段和值
 */
redisdb.hgetall = function(db,key_name){
    if(db == undefined){
        console.error('Redis 未连接！！！');
        return false;
    }
	var result = {};
	var fiber = Fiber.current;
	db.hgetall(key_name,function (err, data) {
		if(err){
            result = false;
		}else{
			result = data;
		}
		fiber.run();
	})
	Fiber.yield();
    return result;
}

/**
 hexists 查看哈希表key_name中指定的字段field是否存在
 返回数字1代表存在
 */
redisdb.hexists = function(db,key_name,field){
    if(db == undefined){
        console.error('Redis 未连接！！！');
        return false;
    }
	var result = {};
	var fiber = Fiber.current;
	db.hexists(key_name,field,function(err, data) {
		if(err){
            result = false;
		}else{
			result = data;
		}
		fiber.run();
	})
	Fiber.yield();
    return result;
}

/**
 hdel 删除一个或多个哈希表字段
 返回数字1代表成功
 */
redisdb.hdel = function(db,key_name,field){
    if(db == undefined){
        console.error('Redis 未连接！！！');
        return false;
    }
	var result = {};
	var fiber = Fiber.current;
	db.hdel(key_name,field,function (err, data) {
		if(err){
            result = false;
		}else{
			result = data;
		}
		fiber.run();
	})
	Fiber.yield();
    return result;
}

/**
 给key_name赋value值
 返回OK代表成功
 */
redisdb.set = function(db,key_name,value){
    if(db == undefined){
        console.error('Redis 未连接！！！');
        return false;
    }
	var result = {};
	var fiber = Fiber.current;
	db.set(key_name,value,function (err, data){
		if(err){
            result = false;
		}else{
			result = data;
		}
		fiber.run();
	})
	Fiber.yield();
    return result;
}

/**
将 key 的值设为 value ，当且仅当 key 不存在。

若给定的 key 已经存在，则 SETNX 不做任何动作。

SETNX 是『SET if Not eXists』(如果不存在，则 SET)的简写

返回值：

　　设置成功，返回 1 。
　　设置失败，返回 0 。
 */
redisdb.setnx = function(db,key_name,value){
    if(db == undefined){
        console.error('Redis 未连接！！！');
        return false;
    }
    var result = {};
    var fiber = Fiber.current;
    db.setnx(key_name,value,function (err, data){
        if(err){
            result = false;
        }else{
            result = data;
        }
        fiber.run();
    })
    Fiber.yield();
    return result;
}

/**
 取key_name的value值
 */
redisdb.get = function(db,key_name){
    if(db == undefined){
        console.error('Redis 未连接！！！');
        return false;
    }
	var result = {};
	var fiber = Fiber.current;
	db.get(key_name,function (err, data){
		if(err){
            result = false;
		}else{
			result = data;
		}
		fiber.run();
	})
	Fiber.yield();
    return result;
}

/**
 删除指定的key
 返回数字1代表成功
 */
redisdb.del = function(db,key_name){
    if(db == undefined){
        console.error('Redis 未连接！！！');
        return false;
    }
	var result = {};
	var fiber = Fiber.current;
	db.del(key_name,function (err, data){
		if(err){
            result = false;
		}else{
			result = data;
		}
		fiber.run();
	})
	Fiber.yield();
    return result;
}



module.exports = redisdb;