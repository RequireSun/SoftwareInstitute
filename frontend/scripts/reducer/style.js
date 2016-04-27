/**
 * Created by kelvinsun on 2016/4/27.
 */
'use strict';

define([], () => (state = {}, action) => {
    switch (action.type) {
        case 'STYLE_INIT':
            return Object.assign({}, action.style);
        default:
            return state;
    }
});