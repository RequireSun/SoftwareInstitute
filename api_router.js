/*!
 * softwareinstitute - api_router.js
 */

/**
 * Module dependencies.
 */

var express         = require('express');
// 引入 api
var resource        = require('./api/resource');
var news            = require('./api/news');
// 引入 middleware
// var middlewareName = require('pathToMiddleware');
var config          = require('./config');

var router          = express.Router();

router.get('/ResourceList', resource.ResourceList);
router.get('/NewsListCategory', news.NewsListCategory);
router.get('/NewsListOutline', news.NewsListOutline);
router.get('/OutlineCategory', news.OutlineCategory);
router.get('/NavigatorCategory', news.NavigatorCategory);
router.get('/StyleCategory', news.StyleCategory);

module.exports = router;