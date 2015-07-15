var News = require('../proxy').News;

// 新闻视图
exports.category = function (req, res, next) {
    var pageSize = parseInt(req.query.pageSize);
    var pageRequest = parseInt(req.query.pageRequest);
    var categoryId = parseInt(req.query.categoryId);
    
    if (isNaN(pageSize) || isNaN(pageRequest)) {
        res.render404('请选择正确的页码！');
    } else if (isNaN(categoryId)) {
        res.render404('请选择正确的新闻类型！');
    }

    News.getNewsCategory(pageSize, pageRequest, categoryId, function (err, data) {
        if (err) {
            return next(err);
        } else if (!data || !data.length) {
            res.render404('请选择正确的页码和新闻类型！');
            return;
        }
        res.render('news/index', { news: data });
    });
}