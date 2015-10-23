/**
 * Created by kelvinsun on 2015/10/23.
 */
define(['jquery'], function ($) {
    var EventDom = $('<script>');
    /**
     * 事件绑定
     * @param events    事件名
     * @param handler   事件处理函数
     * @param namespace 命名空间, 防止误删用
     */
    function on (events, handler, namespace) {
        EventDom.on(events, function () {
            var args = Array.prototype.slice.call(arguments),
                eventType = args.shift();
            args.push(eventType);
            handler && handler.apply(null, args);
        });
    }
    /**
     * 事件触发
     * @param events    事件名
     */
    function emit (events) {
        var args = Array.prototype.slice.call(arguments);
        args.shift();
        EventDom.trigger(events, args);
    }
    /**
     * 事件解绑
     * @param events    事件名
     * @param namespace 命名空间, 防止误删用
     */
    function off (events, namespace) {
        EventDom.off(events);
    }

    return {
        on: on,
        off: off,
        emit: emit
    };
});
