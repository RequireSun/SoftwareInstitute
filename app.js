/*!
 * softwareinstitute - app.js
 */

/*
 * Module dependencies.
 */

var config = require('./config');

// sign 部署的时候记得用 newrelic 性能检测（配置文件里还有相应配置）
// if (!config.debug) {
//     require('newrelic');
// }

// sign 一个漂亮的 css 颜色库，暂时用不着
// require('colors');

var path        = require('path');
var Loader      = require('loader');