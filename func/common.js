/**
 * 新增人:钟宝森
 * 新增时间:2017-12-4 11:49:00
 * 新增内容:新增对于天级时级分级的时间进行匹配的函数
 */

var moment = require("moment");
var config = require("./config.js");

var common = {};

/* [去除数据中含有null的
调用方法:
result:json类型或者是string类型
 */
common.removenull = function (result) {
    var reg = new RegExp(":null", "g");
    var notnull;
    if (typeof (result) == "string") {
        try {
            notnull = result.replace(reg, ':""');
        } catch (e) {
            console.error(e);
            return;
        }
        return notnull;
    }
    else if (typeof (result) == "object") {
        try {
            result = JSON.stringify(result);
            result = result.replace(reg, ':""');
            notnull = JSON.parse(result);
        } catch (e) {
            console.error(e);
            return null;
        }

        return notnull;
    }
    else {
        return notnull;
    }
}


/* [取当前时间的几天后或几月后
调用方法:
ee:时间[2015-02-01 00:00:00]
type: day是几天后,month是几月后
num:月份,负号为上几月,Number类型
*/
common.afterDM = function (ee, type, num) {
    var r = '';
    var now = "";
    if (ee == null) {
        now = new Date();//指定日期
    }
    else {
        now = new Date(ee);
    }

    if (type == "") {
        return null;
    }
    else if (type == "day") {
        var lastMonth = new Date(now.getFullYear(), num + now.getMonth(), now.getDate());
        var ty = 'YYYY-MM-DD HH:mm:ss';
        var le = ee.length;
        ty = ty.substr(0, le);
        r = moment(lastMonth).format(ty);
        return r;
    }
    else if (type == "month") {
        var lastMonth = new Date((now / 1000 + (num * 24 * 60 * 60)) * 1000);
        var ty = 'YYYY-MM-DD HH:mm:ss';
        r = moment(lastMonth).format(ty);
        return r;
    }
    else {
        return null;
    }


}

/*]获取范围内的随机数 
调用方法:
min:最小数
max:最大数
*/
common.sjs = function (min, max) {
    var num = Math.floor(min + Math.random() * (max - min));
    return String(num);
}
/*]获取范围内的随机数 */



/*取字符串拼音首字母(大写)*/


/*截取中间字符串
	var str = "hello world"
	var newStr = this.getsub(str,"h","o");
	console.log(newStr);  //ell
*/
common.getsub = function (str, start, end) {
    var s = str.indexOf(start);
    var e = str.indexOf(end);
    if (s == -1) {
        return null
    } else {
        if (e == -1) {
            e = str.length;
        }
        return str.substring(s + start.length, e);
    }
}


/*[取两数相差秒数 */
common.timeSecond = function (time2, time1) {
    var date1 = new Date(time1);
    var date2 = new Date(time2);
    var time = (date2 - date1) / 1000;
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

/**
 * 对于天级时级分级的时间进行匹配的函数
 * @param {*} jsonFile json文件名 路径要放在config文件夹下
 * @param {*} func  json文件内对应的配置文件
 * 
 * 格式如下格式才能正常读取
{
    "a":{
        "day":[],
        "hour":[],
        "minute":[30,60]   //代表只能在每30分 和 每60分执行
    }
}

支持天时分搭配使用
调用:
if(!common.dealTime("time","p_pay_commit")){
        console.log("没有到时候,还不能运行O(∩_∩)O");
        return;
}
注:此函数只针对定时任务封装的函数
 */
common.dealTime = (jsonFile, func) => {
    var data = false; //初始为false;
    var day;
    var hour;
    var minute;
    var nowtime = moment().format('YYYY-MM-DD HH:mm:ss');
    try {
        var FILE = eval('config.get(jsonFile).'+func);
    } catch (e) {
        console.warn('读取不到对应的' + func + '配置参数');
        data = false;
        return data;
    }

    try {
        day = FILE.day;
        hour = FILE.hour;
        minute = FILE.minute;
    } catch (e) {
        console.warn('读取' + func + '配置异常,请查看配置是否正确');
        data = false;
        return data;
    }

    if (!day) {
        console.warn('读取' + func + '配置day异常,请查看配置是否正确');
        data = false;
        return data;
    }

    if (!hour) {
        console.warn('读取' + func + '配置hour异常,请查看配置是否正确');
        data = false;
        return data;
    }

    if (!minute) {
        console.warn('读取' + func + '配置minute异常,请查看配置是否正确');
        data = false;
        return data;
    }

    if(hour.length == 0 && day.length == 0 && minute.length == 0){  //不设置任何时间则按照秒数来执行
        data = true;
        return data;
    }

    if(day.length == 0 && minute.length == 0){  //设置天时级则按照时级来执行
        if(hour.length > 0){
            for (let value of minute) {
                if (value == Number(moment().format('mm'))) {
                    data = true;
                    return data;
                }
            }
            data = false;
            return data;
        }
    }

    if(day.length == 0 && hour.length == 0){  //设置分级则按照时级来执行
        if(minute.length > 0){
            for (let value of minute) {
                if (value == Number(moment().format('mm'))) {
                    data = true;
                    return data;
                }
            }
            data = false;
            return data;
        }
    }

    if(day.length == 0){   //设置时级与分级则按照时分级来执行
        if(hour.length > 0){
            for (let value of hour) {
                if (value == Number(moment().format('HH'))) {
                    if(minute.length > 0){
                        for (let value of minute) {
                            if (value == Number(moment().format('mm'))) {
                                data = true;
                                return data;
                            }
                        }
                        data = false;
                        return data;
                    }else{
                        data = true;
                        return data;    //设置时级则按照时级来执行
                    }
                }
            }
            data = false;
            return data;
        }
    }

    if (day.length > 0) {  
        for (let value of day) {
            if (value == Number(moment().format('DD'))) {
                if(hour.length > 0){
                    for (let value of hour) {
                        if (value == Number(moment().format('HH'))) {
                            if(minute.length > 0){
                                for (let value of minute) {
                                    if (value == Number(moment().format('mm'))) {
                                        data = true;
                                        return data;  //设置天级、时级、分级则按照天时分级来执行
                                    }
                                }
                                data = false;
                                return data;
                            }
                            else{
                                data = true;
                                return data;  //设置天时级则按照天时级来执行
                            }
                        }
                    }
                    data = false;
                    return data;
                }else{
                    data = true;
                    return data;  //设置天级则按照天级来执行
                }
            }
        }
        data = false;
        return data;
    }




}

module.exports = common;