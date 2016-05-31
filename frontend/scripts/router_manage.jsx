'use strict';

define([
    'react',
    'ReactRouter',
    'view/main',
    'view/index',
    'view/classification',
    'view/news',
    'view/resource',
    'view/style',
], (React, ReactRouter, main, index, classification, newsComponents, resourceComponents, style) => {
    const { Router, Route, IndexRoute, hashHistory } = ReactRouter;
    const { news, newsList, newsDetail } = newsComponents;
    const { resourceList, resourceDetail } = resourceComponents;

    return (
        <Router history={hashHistory}>
            <Route name="main" path="/" component={main}>
                <IndexRoute component={index}/>
                <Route name="index" path="index" component={index}/>
                <Route name="classification" path="classification" component={classification}/>
                <Route name="news" path="news" component={news}>
                    <Route name="list" path="list/:type" component={newsList}/>
                    <Route name="detail" path="detail" component={newsDetail}/>
                </Route>
                <Route name="resource" path="resource">
                    <Route name="list" path="list" component={resourceList}/>
                    <Route name="detail" path="detail" component={resourceDetail}/>
                </Route>
                <Route name="style" path="style" component={style}/>
            </Route>
        </Router>
    );
});