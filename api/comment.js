/**
 * Created by kelvinsun on 2016/4/23.
 */
'use strict';

const Comment = require('../proxy/comment');
const promiseWrap = require('../common/tool').promiseWrap;

exports.get = (req, res, next) => {
    let id = +req.query.id;

    if (isNaN(id)) {
        res.jsonErrorParameterMissing('请输入正确的评论编号！');
        next();
        return;
    }

    new Promise(promiseWrap(Comment.get, id)).
    then(newsDetail => {
        if (!newsDetail) {
            res.jsonErrorParameterWrong('请输入正确的评论编号！');
            next();
            return;
        }

        res.jsonSuccess({
            id              : id,
            supervisor_id   : newsDetail.id,
            supervisor_name : newsDetail.alias,
            content         : newsDetail.content,
            update_time     : newsDetail.update_time,
        });
        next();
    }).catch(err => {
        res.jsonErrorParameterWrong(err['message']);
        next();
    });
};

exports.post = (req, res, next) => {
    let supervisorId    = +req.session.uid,
        newsId          = +req.body.newsId,
        content         = req.body.content;

    if (isNaN(newsId) || isNaN(supervisorId)) {
        res.jsonErrorParameterMissing('请输入正确的新闻类别或作者ID！');
        next();
        return ;
    } else if (!content) {
        res.jsonErrorParameterMissing('内容不能为空！');
        next();
        return ;
    }

    new Promise(promiseWrap(Comment.post, { newsId, supervisorId, content })).
    then(result => {
        res.jsonSuccess(result);
        next();
    }).
    catch(err => {
        res.jsonErrorParameterWrong(err['message']);
        next();
    });
};

exports.put = (req, res, next) => {
    let id              = +req.query.id,
        supervisorId    = +req.session.uid,
        newsId          = +req.body.newsId,
        content         = req.body.content;

    if (isNaN(id)) {
        res.jsonErrorParameterMissing('id 不能为空！');
        next();
        return;
    } else if ((undefined !== req.body.newsId && isNaN(newsId)) ||
               (undefined !== req.session.uid && isNaN(supervisorId))) {
        res.jsonErrorParameterWrong('类别编号 / 用户 id 不能为空！');
        next();
        return;
    } else if ((undefined !== content && !content)) {
        res.jsonErrorParameterMissing('内容不能为空字符串！');
        next();
        return;
    }

    let detail = {};
    newsId          && (detail['newsId']    = newsId);
    supervisorId    && (detail['supervisorId']  = supervisorId);
    content         && (detail['content']         = content);

    new Promise(promiseWrap(Comment.put, id, detail)).
    then(result => {
        res.jsonSuccess(result);
        next();
    }).
    catch(err => {
        res.jsonErrorParameterWrong(err['message']);
        next();
    });
};

exports.delete = (req, res, next) => {
    let id = +req.query.id;

    if (isNaN(id)) {
        res.jsonErrorParameterMissing('id 不能为空！');
        next();
        return ;
    }

    new Promise(promiseWrap(Comment.delete, id)).
    then(result => {
        res.jsonSuccess(result);
        next();
    }).
    catch(err => {
        res.jsonErrorParameterWrong(err['message']);
        next();
    });
};
// sign update_time 格式
exports.getAll = (req, res, next) => {
    let id          = +req.query.id,
        pageSize    = +req.query.pageSize,
        pageRequest = +req.query.pageRequest;

    if (isNaN(id)) {
        res.jsonErrorParameterMissing('请输入正确的评论编号！');
        next();
        return;
    } else if (isNaN(pageSize) || isNaN(pageRequest)) {
        res.jsonErrorParameterMissing('请输入正确的页面大小和页码！');
        next();
        return;
    }

    return Promise.all([
        new Promise(promiseWrap(Comment.getAll, id, pageSize, pageRequest)),
        new Promise(promiseWrap(Comment.getCount, id)),
    ]).
    then(results => {
        let commentList  = results[0] || [],
            commentCount = results[1];
        let pageMax     = Math.ceil(commentCount / pageSize);

        if (!commentList) {
            res.jsonErrorParameterWrong('请输入正确的评论编号！');
            next();
            return;
        }

        commentList = commentList.map(item => ({
            id              : item['id'],
            supervisor_id   : item['supervisor_id'],
            supervisor_name : item['alias'],
            content         : item['content'],
            update_time     : item['update_time'],
        }));

        res.jsonSuccess({
            list : commentList,
            count: pageMax,
        });
        next();
    }).catch(err => {
        res.jsonErrorParameterWrong(err['message']);
        next();
    });
};