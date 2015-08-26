define(['react', 'ReactRouter', 'view/public'], function (React, Router, templatePublic) {
    // 这个模块暂时不用了
    var Shortcut = templatePublic.Shortcut;
    var RouteHandler = Router.RouteHandler;
    var Browse = React.createClass({
        render: function () {
            return (
                <div>
                    <Shortcut/>
                    <RouteHandler/>
                </div>
            );
        }
    });
});