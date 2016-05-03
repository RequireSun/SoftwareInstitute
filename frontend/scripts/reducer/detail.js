/**
 * Created by kelvinsun on 2016/5/2.
 */
'use strict';

define([], () => (state = { id: 0, title: '', article: '', supervisor_name: '', page_view: 0, update_time: 0 }, action) => {
    switch (action.type) {
        case 'NEWS_DETAIL_SET':
            // const { title, article, supervisor_name, update_time } = action.detail;
            return Object.assign({}, state, action.detail);
        default:
            return state;
    }
});