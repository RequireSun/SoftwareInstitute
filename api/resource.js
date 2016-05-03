'use strict';

let Resource = require('../proxy').Resource;
let promiseWrap = require('../common/tool').promiseWrap;

exports.ListGet = function (req, res, next) {
    let pageSize    = +req.query.pageSize;
    let pageRequest = +req.query.pageRequest;

    if (isNaN(pageSize) || isNaN(pageRequest)) {
        res.jsonErrorParameterWrong('请选择正确的页码或页面大小！');
        next();
        return;
    } else if (0 > pageSize || 0 > pageRequest) {
        res.jsonErrorParameterWrong('页码和页面大小不能为负！');
        next();
        return;
    }

    Promise.all([
        new Promise(promiseWrap(Resource.listGet, pageSize, pageRequest)),
        new Promise(promiseWrap(Resource.listCount)),
    ]).then(result => {
        let list    = result[0] || [],
            amount  = result[1];
        let count   = Math.ceil(amount / pageSize);

        res.jsonSuccess({
            list,
            count,
        });
        next();
    }).catch(err => {
        res.jsonErrorParameterWrong(err['message']);
        next();
    });
};