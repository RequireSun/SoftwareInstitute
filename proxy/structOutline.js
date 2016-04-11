/**
 * Created by kelvinsun on 2016/4/11.
 */
'use strict';

let database = require('../common/database');

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
            } else if (!result) {
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