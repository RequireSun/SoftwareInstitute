/**
 * Created by kelvinsun on 2015/8/5.
 */
requirejs.config({
    baseUrl: '/public/scripts/lib',
    paths: {
        action : '../action',
        reducer: '../reducer',
        view   : '../view',
        common : '../common',
        root   : '..'
    },
    shim: {
        bootstrap: ['jquery']
    }
});

requirejs([
    'react-dom',
    'root/web_router',
    'bootstrap'
], (ReactDOM, routes) => {
    ReactDOM.render(routes, document.getElementById('content') || document.body);
});
