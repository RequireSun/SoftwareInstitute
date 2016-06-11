/**
 * Created by kelvinsun on 2016/6/12.
 */

'use strict';

define(['common/util'], util => {
    const newsCategory = callback =>
        util.ajaxWrap(callback, {
            url     : 'api/newsCategory',
            method  : 'GET',
            dataType: 'json',
        });

    const newsOutline = callback =>
        util.ajaxWrap(callback, {
            url     : 'api/newsOutline',
            method  : 'GET',
            dataType: 'json',
        });

    return {
        newsCategory,
        newsOutline,
    };
});