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
let supervisor      = require('./api/supervisor');
let power           = require('./api/power');
// 引入 middleware
// let middlewareName = require('pathToMiddleware');
let config          = require('./config');
let whiteList       = require('./whiteList') || {};
let hasOwnProperty  = require('./common/tool').hasOwnProperty;

let router          = express.Router();

for (let path in whiteList) {
    if (hasOwnProperty(whiteList, path)) {
        for (let method in whiteList[path]) {
            if (hasOwnProperty(whiteList[path], method) && whiteList[path][method]) {
                router[method](['/' + path], power.validate);
            }
        }
    }
}

// 单条新闻
router.get('/news', news.NewsGet);
router.post('/news', news.NewsPost);
router.put('/news');
router.delete('/news');

router.get('/category', struct.CategoryGet);
router.post('/category');
router.put('/category');
router.delete('/category');

router.get('/outline', struct.OutlineGet);
router.post('/outline');
router.put('/outline');
router.delete('/outline');

router.get('/struct', struct.StructGet);
router.put('/struct');

router.get('/newsCategory', news.NewsCategory);

router.get('/newsOutline', news.NewsOutline);

router.get('/resourceList', resource.ListGet);

router.get('/validate', supervisor.ValidateGet);
router.get('/login', supervisor.LoginGet);

// router.get('/pValidate', power.validate);

//router.get('/ResourceList', resource.ResourceList);
//router.get('/NewsCategory', news.NewsListCategory);
//router.get('/NewsOutline', news.NewsListOutline);
//router.get('/News', news.NewsGet);
//router.get('/Struct', news.Struct);
//router.get('/StyleCategory', news.StyleCategory);
//router.get('/StyleOutline', news.StyleOutline);

module.exports = router;