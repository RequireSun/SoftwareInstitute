/**
 * Created by kelvinsun on 2015/8/5.
 */
define(['React'], function (React) {
    var DefaultRoute = Router.DefaultRoute;
    var Link = Router.Link;
    var Route = Router.Route;
    var RouteHandler = Router.RouteHandler;
    var NotFoundRoute = Router.NotFoundRoute;
    var Redirect = Router.Redirect;

    var Toolbar = React.createClass({
        render: function () {
            return (
                <h2>Toolbar</h2>
            );
        }
    });

    var Messages = React.createClass({
        render: function () {
            return (
                <h2>Messages</h2>
            );
        }
    });

    var Message = React.createClass({
        contextTypes: {
            router: React.PropTypes.func
        },
        render: function () {
            return (
                <div>{ this.context.router.getCurrentParams().messageId }</div>
            );
        }
    });

    var InboxStats = React.createClass({
        render: function () {
            return (
                <h2>InboxStats</h2>
            );
        }
    });

    var Inbox = React.createClass({
        render: function () {
            return (
                <div>
                    <Toolbar />
                    <Messages />
                    <RouteHandler />
                </div>
            );
        }
    });

    var Calendar = React.createClass({
        render: function () {
            return (
                <h2>Calendar</h2>
            );
        }
    });

    var Dashboard = React.createClass({
        render: function () {
            return (
                <h2>Dashboard</h2>
            );
        }
    });

    var InboxNotFound = React.createClass({
        render: function () {
            return (
                <h2>InboxNotFound</h2>
            );
        }
    });

    var NotFound = React.createClass({
        render: function () {
            return (
                <h2>NotFound</h2>
            );
        }
    });

    var App = React.createClass({
        render: function () {
            return (
                <div>
                    <header>
                        <ul>
                            <li><Link to="app">Dashboard</Link></li>
                            <li><Link to="inbox">Inbox</Link></li>
                            <li><Link to="calendar">Calendar</Link></li>
                        </ul>
                        Logged in as Jane
                    </header>
                    {/* this is the important part */}
                    <RouteHandler />
                </div>
            );
        }
    });

    var routes = (
        <Route name="app" path="/" handler={App}>
            <Route name="inbox" handler={Inbox}>
                <NotFoundRoute handler={InboxNotFound}/>
                <Route name="message" path=":messageId" handler={Message}/>
                <DefaultRoute handler={InboxStats}/>
            </Route>
            <Route name="calendar" handler={Calendar}/>
            <Redirect from="/message/:messageId" to="message"/>
            <NotFoundRoute handler={NotFound}/>
            <DefaultRoute handler={Dashboard}/>
        </Route>
    );

    Router.run(routes, Router.HashLocation, function (Handler) {
        React.render(<Handler />, document.body);
    });
});