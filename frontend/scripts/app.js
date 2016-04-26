/**
 * Created by kelvinsun on 2015/8/5.
 */
requirejs.config({
    baseUrl: '/public/scripts/lib',
    paths: {
        action: '../action',
        common: '../common',
        view: '../view',
        root: '..'
    },
    shim: {
        bootstrap: ['jquery']
    }
});

requirejs(['react', 'react-dom', 'ReactRouter', 'jquery', 'root/web_router', 'bootstrap'], function (React, ReactDOM, Router, jquery, routes) {
    ReactDOM.render(routes, document.getElementById('content'));
    // Router.run(routes, Router.HashLocation, function (Handler) {
    //     React.render(React.createElement(Handler), jquery('#content')[0]);
    // });
});
