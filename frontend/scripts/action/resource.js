/**
 * Created by kelvinsun on 2016/5/3.
 */
'use strict';

define({
    listSet (list, count) {
        return {
            type: 'RESOURCE_LIST_SET',
            list,
            count,
        };
    }
});