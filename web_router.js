/*!
 * softwareinstitute - web_router.js
 */

/**
 * Module dependencies.
 */
'use strict';

const express         = require('express');
//let passport        = require('passport');
// 引入各个 controller
// let resource        = require('./controllers/resource');
// let news            = require('./controllers/news');
// let supervisor      = require('./controllers/supervisor');
const singlePage = require('./controllers/singlePage');
// 引入各个 middleware
// let middlewareName  = require('pathToMiddleware');
// 引入 middleware 配置
// let configMiddleware = require('pathToConfigOfMiddleware');
let config          = require('./config');

let router          = express.Router();

// router.get('/resource', resource.index);
// router.get('/category', news.category);
// router.get('/outline', news.outline);
// router.get('/newsDetail', news.newsDetail);
//
// router.get('/login', supervisor.login);
// router.post('/validate', supervisor.validate);

router.get('/index', singlePage);

module.exports = router;