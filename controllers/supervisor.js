/**
 * Created by kelvin on 15-8-2.
 */

var Supervisor = require('../proxy').Supervisor;

exports.login = function (req, res, next) {
    res.render('supervisor/login');
    return next();
};

exports.validate = function (req, res, next) {
    var alias = req.body.alias;
    var cipher = req.body.cipher;

    if (!alias || !cipher) {
        res.render404('用户名和密码不能为空！');
        return next();
    }

    Supervisor.validateSupervisor(alias, cipher, function (err, result) {
        if (err) {
            return next(err);
        }
        if (result) {
            res.send('success!');
            return next();
        } else {
            res.send('failed!');
            return next();
        }
    });
};
