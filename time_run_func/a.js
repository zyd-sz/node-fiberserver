var mongo = require('../func/mongo.js');
var pgdb = require('../func/pgdb.js');
var querystring = require('querystring');
// var seeding = require('../func/seeding.js');
var web_im = require('../func/web_im.js');
var io = require('socket.io');
var redisdb = require('../func/redisdb.js');
var config = require('../func/config.js');

module.exports.run = function(body,db,mo,redis){

	console.log('aaaa');


	var d = pgdb.query(db,'COMMIT;');
	console.log(d);
}


