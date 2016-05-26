'use strict';

const database    = require('../common/database');
const formatDateTime = require('../common/tool').formatDateTime;

exports.get     = (callback, id) => {
    if (isNaN(id)) {
        return callback(new Error('Parameter: id must be number!'));
    }
    id = +id;

    var queryString =
        'SELECT * FROM resource' +
        ' WHERE id = :id AND deleted <> TRUE';

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

exports.post    = (callback) => {};

exports.put     = (callback) => {};

exports.delete  = (callback, id) => {
    if (isNaN(id)) {
        return callback(new Error('Parameter: id must be number!'));
    }
    id = +id;

    const queryString = 'UPDATE `resource` SET deleted = TRUE WHERE id = :id';

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
// 获取资源列表
exports.list = (callback, pageSize, pageRequest) => {
    if ('number' !== typeof pageSize || 'number' !== typeof pageRequest) {
        return callback(new Error('Parameter: pageSize / pageRequest must be number!'));
    } else if (0 > pageSize || 0 > pageRequest) {
        return callback(new Error('Parameter: pageSize / pageRequest must be non-negative number!'));
    }

    const queryString =
        'SELECT * FROM `resource` WHERE deleted <> TRUE' +
        ' ORDER BY update_time DESC LIMIT :pageLimit OFFSET :pageOffset';
    
    database.query(queryString, {
        pageLimit: pageSize, 
        pageOffset: pageRequest * pageSize
    }, (err, rows) => {
        if (err) {
            callback(err);
        } else {
            callback(null, rows);
        }
    });
};
// 获取资源数量
exports.listCount = (callback) => {
    let queryString = 'SELECT COUNT(*) AS resourceCount FROM resource WHERE deleted <> TRUE';

    database.query(queryString, (err, result) => {
        if (err) {
            callback(err);
        } else if (!result || !result.length) {
            callback(new Error('No data!'));
        } else {
            callback(null, result[0].resourceCount);
        }
    });
};