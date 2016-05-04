define(
    ['react', 'ReactRouter', 'view/main', 'view/index', 'view/news', 'view/resource', 'view/error'], function (React, Router, main, index, news, resource, error) {
    var Route = Router.Route,
        DefaultRoute = Router.DefaultRoute,
        NotFoundRoute = Router.NotFoundRoute;

    var routeNews = news.News,
        newsRouter = news.NewsRouter,
        newsContent = news.NewsContent,
        newsStructure = news.NewsStructure;

    var routes = (
        <Route name="main" path="/" handler={main}>
            <Route name="index" path="index" handler={index}/>
            <Route name="news" path="news" handler={routeNews}>
                <Route name="newsRouter" path="newsRouter" handler={newsRouter}/>
                <Route name="newsContent" path="newsContent" handler={newsContent}/>
                <Route name="newsStructure" path="newsStructure" handler={newsStructure}/>
                <DefaultRoute handler={newsRouter}/>
            </Route>
            <Route name="resource" path="resource" handler={resource}/>
            <DefaultRoute handler={index}/>
        </Route>
    );
    return routes;
});