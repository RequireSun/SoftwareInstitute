/**
 * Created by kelvinsun on 2016/4/11.
 */
'use strict';

let database = require('../common/database');
let formatUpdateParameters = require('../common/tool').formatUpdateParameters;

exports.get = (callback, id) => {
    if ('number' !== typeof id) {
        return callback(new Error('Parameter: id must be number!'));
    }

    var queryString = 'SELECT id, name FROM category WHERE id = :id';

    database.query(
        queryString,
        { id },
        (err, result) => {
            if (err) {
                callback(err);
            } else if (!result || !result.length) {
                callback(new Error('No Data!'));
            } else {
                callback(null, result[0]);
            }
        }
    );
};

exports.post = (callback, detail) => {
    !detail && (detail = {});
    let name        = detail['name'],
        outlineId   = +detail['outlineId'];

    if (isNaN(outlineId)) {
        return callback(new Error('Parameter: outlineId must be number!'));
    } else if ('string' !== typeof name || !name) {
        return callback(new Error('Parameter: name must be string!'));
    }

    let queryString = 'INSERT INTO `category` (`name`, `outline_id`) VALUES (:name, :outlineId)';

    database.query(
        queryString,
        { name, outlineId },
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

exports.put = (callback, id, detail) => {
    !detail && (detail = {});

    if (isNaN(+id)) {
        return callback(new Error('Parameter: id must be number!'));
    } else if (undefined !== detail['name'] && ('string' !== detail['name'] || !detail['name'])) {
        return callback(new Error('Parameter: name should not be empty string!'));
    } else if (undefined !== detail['outlineId'] && isNaN(+detail['outlineId'])) {
        return callback(new Error('Parameter: outlineId should not be empty string!'));
    }
    detail['outlineId'] = +detail['outlineId'];

    let retObj = formatUpdateParameters(detail, {
        name        : 'name',
        outlineId   : 'outline_id',
    });
    let queryArray  = retObj['queryArray'];
    detail          = retObj['processedParams'];

    if (!queryArray.length) {
        return callback(new Error('Nothing to update!'));
    }

    detail['id'] = +id;

    let queryString = 'UPDATE `category` SET ' + queryArray.join(',') + ' WHERE `id` = :id';

    database.query(
        queryString,
        detail,
        (err, result) => {
            if (err) {
                callback(err);
            } else if (!result || !result['affectedRows']) {
                callback(new Error('Edit failed!'));
            } else {
                callback(null, id);
            }
        }
    )
};

exports.delete = (callback, id) => {
    if (isNaN(+id)) {
        return callback(new Error('Parameter: id must be number!'));
    }
    id = +id;

    let queryString = 'DELETE FROM `category` WHERE id = :id';

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