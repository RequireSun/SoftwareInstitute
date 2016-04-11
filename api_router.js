/*!
 * softwareinstitute - api_router.js
 */

/**
 * Module dependencies.
 */
'use strict';

let express         = require('express');
// 引入 api
let resource        = require('./api/resource');
let news            = require('./api/news');
let struct          = require('./api/struct');
// 引入 middleware
// let middlewareName = require('pathToMiddleware');
let config          = require('./config');

let router          = express.Router();

// 单条新闻
router.get('/news', news.NewsGet);
router.post('/news');
router.put('/news');
router.delete('/news');

router.get('/category', struct.CategoryGet);
router.post('/category');
router.put('/category');
router.delete('/category');

router.get('/outline');
router.post('/outline');
router.put('/outline');
router.delete('/outline');

router.get('/struct');
router.put('/struct');

router.get('/newsCategory', news.NewsCategory);

router.get('/newsOutline', news.NewsOutline);

//router.get('/ResourceList', resource.ResourceList);
//router.get('/NewsCategory', news.NewsListCategory);
//router.get('/NewsOutline', news.NewsListOutline);
//router.get('/News', news.NewsGet);
//router.get('/Struct', news.Struct);
//router.get('/StyleCategory', news.StyleCategory);
//router.get('/StyleOutline', news.StyleOutline);

module.exports = router;