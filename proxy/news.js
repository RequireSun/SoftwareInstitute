'use strict';
let detail      = require('./newsDetail');
let aggregate   = require('./newsAggregate');

module.exports = Object.assign({}, aggregate, detail);

// exports.getStyleCategory = function (categoryType, callback) {
//     if ('string' !== typeof categoryType || 0 === categoryType.length) {
//         return callback(new Error('Parameter: categoryType must be string!'));
//     }
//
//     var queryString = 'SELECT style.name AS style_name, category.id AS category_id, category.name AS category_name ' +
//         'FROM style_type LEFT JOIN style ON style_type.id = style.type_id ' +
//         'LEFT JOIN style_relation ON style.id = style_relation.style_id ' +
//         'LEFT JOIN category ON category.id = style_relation.category_id ' +
//         'WHERE style_type.name = :categoryType';
//
//     database.query(queryString, {
//         categoryType: categoryType
//     }, function (err, result) {
//         if (err) {
//             return callback(err);
//         }
//
//         var styleCategory = {},
//             hasOwnProperty = Object.hasOwnProperty.bind(styleCategory),
//             tempResult;
//         for (var i = 0, l = result.length; i < l; ++i) {
//             tempResult = result[i];
//             if (!hasOwnProperty(tempResult.style_name)) {
//                 styleCategory[tempResult.style_name] = {};
//             }
//             if (tempResult.category_id) {
//                 styleCategory[tempResult.style_name][tempResult.category_id] = tempResult.category_name;
//             }
//         }
//         return callback(null, styleCategory);
//     });
// };

// exports.getStyleOutline = function (outlineType, callback) {
//     if ('string' !== typeof outlineType || 0 === outlineType.length) {
//         return callback(new Error('Parameter: outlineType must be string!'));
//     }
//
//     var queryString = 'SELECT style.name AS style_name, outline.id AS outline_id, outline.name AS outline_name ' +
//         'FROM style_type LEFT JOIN style ON style_type.id = style.type_id ' +
//         'LEFT JOIN style_relation ON style.id = style_relation.style_id ' +
//         'LEFT JOIN outline ON outline.id = style_relation.outline_id ' +
//         'WHERE style_type.name = :outlineType';
//
//     database.query(queryString, {
//         outlineType: outlineType
//     }, function (err, result) {
//         if (err) {
//             return callback(err);
//         }
//
//         var styleOutline = {},
//             hasOwnProperty = Object.hasOwnProperty.bind(styleOutline),
//             tempResult;
//         for (var i = 0, l = result.length; i < l; ++i) {
//             tempResult = result[i];
//             if (!hasOwnProperty(tempResult.style_name)) {
//                 styleOutline[tempResult.style_name] = {};
//             }
//             if (tempResult.outline_id) {
//                 styleOutline[tempResult.style_name][tempResult.outline_id] = tempResult.outline_name;
//             }
//         }
//         return callback(null, styleOutline);
//     });
// };