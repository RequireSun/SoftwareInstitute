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
        var pageMax = Math.ceil(newsCount / pageSize);

        if (!newsList || !newsList.length) {
            return res.json({ error: '请选择正确的页码和新闻类型！' });
        }

        res.json({ 
            data: newsList,
            page_count: newsCount
        });
    });

    ep.fail(next);

    News.getNewsCategory(pageSize, pageRequest, categoryId, ep.done('newsList'));
    News.getCount(categoryId, ep.done('newsCount'));
};