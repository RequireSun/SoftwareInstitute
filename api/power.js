/**
 * Created by kelvinsun on 2016/4/13.
 */
'use strict';

let promiseWrap = require('../common/tool').promiseWrap;
let Power = require('../proxy/power');

exports.validate = (req, res, next) => {
    new Promise(promiseWrap(Power.validate, +req.query.uid)).then(data => {res.write(data);next()});

};
