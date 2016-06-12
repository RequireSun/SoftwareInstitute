/**
 * Created by kelvinsun on 2016/6/12.
 */
'use strict';

const xml = require('xml');

module.exports = (req, res, next) => {
    res.xml = data => {
        res.type('application/xml');
        res.status(200).send(xml(data, { declaration: true }));
    };

    next();
};