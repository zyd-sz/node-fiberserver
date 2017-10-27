var OSS = require('ali-oss');
var config = require('./config.js');
var Fiber = require('fibers');
var alioss = {};
/*
 * 用法:初始化client对象
 * 传参：阿里云配置
 * 返值：client对象
 */
alioss.init = function(a, b, c) {
	var client = new OSS.Wrapper({
		region: a,
		accessKeyId: b,
		accessKeySecret: c
		
	});
	return client;
}


/*
 * 用法：bucket清单
 * 传参：client对象
 * 返值：data对象:
 * {buckets:{name:'',region:'',creationDate:''},状态:''}
 */
alioss.listBucket = function(client) {
	var fiber = Fiber.current;
	
	var data = {};
	client.listBuckets().then(function(result) {
		//console.log(result)
		data.buckets = result.buckets;
		data.状态 = '成功';
		fiber.run();
	}).catch(function(err) {
		data.状态 = '失败';
		fiber.run();
	});
	Fiber.yield();//同步处理
	return data;
}

/*
 * 用法：某个bucket文件的清单
 * 传参：client对象，bucket名字(注意不是region，如zyk-club等实际的名字)，condition（条件，为json对象）
 * 返值：data对象:
 * {数据:{name:'',url:'',size:''...},状态:''}
 */
alioss.list = function(client,bucket,condition) {
	var fiber = Fiber.current;
	
	client.useBucket(bucket);//指定client的bucket
	var data = {};
	client.list(condition).then(function(result) {
		//console.log(result);
		data.数据= result.objects;
		data.状态 = '成功';
		fiber.run();
	}).catch(function(err) {
		console.log(err);
		data.状态 = '失败';
		fiber.run();
	});
	Fiber.yield();//同步处理
	return data;
}

/*
 * 用法：上传文件
 * 传参：client对象，bucket名字(注意不是region，如zyk-club等实际的名字)，obj(文件重新命名)，local(上传文件的路径)
 * 返值：data对象:
 * {数据:{name:'',url:'',res:''...},状态:''}
 */
alioss.put = function(client,bucket,obj,local) {
	var fiber = Fiber.current;
	
	client.useBucket(bucket);//指定client的bucket
	var data = {};
	client.put(obj,local).then(function(result) {
		//console.log(result);
		data.url = result.url;
		data.状态 = '成功';
		fiber.run();
	}).catch(function(err) {
		console.log(err);
		data.状态 = '失败';
		fiber.run();
	});
	Fiber.yield();//同步处理
	return data;
}

/*
 * 用法：下载阿里云文件
 * 传参：client对象，bucket名字(注意不是region，如zyk-club等实际的名字)，obj(阿里云上的文件名)，local(下载到本地的路径和自定义文件名)
 * 返值：data对象:
 * {状态:''}
 */
alioss.get = function(client,bucket,obj,local) {
	var fiber = Fiber.current;
	
	var data = {};
	client.useBucket(bucket);//指定client的bucket
	//console.log(client.options.bucket)
	client.get(obj,local).then(function(result) {
		//console.log(result);
		data.状态 = '成功';
		fiber.run();
	}).catch(function(err) {
		console.log(err);
		data.状态 = '失败';
		fiber.run();
	});
	Fiber.yield();//同步处理
	return data;
}


/*
 * 用法：删除阿里云文件
 * 传参：client对象，bucket名字(注意不是region，如zyk-club等实际的名字)，obj(阿里云上的文件名)
 * 返值：data对象:
 * {状态:''}
 */
alioss.delete = function(client,bucket,obj) {
	var fiber = Fiber.current;
	
	var data = {};
	client.useBucket(bucket);//指定client的bucket
	client.delete(obj).then(function(result) {
		//console.log(result);
		data.状态 = '成功';
		fiber.run();
	}).catch(function(err) {
		console.log(err);
		data.状态 = '失败';
		fiber.run();
	});
	Fiber.yield();//同步处理
	return data;
}


module.exports = alioss;