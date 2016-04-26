/**
 * Created by kelvinsun on 2016/4/27.
 */
'use strict';

define(['redux', 'reducer/style'], (Redux, style) => {
    const store = Redux.createStore(Redux.combineReducers({ style }));
    window['store'] = store;
    return store;
});