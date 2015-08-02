/**
 * Created by kelvin on 15-8-2.
 */

var Supervisor = require('../proxy').Supervisor;

exports.login = function (req, res, next) {
    return res.render('supervisor/login');
};

exports.validate = function (req, res, next) {
    var alias = req.body.alias;
    var cipher = req.body.cipher;

    if (!alias || !cipher) {
        return res.render404('用户名和密码不能为空！');
    }

    Supervisor.validateSupervisor(alias, cipher, function (err, result) {
        if (err) {
            return next(err);
        }
        if (result) {
            return res.send('success!');
        } else {
            return res.send('failed!');
        }
    });
};
