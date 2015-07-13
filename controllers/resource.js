var Resource = require('../proxy').Resource;

// 资源视图
exports.index = function (req, res, next) {
    // var referer = req.get('referer');
    if ('number' !== typeof req.param.pageSize || 'number' !== typeof req.param.pageRequest) {
        res.render404('请选择正确的页码！');
        return;
    }
    Resource.getResources(req.param.pageSize, req.param.pageRequest, function (err, data) {
        if (err) {
            return next(err);
        } else if (!data) {
            res.render404('请选择正确的页码！');
            return;
        }
        res.render('resource/index', { resources: data });
    });
};