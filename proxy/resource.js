'use strict';

const database    = require('../common/database');
const formatDateTime = require('../common/tool').formatDateTime;
const formatUpdateParameters = require('../common/tool').formatUpdateParameters;

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

exports.post    = (callback, resource = {}) => {
    if (('string' !== typeof resource['title'] || !resource['title']) ||
        ('string' !== typeof resource['path'] || !resource['path'])) {
        return callback(new Error('Parameter: title / path should not be empty!'));
    } else if (!(50 > resource['path'].length) || !(512 > resource['path'].length)) {
        return callback(new Error('Parameter: title / path out of max size!'))
    }

    const queryString =
        'INSERT INTO `resource` (`title`, `path`)' +
        'VALUES (:title, :path)';

    database.query(
        queryString,
        resource,
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

exports.put     = (callback, id, resource = {}) => {
    if (isNaN(id)) {
        return callback(new Error('Parameter: id must be number!'));
    } else if ((undefined !== resource['title'] && ('string' !== typeof resource['title'] || !resource['title'])) ||
        (undefined !== resource['path'] && ('string' !== typeof resource['path'] || !resource['path']))) {
        return callback(new Error('Parameter: title / path should not be empty string!'));
    } else if (undefined !== resource['title'] && ('string' !== typeof resource['title'] || !(50 > resource['title'].length))) {
        return callback(new Error('Parameter: title max size is 50!'))
    } else if (undefined !== resource['path'] && ('string' !== typeof resource['path'] || !(512 > resource['path'].length))) {
        return callback(new Error('Parameter: path max size is 512!'))
    }

    // 构建更新数组
    const retObj = formatUpdateParameters(resource, {
        title: 'title',
        path : 'path',
    });
    let queryArray = retObj['queryArray'];
    resource       = retObj['processedParams'];
    // 空
    if (!queryArray.length) {
        return callback(new Error('Nothing to update!'));
    }

    resource['id'] = +id;

    const queryString = `UPDATE \`resource\` SET ${queryArray.join(',')} WHERE \`id\` = :id`;

    return database.query(
        queryString,
        resource,
        (err, result) => {
            if (err) {
                callback(err);
            } else if (!result || !result['affectedRows']) {
                callback(new Error('Edit failed!'));
            } else {
                callback(null, id);
            }
        }
    );
};

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