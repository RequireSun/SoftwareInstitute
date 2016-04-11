/**
 * Created by kelvinsun on 2016/4/11.
 */
'use strict';

let Supervisor = require('../proxy').Supervisor;
let promiseWrap = require('../common/tool').promiseWrap;

exports.ValidateGet = (req, res, next) => {
    let alias   = req.query.alias,
        cipher  = req.query.cipher;

    if (!alias || !cipher) {
        res.jsonErrorParameterMissing('请输入帐号密码！');
        next();
        return;
    }

    new Promise(promiseWrap(Supervisor.validateGet, alias, cipher)).
        then(data => {
            res.jsonSuccess(data);
            next();
        }).catch(err => {
            res.jsonErrorParameterWrong(err['message']);
            next();
        });
};