var ejs = require('ejs');

ejs.filters.convertDatetimeToDate = function (datetime) {
    return (new Date(datetime)).toLocaleDateString();
};

ejs.filters.generateLink = function (data) {
    return 'newsDetail?id=' + data;
};