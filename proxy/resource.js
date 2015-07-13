var EventProxy  = require('eventproxy');
var models      = require('../models');
var resource    = models.Resource;
var _           = require('lodash');
var database    = require('../common/database')

exports.getResources = function (pageSize, pageRequest, callback) {
    if ('number' !== typeof pageSize || 'number' !== typeof pageRequest) {
        return callback(new Error('Parameter: pageSize / pageRequest must be number!'));
    }

    var queryString = 'SELECT * FROM resource ORDER BY update_time DESC LIMIT pageLimit OFFSET pageOffset';
    
    database.query(queryString, { 
        pageLimit: pageSize, 
        pageOffset: (pageRequest - 1) * pageSize 
    }, function (err, rows) {
        if (err) {
            return callback(err);
        }
        callback(null, rows);
    });
};