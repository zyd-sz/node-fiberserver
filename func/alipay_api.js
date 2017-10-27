//支付宝API
/**
 * 创建人:钟宝森
 * 创建时间:2017-6-2 11:55:00
 * 创建内容:封装成支付宝开放平台通用API函数
 * 
 * 相关支付宝文档地址:https://doc.open.alipay.com/doc2/apiList?docType=4
 * 
 * 更新人:钟宝森
 * 更新时间:2017-6-7 16:02:22
 * 更新内容:解决支付宝中文编码问题(请求方式post→get)
 */

const request = require('request');
const fs = require("fs");
const path = require("path");
const crypto = require('crypto');
const iconv = require('iconv-lite');
const Fiber = require('fibers');
const logs = require('./logs.js');
const moment = require('moment');
class AlipayRequest {
    constructor() {
        this.init();
    }

    init() {
        this._gateWayUrl = '';
        this._rsaPrivateKey = '';
        this._alipayrsaPublicKey = '';
        this.initParam();
    }

    initParam() {
        this.param = {};
    }

    set gateWayUrl(gateWayUrl) {
        this._gateWayUrl = gateWayUrl;
    }

    get gateWayUrl() {
        return this._gateWayUrl;
    }

    set rsaPrivateKey(pemPath) {
        this._rsaPrivateKey = this.getPemStr(pemPath);
    }

    get rsaPrivateKey() {
        return this._rsaPrivateKey;
    }

    set alipayrsaPublicKey(pemPath) {
        this._alipayrsaPublicKey = this.getPemStr(pemPath);
    }

    get alipayrsaPublicKey() {
        return this._alipayrsaPublicKey;
    }

    setParam(name, value) {
        this.param[name] = value;
    }

    getParam() {
        return this.param;
    }

    paramSort() {
        let newParam = {};
        let keyList = [];
        for (let index in this.param) {
            keyList.push(index);
        }
        keyList = keyList.sort();
        for (let index in keyList) {
            newParam[keyList[index]] = this.param[keyList[index]];
        }
        this.param = newParam;
    }

    paramQuery() {
        let i = 0;
        let signBefore = '';
        if (this.param.hasOwnProperty('sign')) {
            delete this.param['sign'];
        }
        this.paramSort();
        for (let index in this.param) {

            if (i == 0) {
                signBefore += `${index}=${this.param[index]}`;
                //signBefore += index + '=' + this.param[index];
            }
            else {
                signBefore += `&${index}=${this.param[index]}`;
                // signBefore += '&' + index + '=' + this.param[index];
            }
            i++;
        }
        return signBefore;
    }

    getSign() {
        let signBefore = this.paramQuery();
        if (!this.param.hasOwnProperty('sign_type')) {
            throw new Error('Param not has property:sign_type');
        }
        switch (this.param['sign_type']) {
            case 'RSA':
                var sign = crypto.createSign('RSA-SHA1');
                break;
            case 'RSA2':
                var sign = crypto.createSign('RSA-SHA256');
                break;
        }
        sign.update(signBefore);
        let res = sign.sign(this._rsaPrivateKey, 'base64');
        // console.log(signBefore);
        // console.log(res);
        return res;
    }


    getPemStr(pemPath) {
        let pemStr = fs.readFileSync(pemPath).toString();
        // pemStr = pemStr.replace(/--.*?-----/g, "");
        // pemStr = pemStr.replace(/\s/g, "");
        return pemStr;
    }

    getNowFormatDate(incrTime = 0) {
        var date = new Date();
        date.setTime(date.getTime() + incrTime);
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        var currentdate = date.getFullYear() + seperator1 + this.timeAddZero(month) + seperator1 + this.timeAddZero(strDate)
            + " " + this.timeAddZero(date.getHours()) + seperator2 + this.timeAddZero(date.getMinutes())
            + seperator2 + this.timeAddZero(date.getSeconds());
        return currentdate;
    }

    timeAddZero(sz) {
        if (sz >= 0 && sz <= 9) {
            sz = "0" + sz;
        }
        return sz;
    }

    getYmdFormatDate(incrTime = 0) {
        var date = new Date();
        date.setTime(date.getTime() + incrTime);
        var seperator1 = "-";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        var currentdate = date.getFullYear() + seperator1 + this.timeAddZero(month) + seperator1 + this.timeAddZero(strDate);
        return currentdate;
    }


    getRes() {
        return new Promise((resolve, reject) => {
            const qs = require('querystring');
            let signedParams = qs.stringify(this.param);
            console.log(this._gateWayUrl + "?" + signedParams);
            request.get(this._gateWayUrl + "?" + signedParams, function (err, response, body) {
                if (err) reject(err);
                resolve({ response: response, body: body });
            });
        });
    }
}







var AlipayAPI = {};


/**支付宝接口请求函数
 * @param app_id 支付宝开放平台ID  String
 * @param method 接口名称 String
 * @param biz_content 请求参数的集合 json格式
 * 密钥需要命名成open_rsa_private_key.pem与open_rsa_public_key.pem
 */
AlipayAPI.request = function (appid, method, biz_content) {

    var result = {};
    var fiber = Fiber.current;

    //-----------------Iint AlipayRequest----------------------
    let alipayRequest = new AlipayRequest();
    alipayRequest.gateWayUrl = 'https://openapi.alipay.com/gateway.do';    //固定接口地址
    try {
        alipayRequest.rsaPrivateKey = path.join("./", 'config', 'open_rsa_private_key.pem');
        alipayRequest.alipayrsaPublicKey = path.join("./", 'config', 'open_rsa_public_key.pem');
    } catch (e) {
        var err_msg = "需要配置好支付宝私钥与公钥\n" + e;
        throw new Error(err_msg);
    }

    alipayRequest.initParam();//every request must initParam
    //------------------SET sendParam-------------------
    alipayRequest.setParam('app_id', appid);    //'2017021405667105'
    alipayRequest.setParam('biz_content', JSON.stringify(biz_content));//get data,yesterday
    alipayRequest.setParam('charset', 'utf-8');
    alipayRequest.setParam('format', 'json');
    alipayRequest.setParam('method', method);
    alipayRequest.setParam('sign_type', 'RSA2');
    alipayRequest.setParam('version', '1.0');
    alipayRequest.setParam('timestamp', alipayRequest.getNowFormatDate());
    //这个必须是最后一个参数
    alipayRequest.setParam('sign', alipayRequest.getSign());
    //------------------Get result-------------------
    alipayRequest.getRes()
        .then((res) => {
            let backRes = JSON.parse(res.body);
            result.状态 = "成功";
            result.信息 = backRes;
            logs.write('pay/alipay/', '\n\n【' + biz_content['subject'] + '_支付宝】\n' + moment().format('YYYY-MM-DD HH:mm:ss') + '\n' + JSON.stringify(backRes));
            fiber.run();
        })
        .catch((err) => {
            console.log("------------err------------");
            console.log(JSON.stringify(err));
            console.log("------------err------------");
            result.状态 = "失败";
            result.信息 = err;
            logs.write('pay/alipay/', '\n\n【' + biz_content['subject'] + '_支付宝】\n' + moment().format('YYYY-MM-DD HH:mm:ss') + '\n' + JSON.stringify(err));
            fiber.run();
        });

    Fiber.yield();
    return result;

}

module.exports = AlipayAPI;