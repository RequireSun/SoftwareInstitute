'use strict';

let News = require('../proxy').News;
let pmcbk = require('../common/tool').promiseCallback;
let pmw = require('../common/tool').promiseWrap;
//let EventProxy = require('eventproxy');
// 根据小类别获取新闻列表
exports.NewsCategory = function (req, res, next) {
    var pageSize    = parseInt(req.query.pageSize);
    var pageRequest = parseInt(req.query.pageRequest);
    var categoryId  = parseInt(req.query.categoryId);
    
    if (isNaN(pageSize) || isNaN(pageRequest)) {
        return res.json({ error: '请选择正确的页码或页面大小！' });
    } else if (isNaN(categoryId)) {
        return res.json({ error: '请选择正确的新闻类型！' });
    }

    //console.log(pageSize, pageRequest, categoryId);
    //console.log(pmw(News.category, categoryId, pageSize, pageRequest).toString());

    Promise.all([
        new Promise((resolve, reject) => {
            News.category((err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            }, categoryId, pageSize, pageRequest);
        }),
        new Promise((resolve, reject) => {
            News.categoryCount((err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            }, categoryId);
        })
        //new Promise(pmw(News.category, categoryId, pageSize, pageRequest)),
        //new Promise(pmw(News.categoryCount, categoryId)),
        // es6 type
    //]).then(([newsList, newsCount]) => {
    ]).then((result) => {
        let newsList    = result[0],
            newsCount   = result[1];
        let pageMax     = Math.ceil(newsCount / pageSize);

        if (!newsList || !newsList.length || pageMax < pageRequest) {
            return res.json({ error: '请选择正确的页码和新闻类型！' });
        }

        res.json({
            data    : newsList,
            count   : pageMax
        });
        next();
    }).catch(next);

    //var events = ['newsList', 'newsCount'];
    //var ep = EventProxy.create(events, function (newsList, newsCount) {
    //    var pageMax = Math.ceil(newsCount / pageSize);
    //
    //    if (!newsList || !newsList.length || pageMax < pageRequest) {
    //        return res.json({ error: '请选择正确的页码和新闻类型！' });
    //    }
    //
    //    res.json({
    //        data: newsList,
    //        count: pageMax
    //    });
    //    next();
    //});
    //
    //ep.fail(next);
    //
    //News.getNewsCategory(pageSize, pageRequest, categoryId, ep.done('newsList'));
    //News.getCountCategory(categoryId, ep.done('newsCount'));
};
// 根据大类别获取新闻列表
exports.NewsOutline = function (req, res, next) {
    var pageSize = parseInt(req.query.pageSize);
    var pageRequest = parseInt(req.query.pageRequest);
    var outlineId = parseInt(req.query.outlineId);

    if (isNaN(pageSize) || isNaN(pageRequest)) {
        return res.json({ error: '请选择正确的页码！' });
    } else if (isNaN(outlineId)) {
        return res.json({ error: '请选择正确的新闻类型！' });
    }

    var events = [ 'newsList', 'newsCount'];
    var ep = EventProxy.create(events, function (newsList, newsCount) {
        var pageMax = Math.ceil(newsCount / pageSize);

        if (!newsList || !newsList.length || pageMax < pageRequest) {
            return res.json({ error: '请选择正确的页码和新闻类型！' });
        }

        res.json({
            data: newsList,
            count: pageMax
        });
        next();
    });

    ep.fail(next);

    News.getNewsOutline(pageSize, pageRequest, outlineId, ep.done('newsList'));
    News.getCountOutline(outlineId, ep.done('newsCount'));
};
// 获取新闻详情
exports.NewsGet = function (req, res, next) {
    var newsId = parseInt(req.query.id);

    if (isNaN(newsId)) {
        return res.json({ error: '请输入正确的新闻编号！' });
    }

    var events = [ 'newsDetail', 'updatePageView'];
    var ep = EventProxy.create(events, function (newsDetail, updatePageView) {
        if (!newsDetail) {
            return res.json({ error: '请输入正确的新闻编号！' });
        }

        res.json({
            id: newsId,
            title: newsDetail.title,
            supervisor_name: newsDetail.alias,
            article: newsDetail.article,
            update_time: newsDetail.update_time,
            page_view: newsDetail.page_view
        });
        next();
    });

    ep.fail(next);

    News.getNewsDetail(newsId, ep.done('newsDetail'));
    News.updateNewsPageView(newsId, ep.done('updatePageView'));
};
// 获取大小类间的关系
exports.Struct = function (req, res, next) {
    News.getOutlineCategory(function (err, result) {
        if (err) {
            return next(err);
        }
        res.json(result);
        next();
    });
};
// 样式内填充数据 (导航栏, 快捷入口, 脚) 获取
exports.StyleCategory = function (req, res, next) {
    var categoryType = req.query.categoryType;

    if ('string' !== typeof categoryType || 0 === categoryType.length) {
        return res.json({ error: '请输入正确的样式类型！' });
    }

    News.getStyleCategory(categoryType, function (err, result) {
        if (err) {
            return next(err);
        }
        res.json(result);
        next();
    })
};
// 样式内填充数据 (导航栏, 快捷入口, 脚) 获取
exports.StyleOutline = function (req, res, next) {
    var outlineType = req.query.outlineType;

    if ('string' !== typeof outlineType || 0 === outlineType.length) {
        return res.json({ error: '请输入正确的样式类型！' });
    }

    News.getStyleOutline(outlineType, function (err, result) {
        if (err) {
            return next(err);
        }
        res.json(result);
        next();
    })
};