/**
 * Created by kelvinsun on 2016/4/27.
 */
'use strict';

define(['redux', 'reducer/style', 'reducer/news'], (Redux, style, news) => {
    const store = Redux.createStore(Redux.combineReducers({ style, news }));
    window['store'] = store;
    return store;
});