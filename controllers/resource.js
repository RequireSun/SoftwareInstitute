var Resource = require('../proxy').Resource;
// var validator = require('validator');

// 资源视图
exports.index = function (req, res, next) {
    // var referer = req.get('referer');
    var pageSize = parseInt(req.query.pageSize);
    var pageRequest = parseInt(req.query.pageRequest);
    if (isNaN(pageSize) || isNaN(pageRequest)) {
        res.render404('请选择正确的页码！');
        return;
    }
    Resource.getResources(pageSize, pageRequest, function (err, data) {
        if (err) {
            return next(err);
        } else if (!data) {
            res.render404('请选择正确的页码！');
            return;
        }
        res.render('resource/index', { resources: data });
    });
};