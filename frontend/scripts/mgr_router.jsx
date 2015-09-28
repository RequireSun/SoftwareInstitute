define(['react', 'ReactRouter', 'view/main'], function (React, Router, main) {
    var Route = Router.Route,
        DefaultRoute = Router.DefaultRoute,
        NotFoundRoute = Router.NotFoundRoute;

    var routes = (
        <Route name="main" path="/" handler={main}>
        </Route>
    );
    return routes;
});