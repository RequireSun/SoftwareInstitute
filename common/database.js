'use strict';

let mysql = require('mysql');
let config = require('../config');
let pool = mysql.createPool(config.db);

pool.config.connectionConfig.queryFormat = function (query, values) {
  if (!values) return query;
  return query.replace(/\:(\w+)/g, (txt, key) => {
    if (values.hasOwnProperty(key)) {
      return this.escape(values[key]);
    }
    return txt;
  });
};

module.exports = pool;
// connection.query("UPDATE posts SET title = :title", { title: "Hello MySQL" });