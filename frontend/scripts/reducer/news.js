/**
 * Created by kelvinsun on 2016/5/2.
 */
'use strict';

define(['immutable'], Immutable => (state = { list: Immutable.List(), count: 0, }, action) => {
    switch (action.type) {
        case 'NEWS_LIST_SET':
            const { list, count } = action;
            return { list, count, };
        // case 'NEWS_LIST_GET':
        //     return {};
        default:
            return state;
    }
});