/**
 * Created by kelvin on 15-8-8.
 */
define(['jquery'], function ($) {
    /**
     * 将给定的网址对象转化为字符串
     * @param   {object}    inConfig    各项配置, 记录网址信息
     * @returns {string}                拼接好的网址字符串
     */
    function joinUrl(inConfig) {
        var config = {
            protocol: location.protocol || 'http',
            host: location.host,
            path: ''
        };
        $.extend(config, inConfig);
        return config.protocol + '://' + config.host + config.path;
    }

    /**
     * 自定义的错误信息, 将错误编号转化为更友好的字符串
     * @param   {function}  callback    第一个参数接收生成的字符串的 callback
     * @param   {number}    xhrStatus   jquery 返回的 xhr 错误信息
     * @param   {string}    errContent  jquery 返回的原本的错误信息
     * @returns {void}
     */
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