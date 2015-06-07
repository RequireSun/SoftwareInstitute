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

////////// 引入类库 开始 //////////

// sign 一个漂亮的 css 颜色库，暂时用不着
// require('colors');
var path        = require('path');
// 一个用来压缩、加载 css 的插件
var Loader      = require('loader');
var express     = require('express');
var session     = require('express-session');
// 用来验证登陆
var passport    = require('passport');

////////// 引入类库 结束 //////////


////////// 引入自定 model 开始 //////////

require('./models');

var webRouter   = require('./web_router');
var apiRouter   = require('./api_router');

////////// 引入自定 model 结束 //////////


////////// 引入中间件 开始 //////////

// redis session 管理
var RedisStore      = require('connect-redis')(session);
// lodash 常用函数库
var _               = require('lodash');
// 验证用的模块，必须在 session 模块之后引用
var csurf           = require('csurf');
// http 压缩用的模块（deflate，gzip）
var compression     = require('compression');
// 用于解析请求体
var bodyParser      = require('body-parser');
// 用于大文件上传
var busboy          = require('connect-busboy');
// 用于在开发环境下打印错误信息
var errorhandler    = require('errorhandler');
// 用于支持 CORS 跨域
var cors            = require('cors');

var logger          = require('./common/logger');

////////// 引入中间件 结束 //////////
