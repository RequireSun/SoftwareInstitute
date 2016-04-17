/**
 * Created by kelvinsun on 2016/4/18.
 */

const fs = require('fs');

exports.get = (callback, name) => {
    if ('string' !== typeof name || !name) {
        return callback(new Error('Parameter: name must be string!'));
    }

    fs.readFile('../style/main.json', {
        encoding: 'utf-8',
        flag    : 'r',
    }, (err, data) => {
        if (err) { callback(err); } else { callback(null, data); }
    });
};

exports.post = (callback, name, style) => {};

exports.put = (callback, name, style) => {};

exports.delete = (callback, name) => {};

exports.getAll = callback => {};

exports.putAll = callback => {};