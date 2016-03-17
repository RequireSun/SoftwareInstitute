var Resource = require('../proxy').Resource;
var EventProxy = require('eventproxy');

exports.ResourceList = function (req, res, next) {
    var pageSize = parseInt(req.query.pageSize);
    var pageRequest = parseInt(req.query.pageRequest);

    if (isNaN(pageSize) || isNaN(pageRequest)) {
        return res.json({
            code: 100,
            message: '页码格式错误！',
        });
    }

    var events = [ 'resourceList', 'resourceCount' ];
    var ep = EventProxy.create(events, function(resourceList, resourceCount) {
        var pageMax = Math.ceil(resourceCount / pageSize);

        if (!resourceList || !resourceList.length || pageMax < pageRequest) {
            return res.json({
                code: 101,
                message: '页码超出范围！',
            });
        }

        res.json({
            data: resourceList,
            count: pageMax
        });
    });

    ep.fail(next);

    Resource.getCount(ep.done('resourceCount'));
    Resource.getResources(pageSize, pageRequest, ep.done('resourceList'));
};