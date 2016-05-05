/**
 * Created by kelvin on 15-8-8.
 */
define(['jquery'], function ($) {
    const toString = target => Object.prototype.toString.call(target);

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

    const promiseWrap = (func, ...args) =>
        (resolve, reject) =>
            func(
                ((err, data) =>
                    err ?
                        reject(err) :
                        resolve(data)),
                ...args);

    const ajaxWrap = (callback = () => {}, parameters = {}) =>
        $.ajax(parameters).success(data => {
            if (!!data['code']) {
                callback(data);
            } else {
                callback(null, data['data']);
            }
        }).error((xhr, status, error) =>
            callback({ code: xhr.status, message: error })
        );

    return {
        toString,
        hasOwnProperty,
        convertDateTimeStringToDate,
        convertDateTimeStringToTime,
        convertDateTimeStringFormat,
        convertDateTimeToDate,
        convertDateTimeToTime,
        convertDateTimeFormat,
        promiseWrap,
        ajaxWrap,
    };
});