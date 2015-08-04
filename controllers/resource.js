var Resource = require('../proxy').Resource;
var EventProxy = require('eventproxy');
var tool = require('../common/tool');
// var validator = require('validator');

// 资源视图
exports.index = function (req, res, next) {
    // var referer = req.get('referer');
    var pageSize = parseInt(req.query.pageSize);
    var pageRequest = parseInt(req.query.pageRequest);
    
    if (isNaN(pageSize) || isNaN(pageRequest)) {
        res.render404('请选择正确的页码！');
        return next();
    }

    var events = [ 'resourceList', 'resourceCount' ];
    var ep = EventProxy.create(events, function(resourceList, resourceCount) {
        var pageMax = Math.ceil(resourceCount / pageSize),
            pageList;

        if (!resourceList || !resourceList.length || pageMax < pageRequest) {
            res.render404('请选择正确的页码！');
            return next();
        }

        pageList = tool.generatePageNumber(pageRequest, pageMax, 'resource?pageSize=' + pageSize + '&pageRequest=');

        res.render('resource/index', { 
            resources: resourceList, 
            pageList: pageList, 
            pageCurrent: pageRequest, 
            pageMax: pageMax,
            pageFirst: 'resource?pageSize=' + pageSize + '&pageRequest=1',
            pageLast: 'resource?pageSize=' + pageSize + '&pageRequest=' + pageMax
        });
        next();
    });

    ep.fail(next);

    Resource.getCount(ep.done('resourceCount'));
    Resource.getResources(pageSize, pageRequest, ep.done('resourceList'));
};