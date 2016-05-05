/**
 * Created by kelvinsun on 2016/5/4.
 */
'use strict';

define([], () => (state = { category: {}, outline: {}, }, action) => {
    switch (action.type) {
        case 'STRUCT_INIT':
            const { category, outline, all } = action;
            let result = {};
            !!category && (result['category'] = category);
            !!outline  && (result['outline']  = outline);
            !!all      && (result['all']      = all);
            return result;
        default:
            return state;
    }
});