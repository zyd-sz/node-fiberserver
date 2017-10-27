var moment = require("moment");

var common = {};

/* [去除数据中含有null的
调用方法:
result:json类型或者是string类型
 */
common.removenull = function (result){
    var reg=new RegExp(":null","g");
    var notnull;
    if(typeof(result) == "string"){
        try{
           notnull = result.replace(reg,':""');
        }catch(e){
           console.error(e);
           return;
        } 	 
         return notnull;
    }
    else if(typeof(result) == "object"){
        try{
           result = JSON.stringify(result);
           result = result.replace(reg,':""');
           notnull = JSON.parse(result);
        }catch(e){
           console.error(e);
           return null;
        } 	 
       
       return notnull;
    }
    else{
        return notnull;
    }
}


/* [取当前时间的几天后或几月后
调用方法:
ee:时间[2015-02-01 00:00:00]
type: day是几天后,month是几月后
num:月份,负号为上几月,Number类型
*/
common.afterDM = function(ee,type,num){
		var r='';
        var now = "";
		if(ee==null){
          now = new Date();//指定日期
        }
		else{
          now = new Date(ee);
        }

        if(type == ""){
            return null;
        }
        else if(type == "day"){
            var lastMonth = new Date(now.getFullYear(),num+now.getMonth(),now.getDate());
            var ty='YYYY-MM-DD HH:mm:ss';
            var le=ee.length;
            ty=ty.substr(0,le);
            r = moment(lastMonth).format(ty); 
            return r;
        }
        else if(type == "month"){
            var lastMonth = new Date((now/1000+(num*24*60*60))*1000);
            var ty='YYYY-MM-DD HH:mm:ss';
            r = moment(lastMonth).format(ty);
            return r;
        } 
		else{
            return null;
        }
		
		
	}

/*]获取范围内的随机数 
调用方法:
min:最小数
max:最大数
*/
common.sjs =function (min,max){
var num=Math.floor(min+Math.random()*(max-min));
return String(num);
}
/*]获取范围内的随机数 */



/*取字符串拼音首字母(大写)*/


/*截取中间字符串
	var str = "hello world"
	var newStr = this.getsub(str,"h","o");
	console.log(newStr);  //ell
*/
common.getsub  = function (str,start,end){
	var s = str.indexOf(start);
	var e = str.indexOf(end);
	if(s == -1){
		return null
	}else{
		if(e == -1){
			e = str.length;
		}
		return str.substring(s+start.length,e);
	}
}


/*[取两数相差秒数 */
common.timeSecond = function(time2,time1){
  var date1=new Date(time1);
  var date2=new Date(time2);
  var time=(date2-date1)/1000;
  return time;
}
/*]取两数相差秒数 */


/**
 * 参数判空
 * @param obj
 * @param data
 * @returns {*}
 * 使用方法：在业务代码最前面加 ↓
 *
   const {字段A, 字段B, 字段C, 字段D, 字段E} = f;
   const obj = {字段A, 字段B, 字段C, 字段D, 字段E};
   data = judgeNull(obj, data);
   if (data.状态 != '成功') return data;
 */
common.judgeNull = (obj, data) => {
    for (let item in obj) {
        if (!obj[item]) {
            data.状态 = `${item}不能为空`;
            break;
        }
    }
    return data;
};


module.exports = common;