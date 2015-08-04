var News = require('../proxy').News;
var EventProxy = require('eventproxy');

exports.NewsListCategory = function (req, res, next) {
    var pageSize = parseInt(req.query.pageSize);
    var pageRequest = parseInt(req.query.pageRequest);
    var categoryId = parseInt(req.query.categoryId);
    
    if (isNaN(pageSize) || isNaN(pageRequest)) {
        return res.json({ error: '请选择正确的页码！' });
    } else if (isNaN(categoryId)) {
        return res.json({ error: '请选择正确的新闻类型！' });
    }

    var events = [ 'newsList', 'newsCount'];
    var ep = EventProxy.create(events, function (newsList, newsCount) {
        if (!newsList || !newsList.length) {
            return res.json({ error: '请选择正确的页码和新闻类型！' });
        }

        res.json({ 
            data: newsList,
            count: newsCount
        });
        next();
    });

    ep.fail(next);

    News.getNewsCategory(pageSize, pageRequest, categoryId, ep.done('newsList'));
    News.getCountCategory(categoryId, ep.done('newsCount'));
};

exports.NewsListOutline = function (req, res, next) {
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
        if (!newsList || !newsList.length) {
            return res.json({ error: '请选择正确的页码和新闻类型！' });
        }

        res.json({
            data: newsList,
            count: newsCount
        });
        next();
    });

    ep.fail(next);

    News.getNewsOutline(pageSize, pageRequest, outlineId, ep.done('newsList'));
    News.getCountOutline(outlineId, ep.done('newsCount'));
};

exports.NewsDetail = function (req, res, next) {
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

exports.OutlineCategory = function (req, res, next) {
    News.getOutlineCategory(function (err, result) {
        if (err) {
            return next(err);
        }
        res.json(result);
        next();
    });
};