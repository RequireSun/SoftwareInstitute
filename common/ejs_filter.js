var ejs = require('ejs');

ejs.filters.convertDatetimeToDate = function (datetime) {
    return (new Date(datetime)).toLocaleDateString();
}