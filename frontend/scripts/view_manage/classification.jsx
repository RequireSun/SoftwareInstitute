/**
 * Created by kelvinsun on 2016/5/6.
 */

define([
    'react',
    'react-redux',
    'common/redux_helper',
    'root/store_manage'
], (React, ReactRedux, reduxHelper, store) => {
    const { Provider, connect } = ReactRedux;
    const { mapStateToProps, mapDispatchToProps } = reduxHelper;

    class Classification extends React.Component {
        constructor (props) {
            super(props);
        }
        render () {
            return (
                <div></div>
            );
        }
    }

    const ConnectClassification = connect(mapStateToProps, mapDispatchToProps)(Classification);

    return () =>
        (<Provider store={store}>
            <ConnectClassification/>
        </Provider>);
});