'use strict';
let detail      = require('./newsDetail');
let aggregate   = require('./newsAggregate');

module.exports = Object.assign({}, aggregate, detail);
