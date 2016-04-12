/**
 * Created by KelvinSen on 2016/3/17.
 */
'use strict';
let database = require('../common/database');

exports.get     = (callback, id) => {
    if ('number' !== typeof id) {
        return callback(new Error('Parameter: id must be number!'));
    }

    var queryString =
        'SELECT news.title, news.article, news.update_time, news.page_view, supervisor.alias ' +
        'FROM news LEFT JOIN supervisor ON news.supervisor_id = supervisor.id ' +
        'WHERE news.id = :id';

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

exports.post    = () => {};

exports.put     = () => {};

exports.delete  = () => {};

exports.view  = (callback, id) => {
    if ('number' !== typeof id) {
        return callback(new Error('Parameter: id must be number!'));
    }

    var queryString = 'UPDATE news SET page_view = page_view + 1 WHERE id = :id';

    database.query(
        queryString,
        { id },
        (err, result) => {
            if (err) {
                callback(err);
            } else if (!result) {
                callback(new Error('No Data!'));
            } else {
                callback(null, result);
            }
        }
    );
};