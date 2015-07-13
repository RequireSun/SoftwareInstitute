var mysql = require('mysql');
var config = require('../config');
var pool = mysql.createPool(config.db);

pool.config.connectionConfig.queryFormat = function (query, values) {
  if (!values) return query;
  return query.replace(/\:(\w+)/g, function (txt, key) {
    if (values.hasOwnProperty(key)) {
      return this.escape(values[key]);
    }
    return txt;
  }.bind(this));
};

module.exports = pool;
// connection.query("UPDATE posts SET title = :title", { title: "Hello MySQL" });