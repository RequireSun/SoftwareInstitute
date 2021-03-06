/**
 * Created by kelvinsun on 2015/8/5.
 */
'use strict';

define([
    'react',
    'ReactRouter',
    'view/main',
    'view/browse',
    'view/index',
    'view/news',
    'view/resource',
    'view/detail',
    'view/error'
],
(React, ReactRouter, main, browse, index, news, resource, detail, error) => {
    const { Router, Route, IndexRoute, hashHistory } = ReactRouter;

    return (
        <Router history={hashHistory}>
            <Route name="main" path="/" component={main}>
                <Route name="index" path="index" component={index}/>
                <Route name="browse" path="browse">
                    <Route name="news" path="news/:type" component={news}/>
                    <Route name="resource" path="resource" component={resource}/>
                    <Route name="detail" path="detail" component={detail}/>
                    <IndexRoute component={error}/>
                </Route>
                <IndexRoute component={index}/>
                <Route path="notFound/:error?" component={error}/>
            </Route>
        </Router>
    );
});