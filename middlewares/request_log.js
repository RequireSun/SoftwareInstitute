// 请求记录中间件
'use strict';

var logger = require('../common/logger');
// var app = require('../app');

module.exports = function (req, res, next) {
    // 静态资源请求不记录
    if (exports.ignore.test(req.url)) {
        next();
        return;
    }

    // TODO 获取 ip
    // 判断是否使用代理， 并获取真实的客户地址
    // var reqIp = app.enabled('trust proxy')? req.ips[0]: req.ip;
    var reqIp = req.ip;
    // 开始结束计时
    var time = new Date();
    logger.log('\nStarted', time.toUTCString(), req.method, req.url, reqIp);

    res.on('finish', function () {
        var duration = ((new Date()) - time);

        logger.log('Completed', res.statusCode, ('(' + duration + 'ms)').green, req.method, req.url, reqIp);
    });

    next();
}

// 匹配静态资源路径
exports.ignore = /^\/(public|agent)/;