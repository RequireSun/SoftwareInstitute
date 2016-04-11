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
        res.json({ code: 1001, error: '请输入帐号密码！' });
        next();
        return;
    }

    new Promise(promiseWrap(Supervisor.validateGet, alias, cipher)).
        then(data => {
            if (!data) {
                res.json({ code: 1101, error: '验证失败！' });
                next();
            } else {
                res.json(data);
                next();
            }
        }).catch(err => {
            res.json({ code: 1001, error: err['message'] });
            next();
        });
};