var News = require('../proxy').News;
var EventProxy = require('eventproxy');
var tool = require('../common/tool');

// 新闻分类视图
exports.category = function (req, res, next) {
    var pageSize = parseInt(req.query.pageSize);
    var pageRequest = parseInt(req.query.pageRequest);
    var categoryId = parseInt(req.query.categoryId);
    
    if (isNaN(pageSize) || isNaN(pageRequest)) {
        return res.render404('请选择正确的页码！');
    } else if (isNaN(categoryId)) {
        return res.render404('请选择正确的新闻类型！');
    }

    var events = [ 'newsList', 'newsCount'];
    var ep = EventProxy.create(events, function (newsList, newsCount) {
        var pageMax = Math.ceil(newsCount / pageSize),
            pageList = [];

        if (!newsList || !newsList.length) {
            return res.render404('请选择正确的页码和新闻类型！');
        }

        newsList = newsList.map(function (value) {
            value.link = 'newsDetail?id=' + value.id;
            return value;
        });
        pageList = tool.generatePageNumber(pageRequest, pageMax, 'category?pageSize=' + pageSize + '&categoryId=' + categoryId + '&pageRequest=');

        res.render('news/index', { 
            news: newsList, 
            pageList: pageList, 
            pageCurrent: pageRequest, 
            pageMax: pageMax,
            pageFirst: 'category?pageSize=' + pageSize + '&categoryId=' + categoryId + '&pageRequest=1',
            pageLast: 'category?pageSize=' + pageSize + '&categoryId=' + categoryId + '&pageRequest=' + pageMax
        });
    });

    ep.fail(next);

    News.getNewsCategory(pageSize, pageRequest, categoryId, ep.done('newsList'));
    News.getCountCategory(categoryId, ep.done('newsCount'));
};

// 新闻大纲视图
exports.outline = function (req, res, next) {
    var pageSize = parseInt(req.query.pageSize);
    var pageRequest = parseInt(req.query.pageRequest);
    var outlineId = parseInt(req.query.outlineId);

    if (isNaN(pageSize) || isNaN(pageRequest)) {
        return res.render404('请选择正确的页码！');
    } else if (isNaN(outlineId)) {
        return res.render404('请选择正确的新闻类型！');
    }

    var events = [ 'newsList', 'newsCount'];
    var ep = EventProxy.create(events, function (newsList, newsCount) {
        var pageMax = Math.ceil(newsCount / pageSize),
            pageList = [];

        if (!newsList || !newsList.length) {
            return res.render404('请选择正确的页码和新闻类型！');
        }

        newsList = newsList.map(function (value) {
            value.link = 'newsDetail?id=' + value.id;
            return value;
        });
        pageList = tool.generatePageNumber(pageRequest, pageMax, 'outline?pageSize=' + pageSize + '&outlineId=' + outlineId + '&pageRequest=');


        res.render('news/index', {
            news: newsList,
            pageList: pageList,
            pageCurrent: pageRequest,
            pageMax: pageMax,
            pageFirst: 'outline?pageSize=' + pageSize + '&outlineId=' + outlineId + '&pageRequest=1',
            pageLast: 'outline?pageSize=' + pageSize + '&outlineId=' + outlineId + '&pageRequest=' + pageMax
        });
    });

    ep.fail(next);

    News.getNewsOutline(pageSize, pageRequest, outlineId, ep.done('newsList'));
    News.getCountOutline(outlineId, ep.done('newsCount'));
};