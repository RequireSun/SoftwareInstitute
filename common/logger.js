var fs      = require('fs');
var config  = require('../config');

// 若无日志目录，则创建日志目录
if (!fs.existsSync('./log')) {
    fs.mkdirSync('./log');
}

exports.log = function () {
    writeLog(' log:   ', 'info', arguments);
};

exports.info = function () {
    writeLog(' info:  ', 'info', arguments);
};

exports.debug = function () {
    writeLog(' debug: ', 'debug', arguments);
};

exports.warn = function () {
    writeLog(' warn:  ', 'warn', arguments);
};

exports.error = function () {
    writeLog(' error: ', 'error', arguments);
}

var env = process.env.NODE_ENV || 'development';
var consolePrint = config.debug && env !== 'test';

var writeLog = function (prefix, logType, args) {
    var filePrint = logType !== 'debug';

    if (!filePrint && !consolePrint) {
        return;
    }

    var infos = Array.prototype.slice.call(args);
    var logStr = infos.join(' ');

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

    prefix = (new Date()).toUTCString() + prefix;
    var line = prefix + logStr;
    if (filePrint) {
        fs.appendFile('./log/' + env + '.log', line + '\n');
    }
    if (consolePrint) {
        console.log(line);
    }
};