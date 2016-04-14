/**
 * Created by KelvinSen on 2016/3/17.
 */
'use strict';
let database = require('../common/database');
let hasOwnProperty = require('../common/tool').hasOwnProperty;

exports.get     = (callback, id) => {
    if ('number' !== typeof id) {
        return callback(new Error('Parameter: id must be number!'));
    }

    var queryString =
        'SELECT news.title, news.article, news.update_time, news.page_view, supervisor.alias ' +
        'FROM news LEFT JOIN supervisor ON news.supervisor_id = supervisor.id ' +
        'WHERE news.id = :id AND news.deleted <> TRUE';

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

exports.post    = (callback, detail) => {
    !detail && (detail = {});

    if (isNaN(detail['category_id']) || isNaN(detail['supervisor_id'])) {
        return callback(new Error('Parameter: category_id / supervisor_id must be number!'));
    } else if (!detail['title'] || !detail['article']) {
        return callback(new Error('Parameter: title / article should not be empty!'));
    }

    let queryString =
        'INSERT INTO `news` (`category_id`, `supervisor_id`, `title`, `article`)' +
        'VALUES (:categoryId, :supervisorId, :title, :article)';

    database.query(
        queryString,
        detail,
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

exports.put     = (callback, id, detail) => {
    !detail && (detail = {});

    if (isNaN(id)) {
        return callback(new Error('Parameter: id must be number!'));
    } else if ('' === detail['title'] || '' === detail['article']) {
        return callback(new Error('Parameter: title / article should not be empty string!'));
    }

    let nameMap     = {
        categoryId  : 'category_id',
        supervisorId: 'supervisor_id',
        title       : 'title',
        article     : 'article',
    },
        filterArray = ['categoryId', 'supervisorId', 'title', 'article'],
        queryArray  = [];
    for (let i in detail) {
        if (hasOwnProperty(detail, i)) {
            if (-1 === filterArray.indexOf(i) || !detail[i]) {
                delete detail[i];
            } else {
                queryArray.push(nameMap[i] + ' = :' + i);
            }
        }
    }

    detail['id'] = id;

    let queryString = 'UPDATE `news` SET ' + queryArray.join(',') + ' WHERE `id` = :id';

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

exports.delete  = (callback, id) => {
    if ('number' !== typeof id) {
        return callback(new Error('Parameter: id must be number!'));
    }

    let queryString = 'UPDATE `news` SET deleted = TRUE WHERE id = :id';

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
    )
};

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