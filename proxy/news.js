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

exports.getCountCategory = function (categoryId, callback) {
    if ('number' !== typeof categoryId) {
        return callback(new Error('Parameter: categoryId must be number!'));
    }

    var queryString = 'SELECT COUNT(*) as categoryCount FROM news WHERE category_id = :categoryId';

    database.query(queryString, {
        categoryId: categoryId
    }, function (err, result) {
        if (err) {
            return callback(err);
        } else if (!result) {
            return callback(new Error('No data!'));
        }
        return callback(null, result[0].categoryCount);
    });
};

exports.getNameCategory = function (categoryId, callback) {
    if ('number' !== typeof categoryId) {
        return callback(new Error('Parameter: categoryId must be number!'));
    }

    var queryString = 'SELECT name FROM category WHERE id = :categoryId';

    database.query(queryString, {
        categoryId: categoryId
    }, function (err, result) {
        if (err) {
            return callback(err);
        } else if (!result) {
            return callback(new Error('No data!'));
        }
        return callback(null, result[0].name);
    });
};

exports.getNewsOutline = function (pageSize, pageRequest, outlineId, callback) {
    if ('number' !== typeof pageSize || 'number' !== typeof pageRequest || 'number' !== typeof outlineId) {
        return callback(new Error('Parameter: pageSize / pageRequest / outlineId must be number!'));
    }

    var queryString = 'SELECT news.id AS id, title, update_time ' +
                      'FROM news INNER JOIN category ON news.category_id = category.id ' +
                      'WHERE category.outline_id = :outlineId ORDER BY update_time DESC LIMIT :pageLimit OFFSET :pageOffset';

    database.query(queryString, {
        outlineId: outlineId,
        pageLimit: pageSize,
        pageOffset: (pageRequest - 1) * pageSize
    }, function (err, rows) {
        if (err) {
            return callback(err);
        }
        return callback(null, rows);
    });
};

exports.getCountOutline = function (outlineId, callback) {
    if ('number' !== typeof outlineId) {
        return callback(new Error('Parameter: outlineId must be number!'));
    }

    var queryString = 'SELECT COUNT(*) as outlineCount FROM news INNER JOIN category ON news.category_id = category.id ' +
                      'WHERE category.outline_id = :outlineId';

    database.query(queryString, {
        outlineId: outlineId
    }, function (err, result) {
        if (err) {
            return callback(err);
        } else if (!result) {
            return callback(new Error('No data!'));
        }
        return callback(null, result[0].outlineCount);
    });
};