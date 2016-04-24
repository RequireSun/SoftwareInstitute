'use strict';
let config = require('../config');

exports.hasOwnProperty = function (target) {
    let args = Array.prototype.slice.call(arguments, 1);
    return Object.prototype.hasOwnProperty.apply(target, args);
};

exports.toString = target => Object.prototype.toString.call(target);

exports.generatePageNumber = function (pageCurrent, pageMax, pageLink) {
    var numberList = [];
    // 填充页码， 取剩余页面数量和页面跳转限额中较小的一个， 作为页码个数， 循环填充
    for (let i = Math.min(pageCurrent - 1, config.page_jump_size); i > 0; --i) {
        numberList.push(pageCurrent - i);
    }
    numberList.push(pageCurrent);
    for (let i = 1; i <= Math.min(pageMax - pageCurrent, config.page_jump_size); ++i) {
        numberList.push(pageCurrent + i);
    }

    return numberList.map(function (value) {
        var numberItem = {};
        numberItem.text = value;
        numberItem.link = pageLink + value;
        return numberItem;
    });
};

exports.formatDateTime = (dateString) => +new Date(dateString);

exports.formatDateTimeArray = (dataArray, keyName) =>
    dataArray.map(item =>
        Object.assign({}, item, { [keyName]: exports.formatDateTime(item[keyName]) })
    );

exports.formatInsertParameters = (params, nameMap) => {
    let queryArrayDeclare = [],
        queryArrayValue   = [],
        processedParams   = {};
    for (let i in params) {
        if (exports.hasOwnProperty(params, i) && exports.hasOwnProperty(nameMap, i)) {
            queryArrayDeclare.push(nameMap[i]);
            queryArrayValue.push(i);
            processedParams[i] = params[i];
        }
    }

    return { queryArrayDeclare, queryArrayValue, processedParams };
};

exports.formatUpdateParameters = (params, nameMap) => {
    let queryArray = [],
        processedParams = {};
    for (let i in params) {
        if (exports.hasOwnProperty(params, i) && exports.hasOwnProperty(nameMap, i)) {
            queryArray.push(nameMap[i] + ' = :' + i);
            processedParams[i] = params[i];
        }
    }

    return { queryArray, processedParams };
};
// 我日了 node 的 es6 兼容, 给箭头函数不给 rest parameters, 我怎么获取参数
exports.promiseWrap = function (func) {
    let args = Array.prototype.slice.call(arguments, 1);
    return (resolve, reject) => func((err, data) => err ? reject(err) : resolve(data), ...args);
};

exports.promiseWrapTail = function (func) {
    let args = Array.prototype.slice.call(arguments, 1);
    return (resolve, reject) => func(...args, (err, data) => err ? reject(err): resolve(data));
};
// es6 type
//exports.promiseWrap = (func, ...args) => (resolve, reject) => func(((err, data) => err ? reject(err) : resolve(data)), ...args);