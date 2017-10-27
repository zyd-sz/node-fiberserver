/**sqlite本地数据库功能
创建时间：2017-03-15 10:19:07
创建人：钟宝森

更新时间
更新内容：
更新人：


注:需要安装sqlite3模块 若无法成功安装，可用淘宝镜像 npm install cnpm -g 
用 cnpm install sqlite3 -save 安装
*/
var logs = require('./logs.js');
var sqlite3 = require('sqlite3').verbose();
var Fiber = require('fibers');

var config = require('./config.js');

var sqlite = {};

/*
 数据库名是直接硬编码的，所以当调用connect函数时，当前目录中就会生成db文件
*/

sqlite.connect = function (callback) {
    var db_name = config.get("app").sqlite;
    return new sqlite3.Database(db_name.db, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);
}


//query封装了包含增删改查的功能
sqlite.query = function (db, sql, key) {

    var result = {};
	var fiber = Fiber.current;
    done(db, sql, key,function(data){
        // console.log(data);
		result = data;
        fiber.run();
	});
	
    Fiber.yield();

	return result;

}


//关闭sqlite数据库连接
sqlite.close = function (db) {
   return db.close();
}

function done(db, sql, key,cb){
    var result = {};

    if (key == undefined || key == null || typeof (key) != "object" || key == "") {
        key == [];
    }

    if (sql.indexOf("select") == 0 || sql.indexOf("SELECT") == 0) {


            db.all(sql, function (err, row) {
                if (err) {
                    result.状态 = '失败';
                    result.信息 = err;
                    result.执行语句 = sql;
                    console.log(':' + sql + '执行错误:' + err);
                    logs.write('SQLlite', '[执行语句]' + sql + '错误信息:' + err);
                }
                else {
                    result.状态 = '成功';
                    result.数据 = row;
                    result.执行语句 = sql;
                }
                cb(result);
            });



    }
    else {

            db.run(sql, key, function (err) {
                if (err) {
                    result.状态 = "失败";
                    result.信息 = err;
                    logs.write("SQLlite", '[执行语句]' + sql + "失败原因：" + err);
                } else {
                    result.状态 = "成功";
                }
                cb(result);
            });

            

    }
}


/*
    
    //创建本地数据库连接,若需要配置本地数据库名称,需要在app.json内的sqlite配置db路径及名称
    var db = sqlite.connect();

    //打印 Database { open: false, filename: 'mysql.db', mode: 6 }
    console.log(db);
    
    //query封装了包含增删改查的功能
    var result = sqlite.query(db, "CREATE TABLE IF NOT EXISTS notes " + "(ts DATETIME, author VARCHAR(255), note TEXT)");

    console.log("弹出结果1:"+JSON.stringify(result));

    var result = sqlite.query(db, "INSERT INTO notes (ts, author, note) " + "VALUES (?, ?, ?);", [new Date(), "张三", "去浪"]);

    console.log("弹出结果2:"+JSON.stringify(result));

    var result = sqlite.query(db, "SELECT * FROM notes");

    console.log("弹出结果3:"+JSON.stringify(result));

    //关闭sqlite数据库连接
    sqlite.close(db);

*/

module.exports = sqlite;