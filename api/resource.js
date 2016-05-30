'use strict';

const Resource = require('../proxy').Resource;
const promiseWrap = require('../common/tool').promiseWrap;

exports.get     = (req, res, next) => {
    const id = +req.query.id;

    if (isNaN(id)) {
        res.jsonErrorParameterMissing('请输入正确的新闻编号！');
        next();
        return;
    }

    return new Promise(promiseWrap(Resource.get, id)).
        then((resourceDetail) => {
            const { title, path, update_time } = resourceDetail;

            if (!resourceDetail) {
                res.jsonErrorParameterWrong('请输入正确的新闻编号！');
                next();
                return;
            }

            res.jsonSuccess({
                id,
                title,
                path,
                update_time,
            });
            next();
        }).
        catch(err => {
            res.jsonErrorParameterWrong(err['message']);
            next();
        });
};

exports.post    = (req, res, next) => {
    console.log(req.file);
    const title = req.body.title,
          path  = req.file.name;

    if (!title || !path) {
        res.jsonErrorParameterMissing('标题 / 文件不能为空！');
        next();
        return ;
    }

    new Promise(promiseWrap(Resource.post, { title, path })).
        then(result => {
            res.jsonSuccess(result);
            next();
        }).
        catch(err => {
            res.jsonErrorParameterWrong(err['message']);
            next();
        });
};

exports.delete  = (req, res, next) => {
    const id = +req.query.id;

    if (isNaN(id)) {
        res.jsonErrorParameterMissing('id 不能为空！');
        next();
        return ;
    }

    return new Promise(promiseWrap(Resource.delete, id)).
        then(result => {
            res.jsonSuccess(result);
            next();
        }).
        catch(err => {
            res.jsonErrorParameterWrong(err['message']);
            next();
        });
};

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

    return Promise.all([
        new Promise(promiseWrap(Resource.list, pageSize, pageRequest)),
        new Promise(promiseWrap(Resource.listCount)),
    ]).then(([list = [], amount = 0]) => {
        // let list    = result[0] || [],
        //     amount  = result[1];
        const count   = Math.ceil(amount / pageSize);

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