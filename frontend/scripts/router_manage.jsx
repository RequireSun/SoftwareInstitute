'use strict';

define([
    'react',
    'ReactRouter',
    'view/main',
    'view/index',
    'view/classification',
], (React, ReactRouter, main, index, classification) => {
    const { Router, Route, IndexRoute, hashHistory } = ReactRouter;

    return (
        <Router history={hashHistory}>
            <Route name="main" path="/" component={main}>
                <IndexRoute component={index}/>
                <Route name="index" path="index" component={index}/>
                <Route name="classification" path="classification" component={classification}/>
            </Route>
        </Router>
    );
});