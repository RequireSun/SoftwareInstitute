define(
    ['react', 'ReactRouter', 'view/main', 'view/index', 'view/news', 'view/resource', 'view/error'], function (React, Router, main, index, news, resource, error) {
    var Route = Router.Route,
        DefaultRoute = Router.DefaultRoute,
        NotFoundRoute = Router.NotFoundRoute;

    var routes = (
        <Route name="main" path="/" handler={main}>
            <Route name="index" path="index" handler={index}/>
            <Route name="news" path="news" handler={news}></Route>
            <Route name="resource" path="resource" handler={resource}/>
            <DefaultRoute handler={index}/>
        </Route>
    );
    return routes;
});