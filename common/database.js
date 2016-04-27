'use strict';

const mysql  = require('mysql');
const config = require('../config');
const hasOwnProperty = require('./tool').hasOwnProperty;
const pool   = mysql.createPool(config.db);

pool.config.connectionConfig.queryFormat = (query, values) =>
    !values || !(values instanceof Object) ?
        query :
        query.replace(/\:(\w+)/g, (txt, key) =>
            hasOwnProperty(values, key) ?
                mysql.escape(values[key]) :
                txt
        );

module.exports = pool;
// connection.query("UPDATE posts SET title = :title", { title: "Hello MySQL" });