/*!
 * softwareinstitute - web_router.js
 */

/**
 * Module dependencies.
 */

var express         = require('express');
//var passport        = require('passport');
// 引入各个 controller
var resource        = require('./controllers/resource');
var news            = require('./controllers/news');
// 引入各个 middleware
// var middlewareName  = require('pathToMiddleware');
// 引入 middleware 配置
// var configMiddleware = require('pathToConfigOfMiddleware');
var config          = require('./config');

var router          = express.Router();

router.get('/resource', resource.index);
router.get('/category', news.category);

module.exports = router;