/**
 * Created by kelvinsun on 2016/5/4.
 */
'use strict';

define([], () => (state = { category: {}, outline: {}, }, action) => {
    switch (action.type) {
        case 'STRUCT_INIT':
            const { category, outline } = action;
            return { category, outline };
        default:
            return state;
    }
});