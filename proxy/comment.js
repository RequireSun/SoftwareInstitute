/**
 * Created by kelvinsun on 2016/4/23.
 */
'use strict';
const database = require('../common/database');
const formatUpdateParameters = require('../common/tool').formatUpdateParameters;

exports.get     = (callback, id) => {
    if ('number' !== typeof id) {
        return callback(new Error('Parameter: id must be number!'));
    }

    var queryString =
        'SELECT comment.id, comment.news_id, comment.content, comment.update_time, comment.supervisor_id, supervisor.alias ' +
        'FROM comment LEFT JOIN supervisor ON comment.supervisor_id = supervisor.id ' +
        'WHERE comment.id = :id AND comment.deleted <> TRUE';

    database.query(
        queryString,
        { id },
        (err, result) => {
            if (err) {
                callback(err);
            } else if (!result || !result.length) {
                callback(new Error('No Data!'));
            } else {
                callback(null, result[0]);
            }
        }
    );
};
// sign 限制 200 字
exports.post    = (callback, detail) => {
    !detail && (detail = {});

    if (isNaN(detail['newsId']) || isNaN(detail['supervisorId'])) {
        return callback(new Error('Parameter: categoryId / supervisorId must be number!'));
    } else if ('string' !== typeof detail['content'] || !detail['content']) {
        return callback(new Error('Parameter: content should not be empty!'));
    } else if ('string' !== typeof detail['content'] || !(200 > detail['content'])) {
        return callback(new Error('Parameter: content max length 200!'));
    }

    let queryString =
        'INSERT INTO `comment` (`news_id`, `supervisor_id`, `content`)' +
        'VALUES (:categoryId, :supervisorId, :content)';

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
exports.put     = (callback, id, detail) => {
    !detail && (detail = {});

    if (isNaN(id)) {
        return callback(new Error('Parameter: id must be number!'));
    } else if ((undefined !== detail['newsId'] && isNaN(detail['newsId'])) ||
               (undefined !== detail['supervisorId'] && isNaN(detail['supervisorId']))) {
        return callback(new Error('Parameter: categoryId / supervisorId must be number!'));
    } else if (undefined !== detail['content'] &&
              ('string' !== typeof detail['content'] || !detail['content'])) {
        return callback(new Error('Parameter: content should not be empty!'));
    } else if (undefined !== detail['content'] &&
              ('string' !== typeof detail['content'] || !(200 > detail['content']))) {
        return callback(new Error('Parameter: content max length 200!'));
    }
    // 构建更新数组
    let retObj = formatUpdateParameters(detail, {
        newsId      : 'news_id',
        supervisorId: 'supervisor_id',
        content     : 'content',
    });
    let queryArray  = retObj['queryArray'];
    detail          = retObj['processedParams'];
    // 空
    if (!queryArray.length) {
        return callback(new Error('Nothing to update!'));
    }

    detail['id'] = +id;

    const queryString = 'UPDATE `comment` SET ' + queryArray.join(',') + ' WHERE `id` = :id';

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
exports.delete  = (callback, id) => {};
exports.getAll  = (callback, newsId) => {};