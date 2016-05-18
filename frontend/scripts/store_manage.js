/**
 * Created by kelvinsun on 2016/5/6.
 */
'use strict';

define([
    'redux',
    'reducer/struct',
    'reducer/news',
    'middleware/struct',
], (Redux, struct, news, mStruct) => {
    const createStoreWithMiddleware = Redux.applyMiddleware(mStruct)(Redux.createStore);
    const store = createStoreWithMiddleware(Redux.combineReducers({ struct, news }));
    window['store'] = store;
    return store;
});