//微信支付API
/**
 * 创建人:钟宝森
 * 创建时间:2017-6-20 15:38:20
 * 创建内容:新增扫码支付,公众号支付,原生支付的支持,新项目请使用,老项目可以用pay.js
 * 
 * 相关微信支付文档地址:https://pay.weixin.qq.com/wiki/doc/api/index.html
 * 
 */

var WXPay = require('weixin-pay');
var Fiber = require('fibers');
var moment = require('moment');

var config = require('./config.js');

class WinxinPay {
    constructor(appid, mch_id, partner_key) {
        this.init(appid, mch_id, partner_key);
    }
    init(appid, mch_id, partner_key) {
        this.result = {};
        this.wxpay = WXPay({
            appid: appid,
            mch_id: mch_id,
            partner_key: partner_key, //微信商户平台API密钥
            // pfx: fs.readFileSync('./wxpay_cert.p12'), //微信商户平台证书
        });
        this.dateNow = Date.now();
        this.dateNow = ((String)(this.dateNow)).slice(0, 10);
        this.initParam();
    }
    initParam() {
        this.param = {};
    }
    set winxinType(type) {
        this.Type = type;
    }

    get winxinType() {
        return this.Type;
    }
    setParam(name, value) {
        this.param[name] = value;
    }

    getParam() {
        return this.param;
    }
    getres() {
        let type = this.Type;
        switch (type) {
            case "NATIVE":
                return this.native_pay(type);
            case "APP":
                return this.app_pay(type);
            case "JSAPI":
                return this.jsapi_pay();
            default:
                this.result.状态 = "失败";
                this.result.信息 = "类型有误";
                return this.result;
        }
    }
    native_pay(type) {
        var _this = this;
        let having = Object.keys(_this.param);
        let logs = require('./logs.js');
        let _ishaving = ['body', 'out_trade_no', 'total_fee', 'spbill_create_ip', 'notify_url', 'product_id'];
        return new Promise(function (resolve, reject) {
            var a = String(having.sort());
            var b = String(_ishaving.sort());
            if (a != b) {
                _this.result.状态 = "失败";
                _this.result.信息 = "参数缺失";
                reject(_this.result);
            }
            _this.param['total_fee'] = Number(_this.param['total_fee']) * 100;
            _this.param['total_fee'] = (_this.param['total_fee']).toFixed(0);

            _this.wxpay.createUnifiedOrder({
                body: _this.param['body'],
                out_trade_no: _this.param['out_trade_no'],
                total_fee: _this.param['total_fee'],
                spbill_create_ip: _this.param['spbill_create_ip'],
                notify_url: _this.param['notify_url'],
                trade_type: type,
                product_id: _this.param['product_id']
            }, function (err, result) {
                if (err) {
                    _this.result.状态 = "失败";
                    _this.result.信息 = err;
                    //下单日志
                    logs.write('pay/wx/', '\n\n【' + _this.param['body'] + '_扫码微信支付】\n' + moment().format('YYYY-MM-DD HH:mm:ss') + '\n' + JSON.stringify(_this.result));
                    reject(_this.result);
                }
                else {
                    _this.result.状态 = "成功";
                    _this.result.信息 = result;
                    //下单日志
                    logs.write('pay/wx/', '\n\n【' + _this.param['body'] + '_扫码微信支付】\n' + moment().format('YYYY-MM-DD HH:mm:ss') + '\n' + JSON.stringify(_this.result));
                    resolve(_this.result);
                }

            });
        });
    }
    app_pay(type) {
        var _this = this;
        let having = Object.keys(_this.param);
        let logs = require('./logs.js');
        let _ishaving = ['body', 'out_trade_no', 'total_fee', 'spbill_create_ip', 'notify_url', 'product_id'];
        return new Promise(function (resolve, reject) {
            var a = String(having.sort());
            var b = String(_ishaving.sort());
            if (a != b) {
                _this.result.状态 = "失败";
                _this.result.信息 = "参数缺失";
                reject(_this.result);
            }
            _this.param['total_fee'] = Number(_this.param['total_fee']) * 100;
            _this.param['total_fee'] = (_this.param['total_fee']).toFixed(0);

            _this.wxpay.createUnifiedOrder({
                body: _this.param['body'],
                out_trade_no: _this.param['out_trade_no'],
                total_fee: _this.param['total_fee'],
                spbill_create_ip: _this.param['spbill_create_ip'],
                notify_url: _this.param['notify_url'],
                trade_type: type,
                product_id: _this.param['product_id']
            }, function (err, result) {
                if (err) {
                    _this.result.状态 = "失败";
                    _this.result.信息 = err;
                    //下单日志
                    logs.write('pay/wx/', '\n\n【' + _this.param['body'] + '_APP微信支付】\n' + moment().format('YYYY-MM-DD HH:mm:ss') + '\n' + JSON.stringify(_this.result));
                    reject(_this.result);
                }
                else {
                    if (result.return_code == 'SUCCESS') {
                        let ret = {
                            appid: result.appid,
                            partnerid: result.mch_id,
                            prepayid: result.prepay_id,
                            noncestr: result.nonce_str,
                            timestamp: _this.dateNow,
                            package: 'Sign=WXPay'
                        }
                        ret.sign = _this.wxpay.sign(ret);
                        //下单日志
                        logs.write('pay/wx/', '\n\n【' + _this.param['body'] + '_APP微信支付】\n' + moment().format('YYYY-MM-DD HH:mm:ss') + '\n' + JSON.stringify(ret));
                        _this.result.状态 = '成功';
                        _this.result.信息 = ret;
                    }
                    else {
                        let ret = result.return_msg;
                        _this.result.状态 = '失败';
                        _this.result.信息 = ret;
                        //下单日志
                        logs.write('pay/wx/', '\n\n【' + _this.param['body'] + '_APP微信支付】\n' + moment().format('YYYY-MM-DD HH:mm:ss') + '\n' + JSON.stringify(ret));
                    }
                    resolve(_this.result);
                }

            });
        });
    }
    jsapi_pay() {
        var _this = this;
        let logs = require('./logs.js');
        let having = Object.keys(_this.param);
        let _ishaving = ['openid', 'body', 'detail', 'out_trade_no', 'total_fee', 'spbill_create_ip', 'notify_url'];
        return new Promise(function (resolve, reject) {

            var a = String(having.sort());
            var b = String(_ishaving.sort());
            if (a != b) {
                _this.result.状态 = "失败";
                _this.result.信息 = "参数缺失";
                reject(_this.result);
            }

            _this.param['total_fee'] = Number(_this.param['total_fee']) * 100;
            _this.param['total_fee'] = (_this.param['total_fee']).toFixed(0);

            _this.wxpay.getBrandWCPayRequestParams({
                openid: _this.param['openid'],
                body: _this.param['body'],
                detail: _this.param['detail'],
                out_trade_no: _this.param['out_trade_no'],
                total_fee: Number(_this.param['total_fee']),
                spbill_create_ip: _this.param['spbill_create_ip'],
                notify_url: _this.param['notify_url']
            }, function (err, result) {
                if (err) {
                    _this.result.状态 = "失败";
                    _this.result.信息 = err;
                    //下单日志
                    logs.write('pay/wx/', '\n\n【' + _this.param['body'] + '_公众号微信支付】\n' + moment().format('YYYY-MM-DD HH:mm:ss') + '\n' + JSON.stringify(_this.result));
                    reject(_this.result);
                }
                else {
                    _this.result.状态 = "成功";
                    _this.result.信息 = result;
                    console.log(result);
                    //下单日志
                    logs.write('pay/wx/', '\n\n【' + _this.param['body'] + '_公众号微信支付】\n' + moment().format('YYYY-MM-DD HH:mm:ss') + '\n' + JSON.stringify(_this.result));
                    resolve(_this.result);
                }
            });
        });
    }

}


var WeixinPay = {};


/**微信接口请求函数
 * @param type NATIVE（扫码支付） APP（APP支付） JSAPI（公众号支付）
 * @param config 配置文件参数 appid mch_id partner_key
 * @param key 请求的参数名
 * @param value 请求的参数值
 */
WeixinPay.request = function (type, config, key, value) {
    var result = {};

    switch (type) {
        case "NATIVE":
            return this.native_pay(config, key, value);
        case "APP":
            return this.app_pay(config, key, value);
        case "JSAPI":
            return this.jsapi_pay(config, key, value);
        default:
            result.状态 = "失败";
            result.信息 = "类型有误";
            return result;
    }


}

WeixinPay.jsapi_pay = function (config, key, value) {
    var result = {};
    if (typeof (config) != "object") {
        result.状态 = "失败";
        result.信息 = "微信配置有误";
        return result;
    }
    if (!config.hasOwnProperty("appid")) {
        result.状态 = "失败";
        result.信息 = "配置参数缺少appid";
        return result;
    }
    if (!config.hasOwnProperty("mch_id")) {
        result.状态 = "失败";
        result.信息 = "配置参数缺少mch_id";
        return result;
    }
    if (!config.hasOwnProperty("partner_key")) {
        result.状态 = "失败";
        result.信息 = "配置参数缺少partner_key";
        return result;
    }
    
    var fiber = Fiber.current;
    var wechat = new WinxinPay(config.appid, config.mch_id, config.partner_key);
    wechat.winxinType = "JSAPI";
    wechat.initParam();
    for (var i = 0; i < key.length; i++) {
        wechat.setParam(key[i], value[i]);
    }
    wechat.getres()
        .then((res) => {
            result.状态 = res.状态;
            result.信息 = res.信息;
            fiber.run();
        })
        .catch((err) => {
            result.状态 = err.状态;
            result.信息 = err.信息;
            fiber.run();
        });

    Fiber.yield();
    return result;
}

WeixinPay.app_pay = function (config, key, value) {
    var result = {};
    if (typeof (config) != "object") {
        result.状态 = "失败";
        result.信息 = "微信配置有误";
        return result;
    }
    if (!config.hasOwnProperty("appid")) {
        result.状态 = "失败";
        result.信息 = "配置参数缺少appid";
        return result;
    }
    if (!config.hasOwnProperty("mch_id")) {
        result.状态 = "失败";
        result.信息 = "配置参数缺少mch_id";
        return result;
    }
    if (!config.hasOwnProperty("partner_key")) {
        result.状态 = "失败";
        result.信息 = "配置参数缺少partner_key";
        return result;
    }
    
    var fiber = Fiber.current;
    var wechat = new WinxinPay(config.appid, config.mch_id, config.partner_key);
    wechat.winxinType = "APP";
    wechat.initParam();
    for (var i = 0; i < key.length; i++) {
        wechat.setParam(key[i], value[i]);
    }
    wechat.getres()
        .then((res) => {
            result.状态 = res.状态;
            result.信息 = res.信息;
            fiber.run();
        })
        .catch((err) => {
            result.状态 = err.状态;
            result.信息 = err.信息;
            fiber.run();
        });

    Fiber.yield();
    return result;
}

WeixinPay.native_pay = function (config, key, value) {
    var result = {};
    if (typeof (config) != "object") {
        result.状态 = "失败";
        result.信息 = "微信配置有误";
        return result;
    }
    if (!config.hasOwnProperty("appid")) {
        result.状态 = "失败";
        result.信息 = "配置参数缺少appid";
        return result;
    }
    if (!config.hasOwnProperty("mch_id")) {
        result.状态 = "失败";
        result.信息 = "配置参数缺少mch_id";
        return result;
    }
    if (!config.hasOwnProperty("partner_key")) {
        result.状态 = "失败";
        result.信息 = "配置参数缺少partner_key";
        return result;
    }
    
    var fiber = Fiber.current;
    var wechat = new WinxinPay(config.appid, config.mch_id, config.partner_key);
    wechat.winxinType = "NATIVE";
    wechat.initParam();
    for (var i = 0; i < key.length; i++) {
        wechat.setParam(key[i], value[i]);
    }
    wechat.getres()
        .then((res) => {
            result.状态 = res.状态;
            result.信息 = res.信息;
            fiber.run();
        })
        .catch((err) => {
            result.状态 = err.状态;
            result.信息 = err.信息;
            fiber.run();
        });

    Fiber.yield();
    return result;
}

module.exports = WeixinPay;

        //调用范例,传入参数按照官方的说明传入
        // var WeixinPay = new WinxinPay("appid","mch_id","partner_key");
        // var key = [];
        // key.push("openid");
        // key.push("body");
        // key.push("detail");
        // key.push("out_trade_no");
        // key.push("total_fee");
        // key.push("spbill_create_ip");
        // key.push("notify_url");
        // var value = [];
        // value.push("oI6wfw3PpJyM1MAPgDz0jxjeL5Q8");
        // value.push("1块钱测试");
        // value.push("你确定这是1块钱");
        // value.push("001" + (new Date()).valueOf());
        // value.push("0.01");
        // value.push("0.0.0.0");
        // value.push("http://wechat.qq-pt.com/test_wx.xhtml");
        // var result = WeixinPay.request("JSAPI", key, value);
        // console.log("-------------JSAPI------------------");
        // console.log(result);