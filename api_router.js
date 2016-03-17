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
// 引入 middleware
// let middlewareName = require('pathToMiddleware');
let config          = require('./config');

let router          = express.Router();

router.get('/ResourceList', resource.ResourceList);
router.get('/NewsCategory', news.NewsListCategory);
router.get('/NewsOutline', news.NewsListOutline);
router.get('/News', news.NewsGet);
router.get('/Struct', news.Struct);
router.get('/StyleCategory', news.StyleCategory);
router.get('/StyleOutline', news.StyleOutline);

module.exports = router;