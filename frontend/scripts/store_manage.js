/**
 * Created by kelvinsun on 2016/5/6.
 */
'use strict';

define([
    'redux',
    'reducer/struct',
    'reducer/news',
    'reducer/detail',
    'reducer/resource',
    'middleware/struct',
], (Redux, struct, news, detail, resource, mStruct) => {
    const createStoreWithMiddleware = Redux.applyMiddleware(mStruct)(Redux.createStore);
    const store = createStoreWithMiddleware(Redux.combineReducers({ struct, news, detail, resource }));
    window['store'] = store;
    return store;
});