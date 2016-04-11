/**
 * Created by kelvinsun on 2016/4/11.
 */
'use strict';

const Supervisor = require('../proxy').Supervisor;
const promiseWrap = require('../common/tool').promiseWrap;

// exports.ValidateGet = (req, res, next) => {
//     let alias   = req.query.alias,
//         cipher  = req.query.cipher;
//
//     if (!alias || !cipher) {
//         res.jsonErrorParameterMissing('请输入帐号密码！');
//         next();
//         return;
//     }
//
//     new Promise(promiseWrap(Supervisor.validateGet, alias, cipher)).
//         then(data => {
//             res.jsonSuccess(data);
//             next();
//         }).catch(err => {
//             res.jsonErrorParameterWrong(err['message']);
//             next();
//         });
// };

exports.LoginGet = (req, res, next) => {
    let alias   = req.query.alias,
        cipher  = req.query.cipher;

    if (!alias || !cipher) {
        res.jsonErrorParameterMissing('请输入帐号密码！');
        next();
        return;
    }

    new Promise(promiseWrap(Supervisor.loginGet, alias, cipher)).
    then(data => {
        if (!data) {
            req.session.destroy(err => { if (err) { throw err; } });
            res.jsonErrorNoLogin(false);
            next();
        } else {
            req.session.uid = data;
            res.jsonSuccess(true);
            next();
        }
    }).catch(err => {
        res.jsonErrorParameterWrong(err['message']);
        next();
    });
};

exports.ValidateGet = (req, res, next) => {
    (req.session && req.session.uid) ? res.jsonSuccess(true) : res.jsonErrorNoLogin(false);
    next();
};