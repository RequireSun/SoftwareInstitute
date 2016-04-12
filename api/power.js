/**
 * Created by kelvinsun on 2016/4/13.
 */
'use strict';

let promiseWrap = require('../common/tool').promiseWrap;
let PowerError = require('../common/error').PowerError;
let Power = require('../proxy/power');

exports.validate = (req, res, next) => {
    if (!req.session || !req.session.uid) {
        res.jsonErrorNoLogin();
    } else {
        new Promise(promiseWrap(Power.validate, +req.session.uid)).
        then(power => power ? next() : res.jsonErrorNoPower()).
        catch(err => res.jsonErrorNoPower());
    }
};
