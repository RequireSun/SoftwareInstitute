'use strict';

let database    = require('../common/database');

// 获取资源列表
exports.listGet = function (callback, pageSize, pageRequest) {
    if ('number' !== typeof pageSize || 'number' !== typeof pageRequest) {
        return callback(new Error('Parameter: pageSize / pageRequest must be number!'));
    } else if (0 > pageSize || 0 > pageRequest) {
        return callback(new Error('Parameter: pageSize / pageRequest must be non-negative number!'));
    }

    let queryString = 'SELECT * FROM resource ORDER BY update_time DESC LIMIT :pageLimit OFFSET :pageOffset';
    
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
exports.listCount = function (callback) {
    let queryString = 'SELECT COUNT(*) AS resourceCount FROM resource';

    database.query(queryString, (err, result) => {
        if (err) {
            callback(err);
        } else if (!result) {
            callback(new Error('No data!'));
        } else {
            callback(null, result[0].resourceCount);
        }
    });
};