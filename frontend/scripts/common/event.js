/**
 * Created by kelvinsun on 2015/10/23.
 */

define(['jquery'], function ($) {
    var EventDom = $('<script>');
    function on (events, handler, namespace) {
        EventDom.on(events, function () {
            var args = Array.prototype.slice.call(arguments),
                eventType = args.shift();
            args.push(eventType);
            handler && handler.apply(null, args);
        });
    }
    function emit (events) {
        var args = Array.prototype.slice.call(arguments);
        args.shift();
        EventDom.trigger(events, args);
    }
    function off (events, namespace) {
        EventDom.off(events);
    }
    return {
        on: on,
        off: off,
        emit: emit
    };
});
