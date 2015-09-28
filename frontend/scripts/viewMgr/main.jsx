define(['react', 'ReactRouter', 'react-bootstrap'/*, 'view/public'*/], function (React, Router, ReactBootstrap/*, templatePublic*/) {
    //var Navigation = templatePublic.Navigation,
    //    Footer = templatePublic.Footer;
    var RouteHandler = Router.RouteHandler;
    var Row = ReactBootstrap.Row,
        Col = ReactBootstrap.Col;

    var Main = React.createClass({
        render: function () {
            return (
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-2 col-md-1 hidden-xs">
                            123
                        </div>
                        <RouteHandler/>
                    </div>
                </div>
            );
        }
    });

    return Main;
});