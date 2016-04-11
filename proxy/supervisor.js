/**
 * Created by kelvin on 15-8-2.
 */
'use strict';

const database = require('../common/database');
const crypto = require('crypto');

exports.validateGet = (callback, alias, cipher) => {
    if (!alias || !cipher) {
        callback(new Error('Parameter: alias / cipher must be provided!'));
        next();
        return;
    }

    let queryString = 'SELECT * FROM supervisor WHERE alias = :alias';

    database.query(queryString, {
        alias,
    }, (err, result) => {
        if (err) {
            callback(err);
        } else if (!result) {
            callback(null, false);
        } else {
            let shaHash = crypto.createHash('sha1');
            shaHash.update(cipher);
            shaHash.update(result[0]['salt']);

            callback(null, shaHash.digest('hex') === result[0]['cipher'] && result[0]['id']);
        }
    });
};

exports.loginGet = (callback, alias, cipher) => {
    this.validateGet((err, data) => {
        if (err) {
            callback(err);
        } else {
            if (!data) {
                // session.destroy();
                callback(null, false);
            } else {
                // session.id = data;
                callback(null, data);
            }
        }
    }, alias, cipher);
};