/*
 * 数据单条显示及增删改
 */
//已经是同步的，用异步写也会同步执行
var nodeExcel = require('excel-export'); //生成表格

var excel = {};
//单条显示
/*
 * 通过对参数值进行解析转化为一个表格形式的buffer流
 * data:数据库数据
 */
excel.import = function(data) {
	var key_arr = [];//行字段
	var data_arr = [];//列字段
	var conf = {};
	//重定向

	for(key in data[0]) {
		key_arr.push({
			'caption': key//导航栏行字段
		});
	}
	(data).forEach(function(item, a) {
		data_arr[a] = new Array;
		for(key in item) {
			data_arr[a].push(item[key]);
		}
	});
	conf.cols = key_arr; //行名
	//console.log(data_arr);//例如：[['v1','v2'],['v3','v4']]
	//conf.rows = [['pi'],["e"]]; 表的数据格式
	conf.rows = data_arr;
	var result = nodeExcel.execute(conf);
	return result;
}

module.exports = excel;