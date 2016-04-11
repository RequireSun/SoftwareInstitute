/**
 * Created by kelvinsun on 2016/4/6.
 */
'use strict';

let Struct = require('../proxy').Struct;
let promiseWrap = require('../common/tool').promiseWrap;

exports.CategoryGet = (req, res, next) => {
    let id = +req.query.id;

    if (isNaN(id)) {
        res.jsonErrorParameterMissing('请输入正确的类别编号！');
        next();
        return;
    }

    new Promise(promiseWrap(Struct.categoryGet, id)).
    then(data => {
        if (!data) {
            res.jsonErrorParameterWrong('请输入正确的类别编号！');
            next();
        } else {
            res.jsonSuccess(data);
            next();
        }
    }).catch(err => {
        res.jsonErrorParameterWrong(err['message']);
        next();
    });
};

exports.OutlineGet = (req, res, next) => {
    let id = +req.query.id;

    if (isNaN(id)) {
        res.jsonErrorParameterMissing('请输入正确的类别编号！');
        next();
        return;
    }

    new Promise(promiseWrap(Struct.outlineGet, id)).
        then(data => {
            if (!data) {
                res.jsonErrorParameterWrong('请输入正确的类别编号！');
                next();
            } else {
                res.jsonSuccess(data);
                next();
            }
        }).catch(err => {
            res.jsonErrorParameterWrong(err['message']);
            next();
        });
};

exports.StructGet = (req, res, next) => {
    new Promise(promiseWrap(Struct.get)).
        then(data => {
            if (!data) {
                res.jsonErrorParameterWrong('没有数据！');
                next();
            } else {
                res.jsonSuccess(data);
                next();
            }
        }).catch(err => {
            res.jsonErrorParameterWrong(err['message']);
            next();
        });
};