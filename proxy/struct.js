/**
 * Created by kelvinsun on 2016/4/11.
 */
'use strict';

let async       = require('async');
let category    = require('./structCategory');
let outline     = require('./structOutline');
let database    = require('../common/database');
let toString    = require('../common/tool').toString;
let hasOwnProperty = require('../common/tool').hasOwnProperty;
let promiseWrap = require('../common/tool').promiseWrap;
let promiseWrapTail = require('../common/tool').promiseWrapTail;
let formatInsertParameters = require('../common/tool').formatInsertParameters;

exports.categoryGet     = category.get;
exports.categoryPost    = category.post;
exports.categoryPut     = category.put;
exports.categoryDelete  = category.delete;
exports.categoryGetAll  = category.getAll;

exports.outlineGet      = outline.get;
exports.outlinePost     = outline.post;
exports.outlinePut      = outline.put;
exports.outlineDelete   = outline.delete;
exports.outlineGetAll   = outline.getAll;

exports.get = callback => {
    var queryString =
        'SELECT outline.id AS id, outline.name AS name, category.id AS category_id, category.name AS category_name ' +
        'FROM outline LEFT JOIN category ON category.outline_id = outline.id';

    database.query(
        queryString,
        (err, result) => {
            if (err) {
                callback(err);
            } else if (!result) {
                callback(new Error('No Data!'));
            } else {
                let processed = {};
                for (let i = 0, item; item = result[i]; ++i) {
                    if (undefined !== item['id']) {
                        if (!hasOwnProperty(processed, item['id'])) {
                            processed[item['id']] = { id: item['id'], name: item['name'], categories: [] };
                        }
                        processed[item['id']]['categories'].push({ id: item['category_id'], name: item['category_name'] });
                    }
                }
                callback(null, processed);
            }
        }
    );
};

exports.put = (callback, relation) => {
    let processed = transformRelationObject(relation);

    if (!processed) {
        return callback(new Error('Input wrong struct!'));
    }

    let outlineArray  = processed['outlineArray'],
        categoryArray = processed['categoryArray'];

    let outlineMap = {
        id  : 'id',
        name: 'name',
    }, categoryMap = {
        id       : 'id',
        name     : 'name',
        outlineId: 'outline_id',
    };

    outlineArray = outlineArray.map(item => formatInsertParameters(item, outlineMap));
    categoryArray = categoryArray.map(item => formatInsertParameters(item, categoryMap));

    outlineArray = outlineArray.map(item => ({
        queryArrayDeclare: item['queryArrayDeclare'].join(','),
        queryArrayValue: item['queryArrayValue'].map(str => ':' + str).join(','),
        processedParams: item['processedParams'],
    }));

    categoryArray = categoryArray.map(item => ({
        queryArrayDeclare: item['queryArrayDeclare'].join(','),
        queryArrayValue: item['queryArrayValue'].map(str => ':' + str).join(','),
        processedParams: item['processedParams'],
    }));
    // 获取 connection
    database.getConnection((err, connection) => {
        if (err) {
            return callback(new Error('Connection get failed!'));
        }
        // 开始事务
        connection.beginTransaction(err => {
            if (err) {
                return callback(new Error('Transaction start failed!'));
            }
            // 数据库操作
            Promise.all([
                // 清空两个表
                new Promise(promiseWrapTail(connection.query, 'DELETE FROM `outline`')),
                new Promise(promiseWrapTail(connection.query, 'DELETE FROM `category`')),
            ]).then(new Promise(promiseWrap((cb) => {
                // 插入 outline
                async.everyLimit(outlineArray, 5, (item, cbk) => {
                    connection.query(
                        'INSERT INTO `outline` (' +
                        item['queryArrayDeclare'] +
                        ') VALUES (' +
                        item['queryArrayValue'] +
                        ')',
                        item['processedParams'],
                        (err, result) => {
                            if (err) {
                                cbk(err);
                            } else if (!result || !result['affectedRows']) {
                                cbk(null, false);
                            } else {
                                cbk(true);
                            }
                        }
                    );
                }, (err, result) => {
                    if (err || !result) {
                        cb(new Error('Outline error!'));
                    } else {
                        cb(null, true);
                    }
                });
            }))).then(new Promise(promiseWrap(cb => {
                // 插入 category
                async.everyLimit(categoryArray, 5, (item, cbk) => {
                    connection.query(
                        'INSERT INTO `category` (' +
                        item['queryArrayDeclare'] +
                        ') VALUES (' +
                        item['queryArrayValue'] +
                        ')',
                        item['processedParams'],
                        (err, result) => {
                            if (err) {
                                cbk(err);
                            } else if (!result || !result['affectedRows']) {
                                cbk(null, false);
                            } else {
                                cbk(true);
                            }
                        }
                    );
                }, (err, result) => {
                    if (err || !result) {
                        cb(new Error('Outline error!'));
                    } else {
                        cb(null, true);
                    }
                });
            }))).then(new Promise(promiseWrap(cb => {
                // 提交事务
                connection.commit(err => { if (err) { cb(err); } else { connection.release(); callback(null); } })
            }))).catch(err =>
                // 错误回滚
                connection.rollback(err => {
                    connection.release();
                    callback(err);
                })
            );
        });
    });
};

function transformRelationObject (relation) {
    if ('[object Object]' !== toString(relation)) {
        return;
    }

    let outlineArray = [], categoryArray = [];

    for (let i in relation) {
        if (hasOwnProperty(relation, i)) {
            if (isNaN(+relation[i]['id']) || 0 === +relation[i]['id'] || !relation[i]['name']) {
                return;
            }
            outlineArray.push({ id: +relation[i]['id'], name: relation[i]['name'] });
            if ('[object Array]' === toString(relation[i]['categories'])) {
                for (let j = 0, item; item = relation[i]['categories'][j]; ++j) {
                    if (isNaN(+item['id']) || 0 === +item['id'] || !item['name']) {
                        return;
                    } else {
                        categoryArray.push({ id: +item['id'], name: item['name'], outlineId: relation[i]['id'] });
                    }
                }
            }
        }
    }

    return { outlineArray, categoryArray };
}