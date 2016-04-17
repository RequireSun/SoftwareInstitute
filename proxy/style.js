/**
 * Created by kelvinsun on 2016/4/18.
 */
'use strict';

const fs = require('fs'),
      path = require('path');
const promiseWrapTail = require('../common/tool').promiseWrapTail;

exports.get = (callback, name) => {
    if ('string' !== typeof name || !name) {
        return callback(new Error('Parameter: name must be string!'));
    }
    const filePath = path.join(__dirname, '../style/main.json');

    new Promise((resolve, reject) => {
        fs.exists(filePath, exists => {
            if (!exists) {
                fs.writeFile(filePath, '', {
                    encoding: 'utf-8',
                    flag    : 'w',
                }, err => {
                    if (err) {
                        reject('Create file failed!');
                    } else {
                        resolve();
                    }
                });
            } else {
                resolve();
            }
        });
    }).then(() => new Promise(promiseWrapTail(
        fs.readFile,
        filePath, {
            encoding: 'utf-8',
            flag    : 'r',
        })
    )).then(result =>
        callback(null, result)
    ).catch(err => callback(err));

};

exports.post = (callback, name, style) => {};

exports.put = (callback, name, style) => {};

exports.delete = (callback, name) => {};

exports.getAll = callback => {};

exports.putAll = callback => {};