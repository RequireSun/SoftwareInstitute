/**
 * Created by kelvinsun on 2015/10/23.
 */
'use strict';

define(['jquery'], function ($) {
    // 事件队列
    var _events = {};
    /**
     * 事件绑定
     * @param type      事件名
     * @param callback  事件处理函数
     * @param context   处理时的上下文
     * @param namespace 命名空间, 防止误删用
     */
    function on (type, callback, context = null, namespace = Date.now()) {
        '[object Array]' !== Object.prototype.toString.call(_events[type]) && (_events[type] = []);
        _events[type].push({
            namespace: namespace,
            fn: callback,
            context: context
        });
    }
    /**
     * 事件解绑
     * @param type      事件名
     * @param namespace 命名空间, 防止误删用
     */
    // TODO: 添加删除所有匿名事件功能
    function off (type, namespace) {
        if (namespace) {
            var e = _events[type] || [];
            for (var i = e.length - 1; -1 < i; --i) {
                if (namespace === e[i]['namespace']) {
                    e.splice(i, 1);
                }
            }
        } if (!namespace) {
            delete _events[type];
        }
    }
    /**
     * 事件触发
     * @param type      事件名
     */
    function emit (type) {
        var args = Array.prototype.slice.call(arguments, 1),
            e = _events[type] || [],
            returnValues = [];
        for (var i = 0, l = e.length; i < l; ++i) {
            var callback = e[i];
            '[object Function]' === Object.prototype.toString.call(callback.fn) ? returnValues.push(callback.fn.apply(callback.context, args)) : returnValues.push(callback.fn);
        }
        return returnValues;
    }

    return {
        on: on,
        off: off,
        emit: emit
    };
});