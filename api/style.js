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

    return new Promise(promiseWrap(Style.get, name)).
        then(result => {
            res.jsonSuccess(result);
            next();
        }).
        catch(err => {
            res.jsonErrorParameterWrong(err['message']);
            next();
        });
};

exports.post = (req, res, next) => {
    let name  = req.query.name,
        style = req.body.style;

    if (!name || 'string' !== typeof name || !style || ('object' !== typeof style && 'string' !== typeof style)) {
        res.jsonErrorParameterMissing('请传入格式名和样式内容');
        next();
        return;
    }

    if ('string' === typeof style) {
        try {
            style = JSON.parse(style);
        } catch (err) {
            res.jsonErrorParameterWrong('传入的样式 json 格式错误！');
            next();
            return;
        }
    }

    if (!Array.isArray(style)) {
        res.jsonErrorParameterWrong('传入的样式 json 必须为数组！');
        next();
        return;
    }

    return new Promise(promiseWrap(Style.post, name, style)).
        then(() => {
            res.jsonSuccess(name);
            next();
        }).
        catch(err => {
            res.jsonErrorParameterWrong(err['message']);
            next();
        });
};

exports.put = (req, res, next) => {};

exports.delete = (req, res, next) => {};

exports.getAll = (req, res, next) => {
    return new Promise(promiseWrap(Style.getAll)).
        then(result => {
            res.jsonSuccess(result);
            next();
        }).
        catch(err => {
            res.jsonErrorParameterWrong(err['message']);
            next();
        });
};

exports.putAll = (req, res, next) => {};