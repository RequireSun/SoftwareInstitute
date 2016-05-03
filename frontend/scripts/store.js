/**
 * Created by kelvinsun on 2016/4/27.
 */
'use strict';

define([
    'redux',
    'reducer/style',
    'reducer/detail',
    'reducer/news',
    'reducer/resource'
], (Redux, style, detail, news, resource) => {
    const store = Redux.createStore(Redux.combineReducers({ style, detail, news, resource }));
    window['store'] = store;
    return store;
});