/**
 * Created by kelvinsun on 2016/4/18.
 */
'use strict';

const Style = require('../proxy/style');
const promiseWrap = require('../common/tool').promiseWrap;

exports.get = (req, res, next) => {
    let name = req.query.name;
    
    if ('string' !== typeof name || !name)  {
        res.jsonErrorParameterMissing('请传入样式名！');
        next();
        return;
    }

    new Promise(promiseWrap(Style.get, name)).
        then(result => {
            res.jsonSuccess(result);
            next();
        }).
        catch(err => {
            res.jsonErrorParameterWrong(err['message']);
            next();
        });
};

exports.post = (req, res, next) => {};

exports.put = (req, res, next) => {};

exports.delete = (req, res, next) => {};

exports.getAll = (req, res, next) => {};

exports.putAll = (req, res, next) => {};