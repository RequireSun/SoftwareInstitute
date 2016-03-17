/**
 * Created by KelvinSen on 2016/3/17.
 */
'use strict';
let database = require('../common/database');

exports.get     = (callback, newsId) => {
    if ('number' !== typeof newsId) {
        return callback(new Error('Parameter: newsId must be number!'));
    }

    var queryString =
        'SELECT news.title, news.article, news.update_time, news.page_view, supervisor.alias ' +
        'FROM news INNER JOIN supervisor ON news.supervisor_id = supervisor.id ' +
        'WHERE news.id = :newsId';

    database.query(
        queryString,
        { newsId },
        (err, result) => {
            if (err) {
                callback(err);
            } else if (!result) {
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

exports.updatePageView  = (callback, newsId) => {
    if ('number' !== typeof newsId) {
        return callback(new Error('Parameter: newsId must be number!'));
    }

    var queryString = 'UPDATE news SET page_view = page_view + 1 WHERE id = :newsId';

    database.query(
        queryString,
        { newsId },
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