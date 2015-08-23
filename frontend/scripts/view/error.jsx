define(['react', 'ReactRouter'], function (React, Router) {
    var Error = React.createClass({
        getInitialState: function () {
            return {
                error: this.props.params.error
            }
        },
        componentWillReceiveProps: function (nextProps) {
            this.setState({
                error: nextProps.error
            });
        },
        render: function () {
            console.log(this.state.error);
            console.log(Router.HashLocation);
            //Router.HashLocation.pop();
            return (
                <div>
                    <h1>Error</h1>
                    <p>{this.state.error}</p>
                </div>
            );
        }
    });
    return Error;
});