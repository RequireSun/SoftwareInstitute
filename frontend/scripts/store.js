/**
 * Created by kelvinsun on 2016/4/27.
 */
'use strict';

define([
    'redux',
    'reducer/style',
    'reducer/struct',
    'reducer/detail',
    'reducer/news',
    'reducer/resource',
], (Redux, style, struct, detail, news, resource) => {
    const store = Redux.createStore(Redux.combineReducers({ style, struct, detail, news, resource }));
    window['store'] = store;
    return store;
});