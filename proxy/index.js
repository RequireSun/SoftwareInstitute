'use strict';
exports.Resource    = require('./resource');
// exports.News        = require('./news');
exports.News        = Object.assign({}, require('./newsDetail'), require('./newsAggregate'));
exports.Supervisor  = require('./supervisor');
exports.Struct      = require('./struct');