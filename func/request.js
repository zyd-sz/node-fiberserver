/**日志功能
创建时间：2016-09-23
创建人：吕扶美

更新时间
更新内容：新增complex_post函数,用于post提交复杂数据
更新人：钟宝森

*/

var Fiber = require('fibers');

var cipher = require('./cipher.js');
var config = require('./config.js');

var request = {};


request.server = function(url,func,data){
	var str = cipher.aesencode(data,cipher.md5(func));
	var body = {};
	body.func = func;
	body.key = config.get('app').main.serverKey;
	body.words = cipher.md5(func)+str;
	body.sign = cipher.md5(body.words);
	return request.post(url,body);
}

request.complex_post = function(options,content) {
    var post_option = {
		url: options,
		form: JSON.stringify(content),
		headers: {
		'Content-Type': 'application/x-www-form-urlencoded'
		}
	};
	
	var result = {};
	var fiber = Fiber.current;

    require('request').post(post_option, function (err, res, body) {
    	if (err) {	
			result.状态 = "失败";
			result.信息 = err;
		}else {
			result.状态 = "成功";
			result.信息 = body;	    
		}	
		fiber.run();
        
    });
	
	Fiber.yield();
	return result;

    
}

request.get = function(url){
	var result = {};
	var fiber = Fiber.current;
	go(url,'','GET',function(data){
		result = data;
		fiber.run();
	});

	Fiber.yield();
	return result;
}



request.post = function(url,content){

	var result = {};
	var fiber = Fiber.current;
	go(url,content,'POST',function(data){
		result = data;
		fiber.run();
	});
	Fiber.yield();
	return result;
}

function go(html_url,r,type,cb){
		
	var timeoutEvent;
	var s={};
	var content = '';
	if(typeof(r) == 'object'){
		content = require('querystring').stringify(r);
	}else if(typeof(r) == 'string'){
		content = r;
	}else{
        s.状态 = '失败';
		s.信息 = "发送数据格式必须为object或string";
		cb(s);
		return;
	}

      var parse_u = require('url').parse(html_url,true);
      var isHttp=parse_u.protocol=='http:';
      var options={
           host:parse_u.hostname,
           port:parse_u.port||(isHttp?80:443),
           path:parse_u.path,
           method:type,
           headers:{
                  'Content-Type':'application/x-www-form-urlencoded',
                  'Content-Length':content.length
            }
        };
		
        var req = require(isHttp?'http':'https').request(options,function(res){
			
            var _data = '';
			
			res.setEncoding('utf8');
		  
			res.on('data', function(chunk){
				 _data += chunk;
			});
		  
			res.on('end', function(){
			clearTimeout(timeoutEvent);
			// console.log(type+"请求完成");
				if(res.statusCode === 200){
					s.状态 = '成功';
					s.信息 = _data;
					
				}
				else{
					s.状态 = '失败';
					s.信息 = res.statusCode;
				}
					cb(s);
			});
		   
		    res.on("close", function(e) {
            	clearTimeout(timeoutEvent);
            	// console.log(type+"请求关闭");
            		s.状态 = '失败';
					s.信息 = "请求关闭";
					cb(s);
			});
			
			res.on("abort", function() {
            	// console.log(type+"请求中止操作");
            	s.状态 = '失败';
				s.信息 = "请求中止操作";
				cb(s);
			});
			
			
        });
		
		req.write(content);
		req.end();
		
		req.on('error', function (e) {
			clearTimeout(timeoutEvent);			
			// console.log('请求失败: ' + e.message); 
			s.状态 = '失败';
			s.信息 = e.message;
			cb(s);
		});  
		
		req.on("timeout", function() {
        // console.log(type+"请求接收超时");
        if (req.res) {
            req.res.emit("abort");
        }
		req.abort();

		});
		
		timeoutEvent = setTimeout(function() {
        req.emit("timeout");
		}, 5000);
		//5秒后执行超时操作

						
}


module.exports = request;