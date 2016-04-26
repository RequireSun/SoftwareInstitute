'use strict';

var _ = require('lodash');
var config = require('../config');

// TODO 还有 markdown 相关的部分没有加入进来

// 将换行转换为 <br />
exports.escapeWrap = function (content) {
  return content.split('\n').map(function (p) {
    return _.escape(p);
  }).join('<br>');
};

// 转换静态文件路径
exports.staticFile = function (filePath) {
    if (0 === filePath.indexOf('http') || 0 === filePath.indexOf('//')) {
        return filePath;
    }
    // TODO 如果以后用云存储的话，需要把这里换成注释掉的内容， 并在设置中设置运存储地址
    // return config.site_static_host + filePath;
    return filePath;
};

// 在配置中的选项卡选项中选择出入参数对应的名字
exports.tabName = function (tab) {
  var pair = _.find(config.tabs, function (pair) {
    return pair[0] === tab;
  });
  if (pair) {
    return pair[1];
  }
};

// 一个代理访问网站用的方法
// TODO 还没做
exports.proxy = function (url) {
  return '"/agent?&url=' + encodeURIComponent(url) + '"';
};

exports._ = _;