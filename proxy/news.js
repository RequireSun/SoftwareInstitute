'use strict';
var database    = require('../common/database');
let detail      = require('./newsDetail.js');
let aggregate   = require('./newsAggregate');


//exports.getNewsCategory = function (pageSize, pageRequest, categoryId, callback) {
//    if ('number' !== typeof pageSize || 'number' !== typeof pageRequest || 'number' !== typeof categoryId) {
//        return callback(new Error('Parameter: pageSize / pageRequest / categoryId must be number!'));
//    }
//
//    var queryString = 'SELECT id, title, update_time FROM news WHERE category_id = :categoryId ORDER BY update_time DESC LIMIT :pageLimit OFFSET :pageOffset';
//
//    database.query(queryString, {
//        categoryId: categoryId,
//        pageLimit: pageSize,
//        pageOffset: (pageRequest - 1) * pageSize
//    }, function (err, rows) {
//        if (err) {
//            return callback(err);
//        }
//        return callback(null, rows);
//    });
//};

//exports.getCountCategory = function (categoryId, callback) {
//    if ('number' !== typeof categoryId) {
//        return callback(new Error('Parameter: categoryId must be number!'));
//    }
//
//    var queryString = 'SELECT COUNT(*) as categoryCount FROM news WHERE category_id = :categoryId';
//
//    database.query(queryString, {
//        categoryId: categoryId
//    }, function (err, result) {
//        if (err) {
//            return callback(err);
//        } else if (!result) {
//            return callback(new Error('No data!'));
//        }
//        return callback(null, result[0].categoryCount);
//    });
//};

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

//exports.getNewsOutline = function (pageSize, pageRequest, outlineId, callback) {
//    if ('number' !== typeof pageSize || 'number' !== typeof pageRequest || 'number' !== typeof outlineId) {
//        return callback(new Error('Parameter: pageSize / pageRequest / outlineId must be number!'));
//    }
//
//    var queryString = 'SELECT news.id AS id, title, update_time ' +
//                      'FROM news INNER JOIN category ON news.category_id = category.id ' +
//                      'WHERE category.outline_id = :outlineId ORDER BY update_time DESC LIMIT :pageLimit OFFSET :pageOffset';
//
//    database.query(queryString, {
//        outlineId: outlineId,
//        pageLimit: pageSize,
//        pageOffset: (pageRequest - 1) * pageSize
//    }, function (err, rows) {
//        if (err) {
//            return callback(err);
//        }
//        return callback(null, rows);
//    });
//};

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

exports.getNameOutline = function (outlineId, callback) {
    if ('number' !== typeof outlineId) {
        return callback(new Error('Parameter: outlineId must be number!'));
    }

    var queryString = 'SELECT name FROM outline WHERE id = :outlineId';

    database.query(queryString, {
        outlineId: outlineId
    }, function (err, result) {
        if (err) {
            return callback(err);
        } else if (!result) {
            return callback(new Error('No data!'));
        }
        return callback(null, result[0].name);
    });
};

//exports.getNewsDetail = function (newsId, callback) {
//    if ('number' !== typeof newsId) {
//        return callback(new Error('Parameter: newsId must be number!'));
//    }
//
//    var queryString = 'SELECT news.title, news.article, news.update_time, news.page_view, supervisor.alias ' +
//                      'FROM news INNER JOIN supervisor ON news.supervisor_id = supervisor.id ' +
//                      'WHERE news.id = :newsId';
//
//    database.query(queryString, {
//        newsId: newsId
//    }, function (err, result) {
//        if (err) {
//            return callback(err);
//        } else if (!result) {
//            return callback(new Error('No Data!'));
//        }
//        return callback(null, result[0]);
//    });
//};

//exports.updateNewsPageView = function (newsId, callback) {
//    if ('number' !== typeof newsId) {
//        return callback(new Error('Parameter: newsId must be number!'));
//    }
//
//    var queryString = 'UPDATE news SET page_view = page_view + 1 WHERE id = :newsId';
//
//    database.query(queryString, {
//        newsId: newsId
//    }, function (err, result) {
//        if (err) {
//            return callback(err);
//        } else if (!result) {
//            return callback(new Error('No Data!'));
//        }
//        return callback(null, result);
//    });
//};

exports.getOutlineCategory = function (callback) {
    var queryString = 'SELECT outline.id AS outline_id, outline.name AS outline_name, ' +
        'category.id AS category_id, category.name AS category_name ' +
        'FROM outline LEFT JOIN category ON category.outline_id = outline.id ';

    database.query(queryString, {}, function (err, result) {
        if (err) {
            return callback(err);
        }
        var outlineCategory = {},
            hasOwnProperty = Object.hasOwnProperty.bind(outlineCategory),
            tempResult;
        for (var i = 0, l = result.length; i < l; ++i) {
            tempResult = result[i];
            if (!hasOwnProperty(tempResult.outline_name)) {
                outlineCategory[tempResult.outline_name] = {id: tempResult.outline_id, category: {}};
            }
            if (tempResult.category_id) {
                outlineCategory[tempResult.outline_name].category[tempResult.category_name] = tempResult.category_id;
            }
        }
        return callback(null, outlineCategory);
    });
};

exports.getStyleCategory = function (categoryType, callback) {
    if ('string' !== typeof categoryType || 0 === categoryType.length) {
        return callback(new Error('Parameter: categoryType must be string!'));
    }

    var queryString = 'SELECT style.name AS style_name, category.id AS category_id, category.name AS category_name ' +
        'FROM style_type LEFT JOIN style ON style_type.id = style.type_id ' +
        'LEFT JOIN style_relation ON style.id = style_relation.style_id ' +
        'LEFT JOIN category ON category.id = style_relation.category_id ' +
        'WHERE style_type.name = :categoryType';

    database.query(queryString, {
        categoryType: categoryType
    }, function (err, result) {
        if (err) {
            return callback(err);
        }

        var styleCategory = {},
            hasOwnProperty = Object.hasOwnProperty.bind(styleCategory),
            tempResult;
        for (var i = 0, l = result.length; i < l; ++i) {
            tempResult = result[i];
            if (!hasOwnProperty(tempResult.style_name)) {
                styleCategory[tempResult.style_name] = {};
            }
            if (tempResult.category_id) {
                styleCategory[tempResult.style_name][tempResult.category_id] = tempResult.category_name;
            }
        }
        return callback(null, styleCategory);
    });
};

exports.getStyleOutline = function (outlineType, callback) {
    if ('string' !== typeof outlineType || 0 === outlineType.length) {
        return callback(new Error('Parameter: outlineType must be string!'));
    }

    var queryString = 'SELECT style.name AS style_name, outline.id AS outline_id, outline.name AS outline_name ' +
        'FROM style_type LEFT JOIN style ON style_type.id = style.type_id ' +
        'LEFT JOIN style_relation ON style.id = style_relation.style_id ' +
        'LEFT JOIN outline ON outline.id = style_relation.outline_id ' +
        'WHERE style_type.name = :outlineType';

    database.query(queryString, {
        outlineType: outlineType
    }, function (err, result) {
        if (err) {
            return callback(err);
        }

        var styleOutline = {},
            hasOwnProperty = Object.hasOwnProperty.bind(styleOutline),
            tempResult;
        for (var i = 0, l = result.length; i < l; ++i) {
            tempResult = result[i];
            if (!hasOwnProperty(tempResult.style_name)) {
                styleOutline[tempResult.style_name] = {};
            }
            if (tempResult.outline_id) {
                styleOutline[tempResult.style_name][tempResult.outline_id] = tempResult.outline_name;
            }
        }
        return callback(null, styleOutline);
    });
};