/**
 * Created by kelvin on 15-8-8.
 */
define([], function () {
    const hasOwnProperty = (target, ...args) =>
        Object.prototype.hasOwnProperty.apply(target, args);

    const convertDateTimeToDate = (inDateObject) =>
        inDateObject.toLocaleDateString().
        replace(/\d+/g, (part) => 1 < part.length ? part : '0' + part).
        replace(/\//g, () => '-');

    const convertDateTimeToTime = (inDateObject) =>
        inDateObject.toTimeString().replace(/ .*/, '');

    const convertDateTimeFormat = (inDateObject) =>
        convertDateTimeToDate(inDateObject) +
        ' ' +
        convertDateTimeToTime(inDateObject);

    const convertDateTimeStringToDate = (inDateString) =>
        convertDateTimeToDate(new Date(inDateString));

    const convertDateTimeStringToTime = (inDateString) =>
        convertDateTimeToTime(new Date(inDateString));

    const convertDateTimeStringFormat = (inDateString) =>
        convertDateTimeStringToDate(inDateString) +
        ' ' +
        convertDateTimeStringToTime(inDateString);

    return {
        hasOwnProperty,
        convertDateTimeStringToDate,
        convertDateTimeStringToTime,
        convertDateTimeStringFormat,
        convertDateTimeToDate,
        convertDateTimeToTime,
        convertDateTimeFormat,
    };
});