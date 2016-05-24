/**
 * Created by kelvinsun on 2016/5/3.
 */
'use strict';

define({
    detailSet (detail) {
        return {
            type: 'NEWS_DETAIL_SET',
            detail,
        };
    },
    detailClear () {
        return {
            type: 'NEWS_DETAIL_CLEAR',
        };
    }
});