/**
 * Created by kelvinsun on 2015/9/28.
 */
'use strict';

requirejs.config({
    baseUrl: '/public/scripts/lib',
    paths: {
        action : '../action',
        middleware: '../middleware',
        reducer: '../reducer',
        view   : '../view_manage',
        common : '../common',
        network: '../network',
        root   : '..'
    },
    shim: {
       bootstrap: ['jquery'],
    },
});

requirejs([
    'react-dom',
    'root/router_manage',
    'bootstrap',
], (ReactDOM, routes) => {
    ReactDOM.render(routes, document.getElementById('content') || document.body);
});
