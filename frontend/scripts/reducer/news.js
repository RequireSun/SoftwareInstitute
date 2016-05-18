/**
 * Created by kelvinsun on 2016/5/2.
 */
'use strict';

define([
    'immutable'
], Immutable => (state = {
    active: undefined,
    type  : 'category',
    list  : Immutable.List(),
    count : 0,
}, action) => {
    switch (action.type) {
        case 'NEWS_LIST_SET':
            const { list, count } = action;
            return { list, count, };
        case 'NEWS_ACTIVE_SET':
            const { id, type } = action['data'];
            if (!id && 0 != id) {
                state = {
                    active: undefined,
                    type,
                };
            } else {
                state = {
                    active: id,
                    type,
                }
            }

            return state;
        // case 'NEWS_LIST_GET':
        //     return {};
        default:
            return state;
    }
});