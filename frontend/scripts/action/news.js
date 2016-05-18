/**
 * Created by kelvinsun on 2016/5/3.
 */
'use strict';

define({
    listSet (list, count) {
        return {
            type: 'NEWS_LIST_SET',
            list,
            count,
        };
    },
    activeSet ({ id, type = 'category' } = {}) {
        return {
            type: 'NEWS_ACTIVE_SET',
            data: { id, type },
        }
    }
});