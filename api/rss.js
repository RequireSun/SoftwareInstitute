/**
 * Created by kelvinsun on 2016/6/12.
 */
'use strict';

const xml    = require('xml');
const config = require('../config');
const News   = require('../proxy').News;
const promiseWrap = require('../common/tool').promiseWrap;

module.exports = (req, res, next) => {
    const channel = [];
    for (let i in config.rss) {
        channel.push({ [i]: config.rss[i] });
    }
    const rssObj = { rss: [{ _attr: { version: '2.0' } }]};

    new Promise(promiseWrap(News.all, 50, 0)).
        then(result => {
            if (result && result.length) {
                channel.push({ lastBuildDate: new Date(result[0]['update_time']).toString() });
            }
            result.forEach(item => {
                channel.push({ item: [{
                    title: item['title'],
                }, {
                    description: item['article'].slice(0, 200),
                }, {
                    category: item['category_name'],
                }, {
                    pubDate: new Date(item['update_time']).toString()
                }, {
                    link: `http://software.hitwh.edu.cn/page/index/#/browse/detail?id=${item['id']}`,
                }]});
            });
            rssObj['rss'].push({ channel: channel });
            res.xml(rssObj);
            next();
        }, err => {});
};