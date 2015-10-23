define(['react', 'ReactRouter'], function (React, Router) {
    var Resource = React.createClass({
        render: function () {
            return (<div>
                <div className="page-header">
                    <h1>资源下载</h1>
                </div>
            </div>);
        }
    });
    return Resource;
});