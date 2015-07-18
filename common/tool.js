var config = require('../config');

exports.generatePageNumber = function (pageCurrent, pageMax, pageLink) {
    var numberList = [];
    // 填充页码， 取剩余页面数量和页面跳转限额中较小的一个， 作为页码个数， 循环填充
    for (var i = Math.min(pageCurrent - 1, config.page_jump_size); i > 0; --i) {
        numberList.push(pageCurrent - i);
    }
    numberList.push(pageCurrent);
    for (var i = 1; i <= Math.min(pageMax - pageCurrent, config.page_jump_size); ++i) {
        numberList.push(pageCurrent + i);
    }

    return numberList.map(function (value) {
        var numberItem = {};
        numberItem.text = value;
        numberItem.link = pageLink + value;
        return numberItem;
    });
}