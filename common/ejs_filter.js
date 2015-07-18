var ejs = require('ejs');

ejs.filters.convertDatetimeToDate = function (datetime) {
    return (new Date(datetime)).toLocaleDateString();
};

// ejs.filters.generateDetailLink = function (data) {
//     return 'newsDetail?id=' + data;
// };

// ejs.filters.generateResourceLink = function (data) {
//     return 'resource'
// }