/**
 * Created by kelvinsun on 2016/5/2.
 */
'use strict';

define([], () => (state = { list: [], count: 0, }, action) => {
    switch (action.type) {
        case 'NEWS_LIST_SET':
            const { list, count } = action;
            return { list, count, };
        default:
            return state;
    }
});