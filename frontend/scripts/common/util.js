/**
 * Created by kelvin on 15-8-8.
 */
define([], function () {
    function hasOwnProperty () {
        var argLen = arguments.length, slice = Array.prototype.slice.bind(arguments);
        return Object.hasOwnProperty.apply(argLen ? slice(0, 1)[0] : null, slice(1, argLen));
    }
    return {
        hasOwnProperty: hasOwnProperty
    };
});