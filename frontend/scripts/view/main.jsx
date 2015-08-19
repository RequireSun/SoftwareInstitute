define(['react', 'ReactRouter', 'view/public'], function (React, Router, templatePublic) {
    var Navigation = templatePublic.Navigation,
        Footer = templatePublic.Footer;
    var RouteHandler = Router.RouteHandler;

    var Main = React.createClass({
        render: function () {
            return (
                <div>
                    <Navigation />
                    <RouteHandler />
                    <Footer />
                </div>
            );
        }
    });

    return Main;
});