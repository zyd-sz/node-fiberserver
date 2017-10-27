var Fiber = require('fibers');
var fs = require('fs');
var config = require('../func/config.js');
var pgdb = require('../func/pgdb.js');
var mysql = require('../func/mysql.js');
var mongo = require('../func/mongo.js');
var redisdb = require('../func/redisdb.js');
var logs = require('../func/logs.js');
var async = require('async');

var main = {};

//管理后台操作新增sqlite控制用以解决本地数据库在关闭后再关闭一次的问题
var sqlite = require('../func/sqlite.js');
main.index = function(req,res,body,obj){

	if(body.path.length <= 7){
		var data = {};
		data.code = -2;
		data.message = 'page error';
		res.status(200).send(data);
		res.end();
		return;
	}

	var fileName = body.path.substr(1, body.path.length - 7);

	// var file = main.searchfile(fileName);

	var file = fs.existsSync("./routes/"+fileName+'.js');

	if(file){
		body.func = fileName;
	}else{
		var data = {};
		data.code = -3;
		data.message = 'page can not find';
		res.status(200).send(data);
		res.end();
		return;
	}


	var conf = config.get('app');

	var fiber = Fiber(function (){

		var func = require('./'+body.func+'.js');
		body.send = func.run(body,obj.db,obj.mongo,obj.redis);

		if(body.send._isRander == null){
			if(body.send._xhtml != null && body.send._xhtml != '')
				body.func = body.send._xhtml;
   				res.render(body.func,body.send);
   				res.end();
		}else{
			if(body.send._isExcel != null){ //表格的
				res.setHeader('Content-Type', 'application/vnd.openxmlformats');
				res.setHeader("Content-Disposition", "attachment; filename=" + body.date + "_" + body.startTime + ".xlsx"); //默认名 
				res.end(body.send._isExcel, 'binary'); //'binary'值必须 否则excel打不开
			}else{
				res.status(200).send(body.send._isRander);
				res.end();
			}
		}
		
		body.endTime = new Date().getTime();
		body.Time = body.endTime - body.startTime;
		console.log('---------------------------------');
		console.log(body.date +'-ejs接口:'+body.func+'---运行时间:'+body.Time+'毫秒');
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
		obj = null;
		fiber = null;

	});

	

	fiber.run();



}

main.searchfile = function(fileName){

	var js_file = false;
	var mb_file = false;
	var js_files = fs.readdirSync(__dirname);
	for(var i = 0 ; i < js_files.length ; i++){
		if(js_files[i] == fileName+".js"){
			js_file = true;
			break;
		}
	}


	var path = require("path");
	var html_path = path.resolve(__dirname, '..','www');

	var mb_files = fs.readdirSync(html_path);
	
	for(var i = 0 ; i < mb_files.length ; i++){
		if(mb_files[i] == fileName+".ejs"){
			mb_file = true;
			break;
		}
	}

	if(js_file == true && mb_file == true){
		return true;
	}

	return false;
}


module.exports = main;