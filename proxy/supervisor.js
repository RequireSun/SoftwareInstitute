/**
 * Created by kelvin on 15-8-2.
 */

var database = require('../common/database');
var crypto = require('crypto');

exports.validateSupervisor = function (alias, cipher, callback) {
    if (!alias || !cipher) {
        return callback(new Error('Parameter: pageSize / pageRequest must be number!'));
    }

    var queryString = 'SELECT * FROM supervisor WHERE alias = :alias';

    database.query(queryString, {
        alias: alias
    }, function (err, result) {
        if (err) {
            return callback(err);
        } else if (!result) {
            return callback(new Error('No data!'));
        }

        var shaHash = crypto.createHash('sha1');
        shaHash.update(cipher);
        shaHash.update(result[0].salt);

        return callback(null, shaHash.digest('hex') === result[0].cipher);
    });
};