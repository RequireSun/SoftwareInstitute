/**
 * Created by kelvinsun on 2015/9/28.
 */
requirejs.config({
    baseUrl: '/public/scripts/lib',
    paths: {
        action : '../action',
        reducer: '../reducer_manage',
        view   : '../view_manage',
        common : '../common',
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
