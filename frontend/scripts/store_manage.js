/**
 * Created by kelvinsun on 2016/5/6.
 */
'use strict';

define([
    'redux',
    'reducer/struct',
], (Redux, struct) => {
    const store = Redux.createStore(Redux.combineReducers({ struct }));
    window['store'] = store;
    return store;
});