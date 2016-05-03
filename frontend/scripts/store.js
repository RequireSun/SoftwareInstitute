/**
 * Created by kelvinsun on 2016/4/27.
 */
'use strict';

define(['redux', 'reducer/style', 'reducer/news', 'reducer/resource'], (Redux, style, news, resource) => {
    const store = Redux.createStore(Redux.combineReducers({ style, news, resource }));
    window['store'] = store;
    return store;
});