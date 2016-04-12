/**
 * Created by KelvinSen on 2016/3/18.
 */
'use strict';
let database            = require('../common/database');
/**
 * 获取小类新闻列表
 * @param callback
 * @param id
 * @param pageSize
 * @param pageRequest
 * @returns {*}
 */
exports.category        = (callback, id, pageSize, pageRequest) => {
    if ('number' !== typeof pageSize || 'number' !== typeof pageRequest || 'number' !== typeof id) {
        return callback(new Error('Parameter: pageSize / pageRequest / id must be number!'));
    } else if (0 > pageSize || 0 > pageRequest) {
        return callback(new Error('Parameter: pageSize / pageRequest must be non-negative number!'));
    }

    var queryString =
        'SELECT id, title, update_time FROM news ' +
        'WHERE category_id = :id ORDER BY update_time DESC LIMIT :pageLimit OFFSET :pageOffset';

    database.query(queryString, {
        id,
        pageLimit   : pageSize,
        pageOffset  : pageRequest * pageSize,
    }, (err, rows) => {
        if (err) {
            callback(err);
        } else {
            callback(null, rows);
        }
    });
};

exports.outline         = (callback, id, pageSize, pageRequest) => {
    if ('number' !== typeof pageSize || 'number' !== typeof pageRequest || 'number' !== typeof id) {
        return callback(new Error('Parameter: pageSize / pageRequest / id must be number!'));
    } else if (0 > pageSize || 0 > pageRequest) {
        return callback(new Error('Parameter: pageSize / pageRequest must be non-negative number!'));
    }

    var queryString =
        'SELECT news.id AS id, title, update_time ' +
        'FROM news INNER JOIN category ON news.category_id = category.id ' +
        'WHERE category.outline_id = :id ' +
        'ORDER BY update_time DESC LIMIT :pageLimit OFFSET :pageOffset';

    database.query(queryString, {
        id,
        pageLimit   : pageSize,
        pageOffset  : pageRequest * pageSize
    }, (err, rows) => {
        if (err) {
            callback(err);
        } else {
            callback(null, rows);
        }
    });
};

exports.categoryCount   = (callback, id) => {
    if ('number' !== typeof id) {
        return callback(new Error('Parameter: id must be number!'));
    }

    var queryString = 'SELECT COUNT(*) as categoryCount FROM news WHERE category_id = :id';

    database.query(
        queryString,
        { id },
        (err, result) => {
            if (err) {
                callback(err);
            } else if (!result || !result.length) {
                callback(new Error('No data!'));
            } else {
                callback(null, result[0].categoryCount);
            }
        }
    );
};

exports.outlineCount    = (callback, id) => {
    if ('number' !== typeof id) {
        return callback(new Error('Parameter: id must be number!'));
    }

    var queryString =
        'SELECT COUNT(*) as outlineCount ' +
        'FROM news INNER JOIN category ON news.category_id = category.id ' +
        'WHERE category.outline_id = :id';

    database.query(
        queryString,
        { id },
        (err, result) => {
            if (err) {
                callback(err);
            } else if (!result || !result.length) {
                callback(new Error('No data!'));
            } else {
                callback(null, result[0].outlineCount);
            }
        }
    );
};