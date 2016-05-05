'use strict';

define([
    'react',
    'ReactRouter',
    'view/main',
    'view/index',
], (React, ReactRouter, main, index) => {
    const { Router, Route, IndexRoute, hashHistory } = ReactRouter;

    return (
        <Router history={hashHistory}>
            <Route name="main" path="/" handler={main}>
                <IndexRoute component={index}/>
                <Route name="index" path="index" handler={index}/>
            </Route>
        </Router>
    );
});