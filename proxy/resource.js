// var EventProxy  = require('eventproxy');
// var _           = require('lodash');
var database    = require('../common/database');

// 获取资源列表
exports.getResources = function (pageSize, pageRequest, callback) {
    if ('number' !== typeof pageSize || 'number' !== typeof pageRequest) {
        return callback(new Error('Parameter: pageSize / pageRequest must be number!'));
    }

    var queryString = 'SELECT * FROM resource ORDER BY update_time DESC LIMIT :pageLimit OFFSET :pageOffset';
    
    database.query(queryString, {
        pageLimit: pageSize, 
        pageOffset: (pageRequest - 1) * pageSize 
    }, function (err, rows) {
        if (err) {
            return callback(err);
        }
        return callback(null, rows);
    });
};

// 获取资源数量
exports.getCount = function (callback) {
    var queryString = 'SELECT COUNT(*) AS resourceCount FROM resource';
    database.query(queryString, function (err, result) {
        if (err) {
            return callback(err);
        } else if (!result) {
            return callback(new Error('No data!'));
        }
        return callback(null, result[0].resourceCount);
    });
};