/**
 * Created by kelvinsun on 2016/6/12.
 */
'use strict';

const xml    = require('xml');
const config = require('../config');
const news   = require('../proxy').News;

module.exports = (req, res, next) => {
    const channel = [];
    for (let i in config.rss) {
        channel.push({ [i]: config.rss[i] });
    }
    const rssObj = { rss: [{ _attr: { version: '2.0' } }, { channel }]};

    res.xml(rssObj);
    // {
    //     rss: [{ _attr: { version: '2.0' } }, {
    //         channel: [{
    //             lastBuildDate: ''
    //         }, {
    //             item: [{
    //                 title: 'ttt',
    //             }, {
    //                 description: 'ddd',
    //             }, {
    //                 link: 'lll',
    //             }, {
    //                 author: 'aaa',
    //             }, {
    //                 category: 'ccc',
    //             }, {
    //                 pubDate: '',
    //             }]
    //         }]
    //     }]
    // }
    next();
};