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

	// var d = mysql.query(db,"insert into dd(id,name) values(121,'sdfsdf')");
		var d = mysql.query(db,"select * from dd");


		// var d = mysql.query(db,"COMMIT;");

	console.log(d);


	var p = {};
	p._isRander = 'y';


	return p;



}


