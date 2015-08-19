/**
 * Created by kelvin on 15-8-8.
 */
define(['jquery'], function ($) {
    // 将给定的网址对象转化为字符串
    function joinUrl(inConfig) {
        var config = {
            protocol: location.protocol || 'http:',
            host: location.host,
            path: ''
        };
        $.extend(config, inConfig);
        return config.protocol + '//' + config.host + config.path;
    }

    // 自定义的错误信息
    function errorToContent (callback, xhrStatus, errContent) {
        switch (xhrStatus) {
            case 404:
                errContent = '喔，你发现了一个新的页面！(error code: 404)';
                break;
        }
        callback(errContent);
    }

    return {
        joinUrl: joinUrl,
        errorToContent: errorToContent
    };
});