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

    return new Promise(promiseWrap(Struct.categoryGet, id)).
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

exports.CategoryPost = (req, res, next) => {
    let name        = req.body.name,
        outlineId   = +req.body.outlineId;

    if (isNaN(outlineId)) {
        res.jsonErrorParameterMissing('请输入正确的分类编号！');
        next();
        return;
    } else if (!name) {
        res.jsonErrorParameterMissing('请输入正确的分类名称！');
        next();
        return;
    }

    return new Promise(promiseWrap(Struct.categoryPost, { name, outlineId })).
        then(result => {
            res.jsonSuccess(result);
            next();
        }).
        catch(err => {
            res.jsonErrorParameterWrong(err['message']);
            next();
        });
};

exports.CategoryPut = (req, res, next) => {
    let id          = +req.query.id,
        name        = req.body.name,
        outlineId   = +req.body.outlineId;

    if (isNaN(+id)) {
        res.jsonErrorParameterMissing('请输入正确的小分类编号！');
        next();
        return;
    } else if (undefined !== outlineId && isNaN(outlineId)) {
        res.jsonErrorParameterMissing('请输入正确的分类编号！');
        next();
        return;
    } else if (undefined !== name && !name) {
        res.jsonErrorParameterMissing('请输入正确的分类名称！');
        next();
        return;
    }

    let detail = {};
    name        && (detail['name']      = name);
    outlineId   && (detail['outlineId'] = outlineId);

    new Promise(promiseWrap(Struct.categoryPut, +id, detail)).
        then(result => {
            res.jsonSuccess(result);
            next();
        }).
        catch(err => {
            res.jsonErrorParameterWrong(err['message']);
            next();
        });
};

exports.CategoryDelete = (req, res, next) => {
    let id = +req.query.id;

    if (isNaN(id)) {
        res.jsonErrorParameterMissing('请输入数字 id！');
        next();
        return;
    }

    new Promise(promiseWrap(Struct.categoryDelete, id)).
        then(result => {
            res.jsonSuccess(result);
            next();
        }).
        catch(err => {
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

exports.OutlinePost = (req, res, next) => {
    let name        = req.body.name;

    if ('string' !== typeof name || !name) {
        res.jsonErrorParameterMissing('请输入正确的分类名称！');
        next();
        return;
    }

    return new Promise(promiseWrap(Struct.outlinePost, name)).
        then(result => {
            res.jsonSuccess(result);
            next();
        }).
        catch(err => {
            res.jsonErrorParameterWrong(err['message']);
            next();
        });
};

exports.OutlinePut = (req, res, next) => {
    let id          = +req.query.id,
        name        = req.body.name;

    if (isNaN(+id)) {
        res.jsonErrorParameterMissing('请输入正确的小分类编号！');
        next();
        return;
    } else if ('string' !== typeof name || !name) {
        res.jsonErrorParameterMissing('请输入正确的分类名称！');
        next();
        return;
    }

    new Promise(promiseWrap(Struct.outlinePut, +id, name)).
        then(result => {
            res.jsonSuccess(result);
            next();
        }).
        catch(err => {
            res.jsonErrorParameterWrong(err['message']);
            next();
        });
};

exports.OutlineDelete = (req, res, next) => {
    let id = +req.query.id;

    if (isNaN(id)) {
        res.jsonErrorParameterMissing('请输入数字 id！');
        next();
        return;
    }

    new Promise(promiseWrap(Struct.outlineDelete, id)).
        then(result => {
            res.jsonSuccess(result);
            next();
        }).
        catch(err => {
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