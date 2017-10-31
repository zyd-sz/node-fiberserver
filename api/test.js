var mongo = require('../func/mongo.js');
var mysql = require('../func/mysql.js');
var querystring = require('querystring');
// var seeding = require('../func/seeding.js');
var web_im = require('../func/web_im.js');
var io = require('socket.io');
var redisdb = require('../func/redisdb.js');
var config = require('../func/config.js');

module.exports.run = function(body,db,mo,redis){

	console.log(body);
	 mysql.query(db,"BEGIN");
	// var d = mysql.query(db,"insert into testTable(id,name) values(?,?)",[14,'yugdddb']);
	//	var d = pgdb.query(db,"select * from 平_会员表 where id=11");
      var d = mysql.query(db,"delete from testTable where id=?",[3]);
	

	    mysql.query(db,"COMMIT");
	  //  mysql.query(db,"ROLLBACK");

	 var p={};
	 p =d;
	return p;



}


