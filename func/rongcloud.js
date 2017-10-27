/**日志功能
创建时间：2016-09-23
创建人：吕扶美

更新时间
更新内容：
更新人：

*/
var rongcloudSDK = require('rongcloud-sdk');
var Fiber = require('fibers');
var config = require('./config.js');




var rongcloud = {};

rongcloud.user = {blacklist:{}};
rongcloud.block = {};
rongcloud.message = {
	private:{
		publish:'',
		publish_template:''
	},
	system:{
		publish:'',
		publish_template:''
	},
	group:{
		publish:''
	},
	discussion:{
		publish:''
	},
	chatroom:{
		publish:''
	},
	broadcast:''
};


rongcloud.group = {};


rongcloud.init = function(){
	var conf = config.get('rongcloud');
	if(conf != null){
		rongcloudSDK.init(conf.appkey,conf.appsecret);
		return 'ok'
	}else{
		return '未找到配置文件'
	}


}



rongcloud.user.getToken = function(userId,name,portraitUri){
	var result = {};
	var fiber = Fiber.current;
	rongcloudSDK.user.getToken(userId,name,portraitUri,function(err,data){
		if(err){
			result = {code:"-1",errmessage:err};
		}else{
			var data = JSON.parse(data);
			result = data;
		}
		fiber.run();
	});
	
	Fiber.yield();
	return result;
}


rongcloud.user.refresh = function(userId,name,portraitUri){
	var result = {};
	var fiber = Fiber.current;
	rongcloudSDK.user.refresh(userId,name,portraitUri,function(err,data){
		if(err){
			result = {code:"-1",errmessage:err};
		}else{
			var data = JSON.parse(data);
			result = data;
		}
		fiber.run();
	});
	
	Fiber.yield();
	return result;
}


rongcloud.user.checkOnline = function(userId){
	var result = {};
	var fiber = Fiber.current;
	rongcloudSDK.user.checkOnline(userId,function(err,data){
		if(err){
			result = {code:"-1",errmessage:err};
		}else{
			var data = JSON.parse(data);
			result = data;
		}
		fiber.run();
	});
	
	Fiber.yield();
	return result;
}


rongcloud.user.block = function(userId,numMinutes){
	var result = {};
	var fiber = Fiber.current;
	rongcloudSDK.user.block(userId,numMinutes,function(err,data){
		if(err){
			result = {code:"-1",errmessage:err};
		}else{
			var data = JSON.parse(data);
			result = data;
		}
		fiber.run();
	});
	
	Fiber.yield();
	return result;
}

rongcloud.user.unblock = function(userId){
	var result = {};
	var fiber = Fiber.current;
	rongcloudSDK.user.unblock(userId,function(err,data){
		if(err){
			result = {code:"-1",errmessage:err};
		}else{
			var data = JSON.parse(data);
			result = data;
		}
		fiber.run();
	});
	
	Fiber.yield();
	return result;
}

rongcloud.user.block.query = function(){
	var result = {};
	var fiber = Fiber.current;
	rongcloudSDK.user.block.query(function(err,data){
		if(err){
			result = {code:"-1",errmessage:err};
		}else{
			var data = JSON.parse(data);
			result = data;
		}
		fiber.run();
	});
	
	Fiber.yield();
	return result;
}

rongcloud.user.blacklist.add = function(userId,blackUserId){
	var result = {};
	var fiber = Fiber.current;
	rongcloudSDK.user.blacklist.add(userId,blackUserId,function(err,data){
		if(err){
			result = {code:"-1",errmessage:err};
		}else{
			var data = JSON.parse(data);
			result = data;
		}
		fiber.run();
	});
	
	Fiber.yield();
	return result;
}



rongcloud.user.blacklist.remove = function(userId,blackUserId){
	var result = {};
	var fiber = Fiber.current;
	rongcloudSDK.user.blacklist.remove(userId,blackUserId,function(err,data){
		if(err){
			result = {code:"-1",errmessage:err};
		}else{
			var data = JSON.parse(data);
			result = data;
		}
		fiber.run();
	});
	
	Fiber.yield();
	return result;
}


rongcloud.user.blacklist.query = function(userId){
	var result = {};
	var fiber = Fiber.current;
	rongcloudSDK.user.blacklist.query(userId,function(err,data){
		if(err){
			result = {code:"-1",errmessage:err};
		}else{
			var data = JSON.parse(data);
			result = data;
		}
		fiber.run();
	});
	
	Fiber.yield();
	return result;
}
 

rongcloud.message.private.publish = function(fromUserId,toUserId,objectName,content,pushContent,pushData){
	var result = {};
	var fiber = Fiber.current;
	rongcloudSDK.message.private.publish(fromUserId,toUserId,objectName,content,pushContent,pushData,function(err,data){
		if(err){
			result = {code:"-1",errmessage:err};
		}else{
			var data = JSON.parse(data);
			result = data;
		}
		fiber.run();
	});

	Fiber.yield();
	return result;
}

rongcloud.message.system.publish = function(fromUserId,toUserId,objectName,content,pushContent,pushData){
	var result = {};
	var fiber = Fiber.current;
	rongcloudSDK.message.system.publish(fromUserId,toUserId,objectName,content,pushContent,pushData,function(err,data){
		if(err){
			result = {code:"-1",errmessage:err};
		}else{
			var data = JSON.parse(data);
			result = data;
		}
		fiber.run();
	});

	Fiber.yield();
	return result;
}



rongcloud.message.group.publish = function(fromUserId,toGroupId,objectName,content,pushContent,pushData){
	var result = {};
	var fiber = Fiber.current;
	rongcloudSDK.message.group.publish(fromUserId,toGroupId,objectName,content,pushContent,pushData,function(err,data){
		if(err){
			result = {code:"-1",errmessage:err};
		}else{
			var data = JSON.parse(data);
			result = data;
		}
		fiber.run();
	});

	Fiber.yield();
	return result;
}

rongcloud.message.chatroom.publish = function(fromUserId,toChatroomId,objectName,content,pushContent,pushData){
	var result = {};
	var fiber = Fiber.current;
	rongcloudSDK.message.chatroom.publish(fromUserId,toChatroomId,objectName,content,pushContent,pushData,function(err,data){
		if(err){
			result = {code:"-1",errmessage:err};
		}else{
			var data = JSON.parse(data);
			result = data;
		}
		fiber.run();
	});

	Fiber.yield();
	return result;
}


rongcloud.message.broadcast = function(fromUserId,objectName,content,pushContent,pushData){
	var result = {};
	var fiber = Fiber.current;
	rongcloudSDK.message.broadcast(fromUserId,objectName,content,pushContent,pushData,function(err,data){
		if(err){
			result = {code:"-1",errmessage:err};
		}else{
			var data = JSON.parse(data);
			result = data;
		}
		fiber.run();
	});

	Fiber.yield();
	return result;
}

rongcloud.group.sync = function(userId,groupIdNamePairs){
	var result = {};
	var fiber = Fiber.current;
	rongcloudSDK.group.sync(userId,groupIdNamePairs,function(err,data){
		if(err){
			result = {code:"-1",errmessage:err};
		}else{
			var data = JSON.parse(data);
			result = data;
		}
		fiber.run();
	});

	Fiber.yield();
	return result;
}


rongcloud.group.create = function(userIDs,groupId,groupName){
	var result = {};
	var fiber = Fiber.current;
	rongcloudSDK.group.create(userIDs,groupId,groupName,function(err,data){
		if(err){
			result = {code:"-1",errmessage:err};
		}else{
			var data = JSON.parse(data);
			result = data;
		}
		fiber.run();
	});

	Fiber.yield();
	return result;
}

rongcloud.group.join = rongcloud.group.create;


rongcloud.group.quit = function(userIDs,groupId){
	var result = {};
	var fiber = Fiber.current;
	rongcloudSDK.group.quit(userIDs,groupId,function(err,data){
		if(err){
			result = {code:"-1",errmessage:err};
		}else{
			var data = JSON.parse(data);
			result = data;
		}
		fiber.run();
	});

	Fiber.yield();
	return result;
}



rongcloud.group.dismiss = function(userID,groupId){
	var result = {};
	var fiber = Fiber.current;
	rongcloudSDK.group.dismiss(userID,groupId,function(err,data){
		if(err){
			result = {code:"-1",errmessage:err};
		}else{
			var data = JSON.parse(data);
			result = data;
		}
		fiber.run();
	});

	Fiber.yield();
	return result;
}


rongcloud.group.refresh = function(groupId,groupName){
	var result = {};
	var fiber = Fiber.current;
	rongcloudSDK.group.refresh(groupId,groupName,function(err,data){
		if(err){
			result = {code:"-1",errmessage:err};
		}else{
			var data = JSON.parse(data);
			result = data;
		}
		fiber.run();
	});

	Fiber.yield();
	return result;
}

rongcloud.group.query = function(groupId){
	var result = {};
	return result;
}





module.exports = rongcloud;