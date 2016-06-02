/**
 * Created by kelvinsun on 2016/6/2.
 */
'use strict';

define(['common/util'], util => ({
    getAll (callback) {
        return util.ajaxWrap(callback, {
            url     : '/api/styleAll',
            method  : 'GET',
            dataType: 'json',
        });
    }
}));