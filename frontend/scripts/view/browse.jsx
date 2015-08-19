define(['react', 'ReactRouter', 'view/public'], function (React, Router, templatePublic) {
    var Shortcut = templatePublic.Shortcut;
    var RouteHandler = Router.RouteHandler;
    var Browse = React.createClass({
        render: function () {
            return (
                <div>
                    <Shortcut />
                    <RouteHandler />
                </div>
            );
        }
    });
});