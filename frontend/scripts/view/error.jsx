define(['react'], function (React) {
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