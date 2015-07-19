var Resource = require('../proxy').Resource;
var EventProxy = require('eventproxy');

exports.ResourceList = function (req, res, next) {
    var pageSize = parseInt(req.query.pageSize);
    var pageRequest = parseInt(req.query.pageRequest);

    if (isNaN(pageSize) || isNaN(pageRequest)) {
        return res.json({ error: '请选择正确的页码！' });
    }

    var events = [ 'resourceList', 'resourceCount' ];
    var ep = EventProxy.create(events, function(resourceList, resourceCount) {
        var pageMax = Math.ceil(resourceCount / pageSize);

        if (!resourceList || !resourceList.length || pageMax < pageRequest) {
            return res.json({ error: '请选择正确的页码！' });
        }

        res.json({
            data: resourceList,
            page_count: pageMax
        });
    });

    ep.fail(next);

    Resource.getCount(ep.done('resourceCount'));
    Resource.getResources(pageSize, pageRequest, ep.done('resourceList'));
};