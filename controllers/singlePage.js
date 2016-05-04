/**
 * Created by kelvinsun on 2016/4/26.
 */
'use strict';
const Style       = require('../proxy').Style;
const Struct      = require('../proxy').Struct;
const promiseWrap = require('../common/tool').promiseWrap;
// TODO require 形式
module.exports = (req, res, next) => {
    // Style.getAll;
    Promise.all([
        new Promise(promiseWrap(Style.getAll)),
        new Promise(promiseWrap(Struct.categoryGetAll)),
        new Promise(promiseWrap(Struct.outlineGetAll)),
    ]).then(([style, category, outline]) => {
        res.render('index', {
            style,
            category,
            outline,
        });
        next();
    });
};