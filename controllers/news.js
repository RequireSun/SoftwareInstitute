var News = require('../proxy').News;
var EventProxy = require('eventproxy');
var tool = require('../common/tool');

// 新闻视图
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
        pageList = tool.generatePageNumber(pageRequest, pageMax, 'news?pageSize=' + pageSize + '&categoryId=' + categoryId + '&pageRequest=');

        res.render('news/index', { 
            news: newsList, 
            pageList: pageList, 
            pageCurrent: pageRequest, 
            pageMax: pageMax,
            pageFirst: 'news?pageSize=' + pageSize + '&categoryId=' + categoryId + '&pageRequest=1',
            pageLast: 'news?pageSize=' + pageSize + '&categoryId=' + categoryId + '&pageRequest=' + pageMax
        });
    });

    ep.fail(next);

    News.getNewsCategory(pageSize, pageRequest, categoryId, ep.done('newsList'));
    News.getCount(categoryId, ep.done('newsCount'));
}