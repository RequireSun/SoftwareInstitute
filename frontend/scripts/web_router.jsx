/**
            callback()
 * Created by kelvinsun on 2015/8/5.
 */
define(
    ['react', 'ReactRouter', 'view/main', 'view/browse', 'view/index', 'view/news', 'view/resource', 'view/detail', 'view/error'],
    function (React, Router, main, browse, index, news, resource, detail, error) {
    var Route = Router.Route,
        DefaultRoute = Router.DefaultRoute,
        NotFoundRoute = Router.NotFoundRoute;
    var routes = (
        <Route name="main" path="/" handler={main}>
            <Route name="index" path="index" handler={index}/>
            <Route name="browse" path="browse">
                <Route path="news">
                    <Route name="news" path=":newsType" handler={news}/>
                    <DefaultRoute handler={error}/>
                </Route>
                <Route name="resource" path="resource" handler={resource}/>
                <Route path="detail">
                    <Route name="detail" path=":newsId" handler={detail}/>
                    <DefaultRoute handler={error}/>
                </Route>
                <NotFoundRoute handler={error}/>
            </Route>
            <Route path=":test" handler={news}/>
            <Route path="notFound/:error?" handler={error}/>
            <DefaultRoute handler={index}/>
            <NotFoundRoute handler={error}/>
        </Route>
    );
    return routes;
});