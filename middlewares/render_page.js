exports.errorPage = function (req, res, next) {
    // 404 页面
    res.render404 = function (error) {
        return res.status(404).render('notify/notify', { error: error});
    };
    // 报错页面
    res.renderError = function (error, statusCode) {
        if (undefined === statusCode) {
            statusCode = 400;
        }
        return res.status(statusCode).render('notify/notify', { error: error} );
    };

    next();
};