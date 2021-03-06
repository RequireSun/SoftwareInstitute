/**
 * Created by KelvinSen on 2016/3/17.
 */
'use strict';
const database = require('../common/database');
const formatUpdateParameters = require('../common/tool').formatUpdateParameters;
const formatDateTime = require('../common/tool').formatDateTime;

exports.get     = (callback, id) => {
    if ('number' !== typeof id) {
        return callback(new Error('Parameter: id must be number!'));
    }

    var queryString =
        'SELECT news.title, news.article, news.update_time, news.page_view, supervisor.alias, news.category_id ' +
        'FROM news LEFT JOIN supervisor ON news.supervisor_id = supervisor.id ' +
        'WHERE news.id = :id AND news.deleted <> TRUE';

    database.query(
        queryString,
        { id },
        (err, result) => {
            if (err) {
                callback(err);
            } else if (!result || !result.length) {
                callback(new Error('No Data!'));
            } else {
                result[0]['update_time'] = formatDateTime(result[0]['update_time']);
                callback(null, result[0]);
            }
        }
    );
};

exports.post    = (callback, detail) => {
    !detail && (detail = {});

    if (isNaN(detail['categoryId']) || isNaN(detail['supervisorId'])) {
        return callback(new Error('Parameter: categoryId / supervisorId must be number!'));
    } else if (('string' !== typeof detail['title'] || !detail['title']) ||
               ('string' !== typeof detail['article'] || !detail['article'])) {
        return callback(new Error('Parameter: title / article should not be empty!'));
    } else if (!(4000 > detail['article'].length)) {
        return callback(new Error('Parameter: article max size is 4000!'))
    }

    let queryString =
        'INSERT INTO `news` (`category_id`, `supervisor_id`, `title`, `article`)' +
        'VALUES (:categoryId, :supervisorId, :title, :article)';

    database.query(
        queryString,
        detail,
        (err, result) => {
            if (err) {
                callback(err);
            } else if (!result || !result['affectedRows']) {
                callback(new Error('Insert failed!'));
            } else {
                callback(null, result['insertId']);
            }
        }
    );
};

exports.put     = (callback, id, detail = {}) => {
    if (isNaN(id)) {
        return callback(new Error('Parameter: id must be number!'));
    } else if ((undefined !== detail['categoryId'] && isNaN(+detail['categoryId'])) ||
               (undefined !== detail['supervisorId'] && isNaN(+detail['supervisorId']))) {
        return callback(new Error('Parameter: categoryId / supervisorId should be number!'))
    } else if ((undefined !== detail['title'] && ('string' !== typeof detail['title'] || !detail['title'])) ||
               (undefined !== detail['article'] && ('string' !== typeof detail['article'] || !detail['article']))) {
        return callback(new Error('Parameter: title / article should not be empty string!'));
    } else if (undefined !== detail['article'] && ('string' !== typeof detail['article'] || !(4000 > detail['article'].length))) {
        return callback(new Error('Parameter: article max size is 4000!'))
    }
    // 构建更新数组
    let retObj = formatUpdateParameters(detail, {
        categoryId  : 'category_id',
        supervisorId: 'supervisor_id',
        title       : 'title',
        article     : 'article',
    });
    let queryArray  = retObj['queryArray'];
    detail          = retObj['processedParams'];
    // 空
    if (!queryArray.length) {
        return callback(new Error('Nothing to update!'));
    }

    detail['id'] = +id;

    const queryString = 'UPDATE `news` SET ' + queryArray.join(',') + ' WHERE `id` = :id';

    database.query(
        queryString,
        detail,
        (err, result) => {
            if (err) {
                callback(err);
            } else if (!result || !result['affectedRows']) {
                callback(new Error('Edit failed!'));
            } else {
                callback(null, id);
            }
        }
    );
};

exports.delete  = (callback, id) => {
    if (isNaN(id)) {
        return callback(new Error('Parameter: id must be number!'));
    }
    id = +id;

    let queryString = 'UPDATE `news` SET deleted = TRUE WHERE id = :id';

    database.query(
        queryString,
        { id },
        (err, result) => {
            if (err) {
                callback(err);
            } else if (!result || !result['affectedRows']) {
                callback(new Error('Delete failed!'));
            } else {
                callback(null, id);
            }
        }
    );
};

exports.view  = (callback, id) => {
    if ('number' !== typeof id) {
        return callback(new Error('Parameter: id must be number!'));
    }

    var queryString = 'UPDATE news SET page_view = page_view + 1 WHERE id = :id';

    database.query(
        queryString,
        { id },
        (err, result) => {
            if (err) {
                callback(err);
            } else if (!result) {
                callback(new Error('No Data!'));
            } else {
                callback(null, result);
            }
        }
    );
};