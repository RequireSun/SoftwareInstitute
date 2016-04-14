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

    var queryString =
        'SELECT outline.id AS id, outline.name AS name, category.id AS category_id, category.name AS category_name ' +
        'FROM outline LEFT JOIN category ON category.outline_id = outline.id WHERE outline.id = :id';

    database.query(
        queryString,
        { id },
        (err, result) => {
            if (err) {
                callback(err);
            } else if (!result || !result.length) {
                callback(new Error('No Data!'));
            } else {
                let processed = result.find((item) => undefined !== item['id'] && undefined !== item['name']);
                processed = { id: processed['id'], name: processed['name'], categories: [] };
                processed['categories'] = result.map(item => ({ id: item['category_id'], name: item['category_name'] }));
                callback(null, processed);
            }
        }
    );
};

exports.post = (callback, name) => {
    if ('string' !== typeof name || !name) {
        return callback(new Error('Parameter: name must be string!'));
    }

    let queryString = 'INSERT INTO `outline` (`name`) VALUES (:name)';

    database.query(
        queryString,
        { name },
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

exports.put = (callback, id, name) => {
    if (isNaN(+id)) {
        return callback(new Error('Parameter: id must be number!'));
    } else if ('string' !== typeof name || !name) {
        return callback(new Error('Parameter: name should not be empty string!'));
    }
    id = +id;

    let queryString = 'UPDATE `outline` SET `name` = :name WHERE `id` = :id';

    database.query(
        queryString,
        { id, name },
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

    let queryString = 'DELETE FROM `outline` WHERE id = :id';

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
