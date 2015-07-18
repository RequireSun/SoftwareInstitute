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
        return res.render404('请选择正确的页码！');
    }

    var events = [ 'resourceList', 'resourceCount' ];
    var ep = EventProxy.create(events, function(resourceList, resourceCount) {
        var pageMax = Math.ceil(resourceCount / pageSize),
            pageList = [];

        if (!resourceList || !resourceList.length || pageMax < pageRequest) {
            return res.render404('请选择正确的页码！');
        }

        pageList = tool.generatePageNumber(pageRequest, pageMax, 'resource?pageSize=' + pageSize + '&pageRequest=');

        return res.render('resource/index', { 
            resources: resourceList, 
            pageList: pageList, 
            pageCurrent: pageRequest, 
            pageMax: pageMax,
            pageFirst: 'resource?pageSize=' + pageSize + '&pageRequest=1',
            pageLast: 'resource?pageSize=' + pageSize + '&pageRequest=' + pageMax
        });
    });

    ep.fail(next);

    Resource.getCount(ep.done('resourceCount'));
    Resource.getResources(pageSize, pageRequest, ep.done('resourceList'));
};