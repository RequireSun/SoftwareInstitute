'use strict';

let Resource = require('../proxy').Resource;
let promiseWrap = require('../common/tool').promiseWrap;

exports.ListGet = function (req, res, next) {
    let pageSize    = +req.query.pageSize;
    let pageRequest = +req.query.pageRequest;

    if (isNaN(pageSize) || isNaN(pageRequest)) {
        res.json({ code: 1001, message: '请选择正确的页码或页面大小！' });
        next();
        return;
    } else if (0 > pageSize || 0 > pageRequest) {
        res.json({ code: 1001, error: '页码和页面大小不能为负！' });
        next();
        return;
    }

    Promise.all([
        new Promise(promiseWrap(Resource.listGet, pageSize, pageRequest)),
        new Promise(promiseWrap(Resource.listCount)),
    ]).then(result => {
        let data    = result[0] || [],
            amount  = result[1];
        let count   = Math.ceil(amount / pageSize);

        res.json({
            data,
            count,
        });
        next();
    }).catch(err => {
        res.json({ code: 1001, error: err['message'] });
        next();
    });

    //let events = [ 'resourceList', 'resourceCount' ];
    //let ep = EventProxy.create(events, function(resourceList, resourceCount) {
    //    let pageMax = Math.ceil(resourceCount / pageSize);
    //
    //    if (!resourceList || !resourceList.length || pageMax < pageRequest) {
    //        return res.json({
    //            code: 101,
    //            message: '页码超出范围！',
    //        });
    //    }
    //
    //    res.json({
    //        data: resourceList,
    //        count: pageMax
    //    });
    //});
    //
    //ep.fail(next);
    //
    //Resource.getCount(ep.done('resourceCount'));
    //Resource.getResources(pageSize, pageRequest, ep.done('resourceList'));
};