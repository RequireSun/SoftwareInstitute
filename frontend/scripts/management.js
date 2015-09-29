/**
 * Created by kelvinsun on 2015/9/28.
 */
requirejs.config({
    baseUrl: 'scripts/lib',
    paths: {
        action: '../action',
        common: '../common',
        view: '../viewMgr',
        root: '..'
    },
    //shim: {
    //    bootstrap: ['jquery']
    //}
});

requirejs(['react', 'ReactRouter', 'jquery', 'root/mgr_router'/*, 'bootstrap'*/], function (React, Router, jquery, routes) {
    Router.run(routes, Router.HashLocation, function (Handler) {
        React.render(React.createElement(Handler), jquery('#content')[0]);
    });
});
