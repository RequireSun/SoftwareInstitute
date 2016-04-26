/**
 * Created by kelvinsun on 2016/4/13.
 */
'use strict';

let database = require('../common/database');

exports.validate = (callback, uid) => {
    if ('number' !== typeof uid) {
        return callback(new Error('Parameter: id must be number!'));
    }

    let queryString = 'SELECT power FROM supervisor WHERE id = :uid AND power = 1';

    database.query(
        queryString,
        { uid },
        (err, result) => {
            if (err) {
                callback(err);
            } else if (!result || !result.length) {
                callback(new Error('No such user!'));
            } else {
                callback(null, result[0]['power']);
            }
        }
    )
};