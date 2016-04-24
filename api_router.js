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
let style           = require('./api/style');
let comment         = require('./api/comment');
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
router.get   ('/news', news.NewsGet);
router.post  ('/news', news.NewsPost);
router.put   ('/news', news.NewsPut);
router.delete('/news', news.NewsDelete);
// 新闻列表
router.get('/newsCategory', news.NewsCategory);
router.get('/newsOutline',  news.NewsOutline);
// 结构 - category
router.get   ('/category', struct.CategoryGet);
router.post  ('/category', struct.CategoryPost);
router.put   ('/category', struct.CategoryPut);
router.delete('/category', struct.CategoryDelete);
// 结构 - outline
router.get   ('/outline', struct.OutlineGet);
router.post  ('/outline', struct.OutlinePost);
router.put   ('/outline', struct.OutlinePut);
router.delete('/outline', struct.OutlineDelete);
// 结构列表
router.get('/categoryAll', struct.CategoryGetAll);
router.get('/outlineAll',  struct.OutlineGetAll);
// 结构全局
router.get('/struct', struct.StructGet);
router.put('/struct', struct.StructPut);
// 样式
router.get   ('/style', style.get);
router.post  ('/style', style.post);
router.put   ('/style', style.put);
router.delete('/style', style.delete);
// 样式全局
router.get('/styleAll', style.getAll);
router.put('/styleAll', style.putAll);
// 资源列表
router.get('/resourceList', resource.ListGet);

router.get   ('/comment', comment.get);
router.post  ('/comment', comment.post);
router.put   ('/comment', comment.put);
router.delete('/comment', comment.delete);

router.get('/commentAll', comment.getAll);

router.get('/validate', supervisor.ValidateGet);
router.get('/login', supervisor.LoginGet);

// router.get('/pValidate', power.validate);

module.exports = router;