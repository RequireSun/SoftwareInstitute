var ejs = require('ejs');

ejs.filters.convertDatetimeToDate = function (datetime) {
    return (new Date(datetime)).toLocaleDateString();
};

ejs.filters.convertDatetimeFormat = function (datetime) {
    var tempDate = new Date(datetime);
    return tempDate.toLocaleDateString() + ' ' + tempDate.toLocaleTimeString();
};

// ejs.filters.generateDetailLink = function (data) {
//     return 'newsDetail?id=' + data;
// };

// ejs.filters.generateResourceLink = function (data) {
//     return 'resource'
// }