/**
 * Created by KelvinSen on 2016/3/18.
 */
'use strict';
let database            = require('../common/database');

exports.category        = (callback, categoryId, pageSize, pageRequest) => {
    if ('number' !== typeof pageSize || 'number' !== typeof pageRequest || 'number' !== typeof categoryId) {
        return callback(new Error('Parameter: pageSize / pageRequest / categoryId must be number!'));
    }

    var queryString =
        'SELECT id, title, update_time FROM news ' +
        'WHERE category_id = :categoryId ORDER BY update_time DESC LIMIT :pageLimit OFFSET :pageOffset';

    database.query(queryString, {
        categoryId,
        pageLimit: pageSize,
        pageOffset: (pageRequest - 1) * pageSize
    }, (err, rows) => {
        if (err) {
            callback(err);
        } else {
            callback(null, rows);
        }
    });
};

exports.outline         = (callback, outlineId, pageSize, pageRequest) => {
    if ('number' !== typeof pageSize || 'number' !== typeof pageRequest || 'number' !== typeof outlineId) {
        return callback(new Error('Parameter: pageSize / pageRequest / outlineId must be number!'));
    }

    var queryString =
        'SELECT news.id AS id, title, update_time ' +
        'FROM news INNER JOIN category ON news.category_id = category.id ' +
        'WHERE category.outline_id = :outlineId ' +
        'ORDER BY update_time DESC LIMIT :pageLimit OFFSET :pageOffset';

    database.query(queryString, {
        outlineId,
        pageLimit: pageSize,
        pageOffset: (pageRequest - 1) * pageSize
    }, (err, rows) => {
        if (err) {
            callback(err);
        } else {
            callback(null, rows);
        }
    });
};

exports.categoryCount   = (callback, categoryId) => {
    if ('number' !== typeof categoryId) {
        return callback(new Error('Parameter: categoryId must be number!'));
    }

    var queryString = 'SELECT COUNT(*) as categoryCount FROM news WHERE category_id = :categoryId';

    database.query(
        queryString,
        { categoryId },
        (err, result) => {
            if (err) {
                callback(err);
            } else if (!result) {
                callback(new Error('No data!'));
            } else {
                callback(null, result[0].categoryCount);
            }
        }
    );
};

exports.outlineCount    = (callback, outlineId) => {
    if ('number' !== typeof outlineId) {
        return callback(new Error('Parameter: outlineId must be number!'));
    }

    var queryString =
        'SELECT COUNT(*) as outlineCount ' +
        'FROM news INNER JOIN category ON news.category_id = category.id ' +
        'WHERE category.outline_id = :outlineId';

    database.query(
        queryString,
        { outlineId },
        (err, result) => {
            if (err) {
                callback(err);
            } else if (!result) {
                callback(new Error('No data!'));
            } else {
                callback(null, result[0].outlineCount);
            }
        }
    );
};