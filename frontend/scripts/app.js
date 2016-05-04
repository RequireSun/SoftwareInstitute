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
// TODO 搜索
// TODO 页面路由补全
requirejs([
    'react-dom',
    'root/router',
    'bootstrap'
], (ReactDOM, routes) => {
    ReactDOM.render(routes, document.getElementById('content') || document.body);
});
