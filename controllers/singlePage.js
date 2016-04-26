/**
 * Created by kelvinsun on 2016/4/26.
 */
'use strict';
const Style = require('../proxy').Style;
const promiseWrap = require('../common/tool').promiseWrap;
// TODO require 形式
module.exports = (req, res, next) => {
    // Style.getAll;
    new Promise(promiseWrap(Style.getAll)).
        then(result => {
            res.render('index', {
                style: result,
            });
            next();
        });
};