var fs = require('fs');
var Fiber = require('fibers');
var moment = require('moment');
var config = require('./func/config.js');

var time = {};

config.readfile();

time.startTime = function(){
	if(fs.existsSync('./time_run_second/run.json') == false){
		console.log('定时任务未找到time_run_second/run.json文件，停止运行！');
		return;
	}
	var second = moment().second();
	var secondfile = searchf_second_file(second+'.json');
	if(secondfile){
		var data = fs.readFileSync('./time_run_second/'+second+'.json');
		var funcList = null;
		try{
			funcList = JSON.parse(data.toString());
		}catch(e){

			console.log('读取任务列表出错:'+second);
			return;
		}


		console.log('读取任务列表:'+second+'.json'+' : '+funcList);


		for(var i = 0 ; i < funcList.length ; i++){
			if(searchf_func_file(funcList[i])){
				var fileName = funcList[i];
				var db_pools = require('./func/db_pools.js');
				db_pools(fileName,function(name,db_obj){
					time.run(second,name,db_obj);
				});


			}else{
				console.log('未找到任务文件:'+funcList[i]);
			}
		}



	}


	if(second == 30 || second == 0 ){

		if(config.get('app').main.dbType == 'mysql'){
			var mysql = require('./func/mysql.js');
			console.log("mysql当前连接数"+mysql.pool._count);
			console.log("mysql可用连接数"+mysql.pool._availableObjects.length);
		}else{
			var pgdb = require('./func/pgdb.js');
			console.log("postgresql当前连接数"+pgdb.pool._count);
			console.log("postgresql可用连接数"+pgdb.pool._availableObjects.length);
		}

		if(config.get('app').mongodb.使用 == '是'){
			var mongo = require('./func/mongo.js');
			console.log("mongodb当前连接数"+mongo.pool._count);
			console.log("mongodb可用连接数"+mongo.pool._availableObjects.length);
		}

		if(config.get('app').redis.使用 == '是'){
			var redisdb = require('./func/redisdb.js');
			console.log("redis当前连接数"+redisdb.pool._count);
			console.log("redis可用连接数"+redisdb.pool._availableObjects.length);

		}
	}




}





time.run = function(second,fn,obj){
	var fiber = Fiber(function (){
		var body = {};
		body.startTime = new Date().getTime();
		var func = require('./time_run_func/'+fn);

		func.run(second,obj.db,obj.mongo,obj.redis);

		body.endTime = new Date().getTime();
		body.Time = body.endTime - body.startTime;
		console.log('---------------------------------');
		console.log(moment().format('YYYY-MM-DD HH:mm:ss') +'-timeRun:'+fn+'---运行时间:'+body.Time+'毫秒');
		console.log('---------------------------------');
		var conf = config.get('app');
		if(conf.main.dbType == 'mysql'){
			var mysql = require('./func/mysql.js');
			mysql.close(obj.db);
		}else{
			var pgdb = require('./func/pgdb.js');
			pgdb.close(obj.db);
		}

		if(conf.mongodb.使用 == '是'){
			var mongo = require('./func/mongo.js');
			mongo.close(obj.mongo);//连接释放
		}

		if(conf.redis.使用 == '是'){
			var redisdb = require('./func/redisdb.js');
			redisdb.destroy(obj.redis);//连接释放
		}

		obj = null;
		fiber = null;

	});

	

	fiber.run();
}



function searchf_func_file(fileName){

	var files = fs.readdirSync(__dirname + '/time_run_func/');
	for(var i = 0 ; i < files.length ; i++){
		if(files[i] == fileName){
			return true;
		}
	}

	return false;
}


function searchf_second_file(fileName){

	var files = fs.readdirSync(__dirname + '/time_run_second/');
	for(var i = 0 ; i < files.length ; i++){
		if(files[i] == fileName){
			return true;
		}
	}

	return false;
}




setInterval(function(){

	time.startTime();
	
},1000);



