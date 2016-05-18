'use strict';

define([
    'react',
    'ReactRouter',
    'view/main',
    'view/index',
    'view/classification',
    'view/news',
], (React, ReactRouter, main, index, classification, news) => {
    const { Router, Route, IndexRoute, hashHistory } = ReactRouter;

    return (
        <Router history={hashHistory}>
            <Route name="main" path="/" component={main}>
                <IndexRoute component={index}/>
                <Route name="index" path="index" component={index}/>
                <Route name="classification" path="classification" component={classification}/>
                <Route name="news" path="news" component={news}/>
            </Route>
        </Router>
    );
});