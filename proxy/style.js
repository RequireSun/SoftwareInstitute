/**
 * Created by kelvinsun on 2016/4/18.
 */
'use strict';

const fs = require('fs'),
      path = require('path');
const toString        = require('../common/tool').toString,
      hasOwnProperty  = require('../common/tool').hasOwnProperty,
      promiseWrap     = require('../common/tool').promiseWrap,
      promiseWrapTail = require('../common/tool').promiseWrapTail;
const StructCategory  = require('./structCategory').getAll,
      StructOutline   = require('./structOutline').getAll;

const filePath = path.join(__dirname, '../style/main.json');

exports.get = (callback, name) => {
    if ('string' !== typeof name || !name) {
        return callback(new Error('Parameter: name must be string!'));
    }

    new Promise(promiseWrap(exports.getAll)).then(result =>
        !!result[name] ? callback(null, result[name]) : callback(new Error('No such type!'))
    ).catch(err => callback(err));
};

exports.post = (callback, name, style) => {
    if (!name || 'string' !== typeof name) {
        return callback(new Error('Parameter: name must be string!'));
    } else if (!Array.isArray(style)) {
        return callback(new Error('Parameter: style must be array!'));
    }

    let childObject = transformChildObject(style);

    if (!childObject) {
        return callback(new Error('Parameter: style invalid!'));
    }

    return readStyleObject().then(result => {
        if (hasOwnProperty(result, name)) {
            return Promise.reject(new Error('Parameter: duplicate style name!'));
        }
        result[name] = childObject;

        return result;
    }).then(result =>
        writeStyleObject(result)
    ).then(result =>
        callback(null)
    ).catch(err => callback(err));
};

exports.put = (callback, name, style) => {};

exports.delete = (callback, name) => {};

exports.getAll = callback => {
    return readStyleObject().then(result =>
        Promise.all([
            new Promise(promiseWrap(StructCategory)),
            new Promise(promiseWrap(StructOutline)),
        ]).then(results =>
            ({ category: results[0], outline: results[1], style: result })
        )
    ).then(results => {
        const category = results['category'],
            outline  = results['outline'];

        let style      = results['style'],
            categories = {},
            outlines   = {};

        for (let i = 0, item; item = category[i]; ++i) {
            if (isNaN(category[i]['id']) || !category[i]['name']) {
                continue;
            }
            categories[category[i]['id']] = category[i]['name'];
        }
        for (let i = 0, item; item = outline[i]; ++i) {
            if (isNaN(outline[i]['id']) || !outline[i]['name']) {
                continue;
            }
            outlines[outline[i]['id']] = outline[i]['name'];
        }

        for (let i in style) {
            if (hasOwnProperty(style, i)) {
                for (let j = 0, item; item = style[i][j]; ++j) {
                    let name = 'outline' === style[i][j]['type'] ?
                        outlines[style[i][j]['id']] :
                        categories[style[i][j]['id']];
                    !!name ? (style[i][j]['name'] = name) : (delete style[i][j]);
                }
                style[i] = style[i].filter(item => item);
            }
        }

        return callback(null, style);
    }).catch(err => callback(err));
};

exports.putAll = callback => {};

function readStyleObject () {
    return new Promise((resolve, reject) => {
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
    )).then(result => {
        try {
            result = JSON.parse(result);
        } catch (e) {
            return Promise.reject(new Error('Data format error!'));
        }
        return result;
    });
}

function writeStyleObject (saveObj) {
    if ('[object Object]' !== toString(saveObj)) {
        return Promise.reject(new Error('not Object!'));
    }

    saveObj = transformStyleObject(saveObj);

    if (!saveObj) {
        return Promise.reject(new Error('Data format error!'));
    }

    saveObj = JSON.stringify(saveObj);

    return new Promise(promiseWrapTail(
        fs.writeFile,
        filePath,
        saveObj, {
            encoding: 'utf8',
            flag: 'w'
        }
    ));
}

function transformStyleObject (relation) {
    if ('[object Object]' !== toString(relation)) {
        return;
    }

    let relationObject = {};
    
    for (let i in relation) {
        if (hasOwnProperty(relation, i)) {
            let processed = transformChildObject(relation[i]);
            if (!processed) {
                return;
            }
            relationObject[i] = processed;
        }
    }

    return relationObject;
}

function transformChildObject (relation) {
    if ('[object Object]' !== toString(relation)) {
        return;
    }

    let childArray = [];

    for (let i = 0, item; item = relation[i]; ++i) {
        if (isNaN(+relation[i]['id']) || 0 === +relation[i]['id'] || !relation[i]['type']) {
            return;
        }
        childArray.push({ id: +relation[i]['id'], type: relation[i]['type'] });
    }

    return childArray;
}