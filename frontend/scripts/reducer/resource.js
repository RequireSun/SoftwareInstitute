/**
 * Created by kelvinsun on 2016/5/4.
 */
'use strict';

define(['immutable'], Immutable => (state = { list: Immutable.List(), count: 0, }, action) => {
    switch (action.type) {
        case 'RESOURCE_LIST_SET':
            const { list, count } = action;
            return { list: Immutable.fromJS(list), count, };
        default:
            return state;
    }
});