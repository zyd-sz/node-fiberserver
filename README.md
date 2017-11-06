# node-fiberserver

## 安装方法
1.直接下载zip包解压。

2.使用 `git clone https://github.com/zyd-sz/node-fiberserver `命令。


## 版本说明  2.0.3
**最近更新**
<br/>
1.修改sql语句入参方式，采用占位符显示拼接sql语句，有效防止sql注入攻击<br/>
    1. mysql 使用 ？站位<br/>
    2. pgsql 使用 $ 站位<br/>
    示例: <br/> var sql = 'select * from xxx表  where 账号=$1 and 唯一id=$2';<br/>
           var sqldata=[f.username,f.onlyId];  //与参数必须一一对应<br/>
           var result = pgdb.query(pg,sql,sqldata); //获取结果，和以前一样

    注意：若采用老版本sql语句直接拼接，sqldata 为空，或不传。
<br/>
 2.func文件夹添加calculator.js 工具，用于精确计算
 举个栗子：<br/>
      console.log(calc.add(0.01,0.02)); ==>0.03<br/>
       console.log(calc.sub(0.01,0.02)); ==>-0.01<br/>
       console.log(calc.mul(0.01,0.02));==>0.0002<br/>
       console.log(calc.div(0.01,0.02));==>0.5<br/>


## 版本说明  2.0.2
**最近更新**
-  增加定任务总控文件run.json,此文件不存在将不执行任何功能。
-  各功能接口结束时控制台输出增加了显示时间。
-  修复了部分bug。


**重点说明**
- 2.x版本不与1.x版本兼容！！！！！

##  安装方法
-  下载工程包并解压
-  打开命令行并执行：`npm install `  命令
-  由于国外网络速度受限制，推荐使用淘宝 NPM 镜像: `cnpm install `  命令进行安装 。(淘宝源安装命令：`npm install -g cnpm --registry=https://registry.npm.taobao.org`)
-  建议使用pm2 进行程序启动 命令： `pm2 start start.json `


##  文件说明

+ start.json(pm2启动配置文件)
+ apimain.js(服务器启动入口文件)
+ time_run_main.js(定时任务启动入口文件)
+ README.md(说明文档)
+ package.josn(框架清单)
+ config(配置文件目录)
    + app.json(程序主要配置文件如：监听商品，数据库类型，数据库连接参数等)
+ func(同步功能方法封装文件目录)
+ api(APP接口目录)
    + api.js(接口主文件)
+ routes(*xhtml接口目录)
    + app_routes_main.js(接口主文件)
+ www(静态文件目录)
+ im(socket.io接口文件目录)
    + app_im_main.js(接口主文件)
    + auth.js(用户认证接口文件)
    + time.js(心跳包接口文件)
    + cnannel.js(集群频道接口文件)
    + disconnect.js(断开连接接口文件)
+ temp(临时文件目录)
+ time_run_func(定时任务功能目录)
+ time_run_second(定时任务时间控制目录)

##  部分范例代码

#### common 常用功能
```javascript

//去除数据中含有null的
// var a = common.removenull("{"账号":null,"手机号码":null}");
// var b = {"账号":null,"手机号码":null};
// var a = common.removenull(b);


//取当前时间的几天后或几月后
// var a = common.afterDM("2015-02-01 00:00:00","day",1);
// var a = common.afterDM("2015-02-01 00:00:00","month",1);


//获取范围内的随机数
// var a = common.sjs("1000","9999");

//获取两个时间的差
var d = common.timeSecond(time1,time2);


//截取中间字符串
// var str = "hello world"
// var a = common.getsub(str,"h","o");
// console.log(a);  //ell

```

####  数据库事务

```javascript
 //postgresql开始事务
  var begin = pgdb.query(db,"BEGIN;");
  //postgresql保存事务
  var commit = pgdb.query(db,"COMMIT;");
  //postgresql回滚事务
  var rollback = pgdb.query(db,"ROLLBACK;");
  
  //mysql开始事务
  var begin = mysql.query(db,"BEGIN;");
  //mysql保存事务
  var commit = mysql.query(db,"COMMIT;");
  //mysql回滚事务
  var rollback = mysql.query(db,"ROLLBACK;");

```

#### cipher加密模块


```javascript
//引用
var cipher = require('../func/cipher.js');  
//aes加密
var str = cipher.aesencode('1234567890','12345678901234567890123456789012');
console.log(str);

//aes解密
var str1 = cipher.aesdecode(str,'12345678901234567890123456789012');
console.log(str1);

//md5加密
var str2 = cipher.md5('123456');
console.log(str2);

//sha1加密
var str3 = cipher.sha1('123456');
console.log(str3);

```

#### 腾讯云短信 (腾讯云支持国内国外发送短信)

```javascript
   var txsms = require('../func/txsms.js');

  //appid和appkey
  var sms = txsms.init(1400042231,'472dfgsedrtgertcc83737');

  //发送文本短信
  var result = sms.sendsms('86','138********','短信内容');

  console.log(result);//{ result: '0', errmsg: 'OK',ext: 'some msg', sid: '8:yse1LEwcnP0mkM8mJgo20171030',count: 1,  fee: 2 }

  //发送语音验证码
  var result1 = sms.sendvoice('86','138********','3456');

  console.log(result1);//{ result: '0', errmsg: 'OK', ext: 'some msg', callid: 'ad7d7ebe-bd55-11e7-b52a-525400b306ee' }

```

####  支付宝下单 (支持扫码支付、网页支付等下单)

```javascript
var AlipayAPI = require("../func/alipay_api.js");

module.exports.run = function (body,db, mo,redis) {

      var subject = "iphone8 1TB全网通";

      var data = {};
      data.out_trade_no = "001"+(new Date()).valueOf();
      data.store_id = "NJ_001"; 
      data.subject = subject;
      data.total_amount = 0.01;    
      data.timeout_express = "90m";
       
      var result = AlipayAPI.request("2017021405667105","alipay.trade.precreate",data);
      return result;

}

```
####  微信支付  (支持公众号支付、扫码支付、原生APP支付)

```javascript

var WeixinPay = require("../func/weixin_api.js");
var config = require("../func/config.js");

module.exports.run = function (body, pg, mo) {

    var conf = config.get("pay").微信支付;

    ////公众号支付
    //  var key = [];
    //  key.push("openid");
    //  key.push("body");
    //  key.push("detail");
    //  key.push("out_trade_no");
    //  key.push("total_fee");
    //  key.push("spbill_create_ip");
    //  key.push("notify_url");
    //  var value = [];
    //  value.push("oI6wfw3PpJyM1MAPgDz0jxjeL5Q8");
    //  value.push("1块钱测试");
    //  value.push("你确定这是1块钱");
    //  value.push("001" + (new Date()).valueOf());
    //  value.push("0.01");
    //  value.push("0.0.0.0");
    //  value.push("http://xxx/test_wx.xhtml");
    //  var result = WeixinPay.request("JSAPI",key,value);
    //  console.log("-------------JSAPI------------------");
    //  console.log(result);
    
    //  return result;

    //扫码支付
     var weixin_conf = {};
     weixin_conf.appid = conf.appid;
     weixin_conf.mch_id = conf.mch_id;
     weixin_conf.partner_key = conf.partner_key;

     var key = [];
     key.push("body");
     key.push("product_id");
     key.push("out_trade_no");
     key.push("total_fee");
     key.push("spbill_create_ip");
     key.push("notify_url");
     var value = [];
     value.push("1块钱测试");
     value.push("1234567890");
     value.push("001" + (new Date()).valueOf());
     value.push("0.01");
     value.push("0.0.0.0");
     value.push("http://xxx/test_wx.xhtml");
     var result = WeixinPay.request("NATIVE",weixin_conf,key,value);
     console.log("-------------NATIVE------------------");
     console.log(result);
    
     return result;


    //原生支付
    //  var key = [];
    //  key.push("body");
    //  key.push("product_id");
    //  key.push("out_trade_no");
    //  key.push("total_fee");
    //  key.push("spbill_create_ip");
    //  key.push("notify_url");
    //  var value = [];
    //  value.push("1块钱测试");
    //  value.push("1234567890");
    //  value.push("001" + (new Date()).valueOf());
    //  value.push("0.01");
    //  value.push("0.0.0.0");
    //  value.push("http://xxx/test_wx.xhtml");
    //  var result = WeixinPay.request("APP",key,value);
    //  console.log("-------------APP------------------");
    //  console.log(result);
    
    //  return result;


}


```


> 更多功能请详细阅读禅道系统文档
