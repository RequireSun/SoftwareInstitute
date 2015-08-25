/**
 * Created by kelvin on 15-8-8.
 */
define([], function () {
    function hasOwnProperty () {
        var argLen = arguments.length, slice = Array.prototype.slice.bind(arguments);
        return Object.hasOwnProperty.apply(argLen ? slice(0, 1)[0] : null, slice(1, argLen));
    }

    function convertDateTimeToDate (inDateString) {
        return (new Date(inDateString)).toLocaleDateString().replace(/\d+/g, function (part) {
            return 1 < part.length ? part : '0' + part;
        }).replace(/\//g, function (part) {
            return '-';
        });
    }

    return {
        HasOwnProperty: hasOwnProperty,
        ConvertDateTimeToDate: convertDateTimeToDate
    };
});