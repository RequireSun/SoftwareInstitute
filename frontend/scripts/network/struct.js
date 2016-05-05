/**
 * Created by kelvinsun on 2016/5/6.
 */
'use strict';

define(['common/util'], util => {
    const getAll = callback =>
        util.ajaxWrap(callback, {
            url     : '/api/struct',
            method  : 'GET',
            dataType: 'json',
        });

    const categoryGetAll = callback =>
        util.ajaxWrap(callback, {
            url     : 'api/categoryAll',
            method  : 'GET',
            dataType: 'json',
        });

    const outlineGetAll = callback =>
        util.ajaxWrap(callback, {
            url     : 'api/outlineAll',
            method  : 'GET',
            dataType: 'json',
        });

    return {
        getAll,
        categoryGetAll,
        outlineGetAll,
    };
});
