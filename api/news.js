'use strict';

let News = require('../proxy').News;
let promiseWrap = require('../common/tool').promiseWrap;

// 根据小类别获取新闻列表
exports.NewsCategory = function (req, res, next) {
    let pageSize    = +req.query.pageSize;
    let pageRequest = +req.query.pageRequest;
    let id          = +req.query.id;
    
    if (isNaN(pageSize) || isNaN(pageRequest)) {
        res.jsonErrorParameterMissing('请选择正确的页码或页面大小！');
        next();
        return;
    } else if (isNaN(id)) {
        res.jsonErrorParameterMissing('请选择正确的新闻类型！');
        next();
        return;
    } else if (0 > pageSize || 0 > pageRequest) {
        res.jsonErrorParameterWrong('页码和页面大小不能为负！');
        next();
        return;
    }

    Promise.all([
        new Promise(promiseWrap(News.category, id, pageSize, pageRequest)),
        new Promise(promiseWrap(News.categoryCount, id)),
        // es6 type
    //]).then(([newsList, newsCount]) => {
    ]).then(result => {
        let newsList    = result[0] || [],
            newsCount   = result[1];
        let pageMax     = Math.ceil(newsCount / pageSize);

        //if (!newsList || !newsList.length || pageMax < pageRequest) {
        //    return res.json({ code: 1002, error: '页码越界或新闻类型错误！' });
        //}

        res.jsonSuccess({
            list    : newsList,
            count   : pageMax,
        });
        next();
    }).catch(err => {
        res.jsonErrorParameterWrong(err['message']);
        next();
    });
};
// 根据大类别获取新闻列表
exports.NewsOutline = function (req, res, next) {
    let pageSize    = +req.query.pageSize;
    let pageRequest = +req.query.pageRequest;
    let id          = +req.query.id;

    if (isNaN(pageSize) || isNaN(pageRequest)) {
        res.jsonErrorParameterMissing('请选择正确的页码！');
        next();
        return;
    } else if (isNaN(id)) {
        res.jsonErrorParameterMissing('请选择正确的新闻类型！');
        next();
        return;
    } else if (0 > pageSize || 0 > pageRequest) {
        res.jsonErrorParameterWrong('页码和页面大小不能为负！');
        next();
        return;
    }

    Promise.all([
        new Promise(promiseWrap(News.outline, id, pageSize, pageRequest)),
        new Promise(promiseWrap(News.outlineCount, id)),
    ]).then(result => {
        let newsList    = result[0] || [],
            newsCount   = result[1];
        let pageMax     = Math.ceil(newsCount / pageSize);

        res.jsonSuccess({
            list    : newsList,
            count   : pageMax
        });
        next();
    }).catch(err => {
        res.jsonErrorParameterWrong(err['message']);
        next();
    });
};
// 获取新闻详情
exports.NewsGet = (req, res, next) => {
    let id = +req.query.id;

    if (isNaN(id)) {
        res.jsonErrorParameterMissing('请输入正确的新闻编号！');
        next();
        return;
    }
    
    Promise.all([
        new Promise(promiseWrap(News.get, id)),
        new Promise(promiseWrap(News.view, id)),
    ]).then(([newsDetail]) => {
        const { title, article, update_time, page_view, category_id } = newsDetail;

        if (!newsDetail) {
            res.jsonErrorParameterWrong('请输入正确的新闻编号！');
            next();
            return;
        }

        res.jsonSuccess({
            id,
            title,
            supervisor_name : newsDetail.alias,
            article,
            update_time,
            page_view,
            category_id,
        });
        next();
    }).catch(err => {
        res.jsonErrorParameterWrong(err['message']);
        next();
    });
};

exports.NewsPost = (req, res, next) => {
    let categoryId      = +req.body.categoryId,
        supervisorId    = +req.session.uid,
        title           = req.body.title,
        article         = req.body.article;

    if (isNaN(categoryId) || isNaN(supervisorId)) {
        res.jsonErrorParameterMissing('请输入正确的新闻类别或作者ID！');
        next();
        return ;
    } else if (!title || !article) {
        res.jsonErrorParameterMissing('标题 / 内容不能为空！');
        next();
        return ;
    }

    new Promise(promiseWrap(News.post, { categoryId, supervisorId, title, article })).
        then(result => {
            res.jsonSuccess(result);
            next();
        }).
        catch(err => {
            res.jsonErrorParameterWrong(err['message']);
            next();
        });
};

exports.NewsPut = (req, res, next) => {
    let id              = +req.query.id,
        categoryId      = +req.body.categoryId,
        supervisorId    = +req.session.uid,
        title           = req.body.title,
        article         = req.body.article;

    if (isNaN(id)) {
        res.jsonErrorParameterMissing('id 不能为空！');
        next();
        return;
    } else if ((undefined !== req.body.categoryId && isNaN(categoryId)) ||
               (undefined !== req.session.uid && isNaN(supervisorId))) {
        res.jsonErrorParameterWrong('类别编号 / 用户 id 不能为空！');
        next();
        return;
    } else if ((undefined !== title && !title) ||
               (undefined !== article && !article)) {
        res.jsonErrorParameterMissing('标题 / 内容不能为空字符串！');
        next();
        return;
    }

    let detail = {};
    categoryId      && (detail['categoryId']    = categoryId);
    supervisorId    && (detail['supervisorId']  = supervisorId);
    title           && (detail['title']         = title);
    article         && (detail['article']       = article);

    new Promise(promiseWrap(News.put, id, detail)).
        then(result => {
            res.jsonSuccess(result);
            next();
        }).
        catch(err => {
            res.jsonErrorParameterWrong(err['message']);
            next();
        });
};

exports.NewsDelete = (req, res, next) => {
    const id = +req.query.id;

    if (isNaN(id)) {
        res.jsonErrorParameterMissing('id 不能为空！');
        next();
        return ;
    }

    new Promise(promiseWrap(News.delete, id)).
        then(result => {
            res.jsonSuccess(result);
            next();
        }).
        catch(err => {
            res.jsonErrorParameterWrong(err['message']);
            next();
        });
};
