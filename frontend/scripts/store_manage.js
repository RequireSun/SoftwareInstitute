/**
 * Created by kelvinsun on 2016/5/6.
 */
'use strict';

define([
    'redux',
    'reducer/struct',
    'middleware/struct',
], (Redux, struct, mStruct) => {
    const createStoreWithMiddleware = Redux.applyMiddleware(mStruct)(Redux.createStore);
    const store = createStoreWithMiddleware(Redux.combineReducers({ struct }));
    window['store'] = store;
    return store;
});