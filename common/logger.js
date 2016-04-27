'use strict';

const fs     = require('fs');
const config = require('../config');

// TODO 记得做日志分片
// 若无日志目录，则创建日志目录
if (!fs.existsSync('./log')) {
    fs.mkdirSync('./log');
}

// 分别为： 普通/ 信息/ debug/ 警告/ 错误
exports.log = (...args) =>
    writeLog(' log:   ', 'info', args);

exports.info = (...args) =>
    writeLog(' info:  ', 'info', args);

exports.debug = (...args) =>
    writeLog(' debug: ', 'debug', args);

exports.warn = (...args) =>
    writeLog(' warn:  ', 'warn', args);

exports.error = (...args) =>
    writeLog(' error: ', 'error', args);

// 获取环境变量， 默认为开发环境
// debug 开启且非 test 环境下进行终端打印
const env          = process.env.NODE_ENV || 'development';
const consolePrint = config.debug && env !== 'test';

const writeLog = (prefix, logType, args) => {
    // debug 信息不需要记录日志
    let filePrint = logType !== 'debug';

    // 如果既不需要日志也不需要终端打印， 那就直接结束
    // 综上条件， 就是在非 test 环境下开启 debug 模式且输出的信息类型不是 debug 时
    if (!filePrint && !consolePrint) {
        return;
    }

    // 取传入的参数， 并连接起来
    // let infos = Array.prototype.slice.call(args);
    let logStr = args.join(' ');

    // 根据信息类型着色
    switch (logType) {
        case 'info':
            logStr = logStr.cyan;
            break;
        case 'debug':
            logStr = logStr.gray;
            break;
        case 'warn':
            logStr = logStr.yellow;
            break;
        case 'error':
            logStr = logStr.red;
            break;
    }

    // 获取时间， 并连接到输出字符串中
    // prefix = (new Date()).toUTCString() + prefix;
    let line = prefix + logStr;
    // 根据配置分别输出
    if (filePrint) {
        fs.appendFile('./log/' + env + '.log', line + '\n');
    }
    if (consolePrint) {
        console.log(line);
    }
};