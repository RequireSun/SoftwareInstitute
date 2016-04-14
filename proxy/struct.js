/**
 * Created by kelvinsun on 2016/4/11.
 */
'use strict';

let category    = require('./structCategory');
let outline     = require('./structOutline');
let database    = require('../common/database');
let hasOwnProperty = require('../common/tool').hasOwnProperty;

exports.categoryGet     = category.get;
exports.categoryPost    = category.post;
exports.categoryPut     = category.put;
exports.categoryDelete  = category.delete;

exports.outlineGet = outline.get;

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
                    // slice = Array.prototype.slice,
                    // hasOwnProperty = function (target) {
                    //     let args = slice.call(arguments, 1);
                    //     return Object.prototype.hasOwnProperty.apply(target, args);
                    // };
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