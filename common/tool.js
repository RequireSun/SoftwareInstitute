'use strict';
let config = require('../config');

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

exports.promiseCallback = (resolve, reject) => {
    return (err, data) => err ? reject(err) : resolve(data);
};
// 我日了 node 的 es6 兼容, 给箭头函数不给 rest parameters, 我怎么获取参数
exports.promiseWrap = function (func) {
    let args = Array.prototype.slice.call(arguments, 1);
    return (resolve, reject) => func((err, data) => err ? reject(err) : resolve(data), ...args);
};
// es6 type
//exports.promiseWrap = (func, ...args) => (resolve, reject) => func(((err, data) => err ? reject(err) : resolve(data)), ...args);