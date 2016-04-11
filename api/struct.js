/**
 * Created by kelvinsun on 2016/4/6.
 */
'use strict';

let Struct = require('../proxy').Struct;
let promiseWrap = require('../common/tool').promiseWrap;

exports.CategoryGet = (req, res, next) => {
    let id = +req.query.id;

    if (isNaN(id)) {
        res.json({ code: 1001, error: '请输入正确的类别编号！' });
        next();
        return;
    }

    new Promise(promiseWrap(Struct.categoryGet, id)).
    then(data => {
        if (!data) {
            res.json({ code: 1001, error: '请输入正确的类别编号！' });
            next();
            return;
        }

        res.json(data);
        next();
    }).catch(err => {
        res.json({ code: 1001, error: err['message'] });
        next();
    });
};

exports.OutlineGet = (req, res, next) => {
    let id = +req.query.id;

    if (isNaN(id)) {
        res.json({ code: 1001, error: '请输入正确的类别编号！' });
        next();
        return;
    }

    new Promise(promiseWrap(Struct.outlineGet, id)).
        then(data => {
            if (!data) {
                res.json({ code: 1001, error: '请输入正确的类别编号！' });
                next();
                return;
            }

            res.json(data);
            next();
        }).catch(err => {
            res.json({ code: 1001, error: err['message'] });
            next();
        });
};