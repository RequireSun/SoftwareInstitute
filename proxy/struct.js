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
    const queryString =
          'SELECT outline.id AS id, outline.name AS name, category.id AS category_id, category.name AS category_name ' +
          'FROM outline LEFT JOIN category ON category.outline_id = outline.id',
          queryStringEmpty =
          'SELECT id AS category_id, name AS category_name FROM `category` WHERE outline_id IS NULL';

    return Promise.all([
        new Promise(promiseWrapTail(database.query.bind(database), queryString)),
        new Promise(promiseWrapTail(database.query.bind(database), queryStringEmpty)),
    ]).then(([relation, standAlone]) => {
        let processed = {};
        if (!!relation && Array.isArray(relation) && !!relation.length) {
            relation.forEach(({ id, name, category_id, category_name }) => {
                if (undefined !== id) {
                    if (!hasOwnProperty(processed, id)) {
                        processed[id] = { id, name, categories: [] };
                    }
                    if (!!category_id && !!category_name) {
                        processed[id]['categories'].push({ id: category_id, name: category_name });
                    }
                }
            });
        }
        if (!!standAlone && Array.isArray(standAlone) && !!standAlone.length) {
            processed[0] = { id: 0, name: '未分组', categories: [] };
            standAlone.forEach(({ category_id, category_name }) => {
                if (!!category_id && !!category_name) {
                    processed[0]['categories'].push({ id: category_id, name: category_name });
                }
            });
        }
        return callback(null, processed);
    }, err => callback(err));

    // database.query(
    //     queryString,
    //     (err, result) => {
    //         if (err) {
    //             callback(err);
    //         } else if (!result) {
    //             callback(new Error('No Data!'));
    //         } else {
    //             let processed = {};
    //             for (let i = 0, item; item = result[i]; ++i) {
    //                 if (undefined !== item['id']) {
    //                     if (!hasOwnProperty(processed, item['id'])) {
    //                         processed[item['id']] = { id: item['id'], name: item['name'], categories: [] };
    //                     }
    //                     if (!!item['category_id'] && !!item['category_name']) {
    //                         processed[item['id']]['categories'].push({ id: item['category_id'], name: item['category_name'] });
    //                     }
    //                 }
    //             }
    //             callback(null, processed);
    //         }
    //     }
    // );
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
        // 参数
        queryArrayDeclare: item['queryArrayDeclare'].join(','),
        // value 替换
        queryArrayValue: item['queryArrayValue'].map(str => ':' + str).join(','),
        // 参数
        processedParams: item['processedParams'],
    }));

    categoryArray = categoryArray.map(item => ({
        // 参数
        queryArrayDeclare: item['queryArrayDeclare'].join(','),
        // value 替换
        queryArrayValue: item['queryArrayValue'].map(str => ':' + str).join(','),
        // 参数
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
                new Promise(promiseWrapTail(connection.query.bind(connection), 'DELETE FROM `outline`')),
                new Promise(promiseWrapTail(connection.query.bind(connection), 'DELETE FROM `category`')),
            ]).then(results => new Promise(promiseWrap((cb) => {
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
                                cbk(true);
                            } else {
                                cbk(null, true);
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
            }))).then(result => new Promise(promiseWrap(cb => {
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
                                cbk(true);
                            } else {
                                cbk(null, true);
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
            }))).then(result => new Promise(promiseWrap(cb => {
                // 提交事务
                connection.commit(err => {
                    if (err) {
                        cb(err);
                    } else {
                        connection.release();
                        callback(null);
                    }
                })
            }))).catch(err =>
                // 错误回滚
                {
                    console.log(1, err);
                    return connection.rollback(err => {
                    connection.release();
                    callback(err);
                })}
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
                        console.log(isNaN(+item['id']), 0 === +item['id'], item['name']);
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