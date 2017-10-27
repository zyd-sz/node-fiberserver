var mongo = require('../func/mongo.js');
var pgdb = require('../func/pgdb.js');
var querystring = require('querystring');
// var seeding = require('../func/seeding.js');
var web_im = require('../func/web_im.js');
var io = require('socket.io');
var redisdb = require('../func/redisdb.js');
var config = require('../func/config.js');

module.exports.run = function(body,db,mo,redis){

	console.log('bbbbbb');

	// var d = pgdb.query(db,"select now()");
	// console.log(d);
}


