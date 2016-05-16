/**
 * Created by kelvinsun on 2016/5/16.
 */
define([
    'immutable',
    'react',
    'ReactRouter',
    'react-redux',
    'common/redux_helper',
    'common/util',
    'root/store_manage'
], (Immutable, React, ReactRouter, ReactRedux, reduxHelper, util, store) => {
    const { Link } = ReactRouter;
    const { Provider, connect } = ReactRedux;
    const { mapStateToProps, mapDispatchToProps } = reduxHelper;

    class Classification extends React.Component {
        render () {
            return (
                <nav className="list-group">
                    {this.props.classification.map(item =>
                        <Link></Link>
                    )}
                </nav>
            );
        }
    }
    Classification.defaultProps = { classification: Immutable.List() };

    class News extends React.Component {
        render () {
            return (
                <div className="row">
                    <div className="col-sm-4">
                        <Classification classification={this.state.classification}/>
                    </div>
                    <div className="col-sm-8"></div>
                </div>
            );
        }
    }

    const ConnectNews = connect(mapStateToProps, mapDispatchToProps)(News);

    return () =>
        (<Provider store={store}>
            <ConnectNews/>
        </Provider>);
});