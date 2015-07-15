var database    = require('../common/database');

exports.getNewsCategory = function (pageSize, pageRequest, categoryId, callback) {
    if ('number' !== typeof pageSize || 'number' !== typeof pageRequest || 'number' !== typeof categoryId) {
        return callback(new Error('Parameter: pageSize / pageRequest / categoryId must be number!'));
    }

    var queryString = 'SELECT id, title, update_time FROM news WHERE category_id = :categoryId ORDER BY update_time DESC LIMIT :pageLimit OFFSET :pageOffset';

    database.query(queryString, {
        categoryId: categoryId,
        pageLimit: pageSize,
        pageOffset: (pageRequest - 1) * pageSize
    }, function (err, rows) {
        if (err) {
            return callback(err);
        }
        return callback(null, rows);
    });
};