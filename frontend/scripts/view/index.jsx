define(['react'], function (React) {
    var Scroll = React.createClass({
        render: function () {
            return (
                <div>Scroll</div>
            );
        }
    });

    var Notice = React.createClass({
        render: function () {
            return (
                <div>Notice</div>
            );
        }
    });

    var News = React.createClass({
        render: function () {
            return (
                <div>News</div>
            );
        }
    });

    var Resource = React.createClass({
        render: function () {
            return (
                <div>Resource</div>
            );
        }
    });

    var Index = React.createClass({
        render: function () {
            return (
                <div>
                    <Scroll />
                    <Notice />
                    <News />
                    <Resource />
                </div>
            );
        }
    });
    return Index;
});