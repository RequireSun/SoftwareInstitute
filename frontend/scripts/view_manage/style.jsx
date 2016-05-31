/**
 * Created by kelvinsun on 2016/5/31.
 */
'use strict';

define([
    'immutable',
    'react',
    'ReactRouter',
    'react-redux',
    'common/redux_helper',
    'jsoneditor',
    'root/config',
    'root/store_manage',
    'common/util',
], (Immutable, React, ReactRouter, ReactRedux, ReduxHelper, JSONEditor, config, store, util) => {
    const { Link } = ReactRouter;
    const { Provider, connect } = ReactRedux;
    const { mapStateToProps, mapDispatchToProps } = ReduxHelper;

    class Style extends React.Component {
        constructor (props) {
            super(props);
        }
        componentDidMount () {
            this.editor = new JSONEditor(this.refs.editor);
        }
        render () {
            return (
                <div className="row">
                    <div className="col-xs-12">
                        <div className="panel panel-sharp">
                            <div className="panel-heading">样式编辑</div>
                            <div className="panel-body">
                                <div ref="editor"></div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }

    const ConnectStyle = connect(mapStateToProps, mapDispatchToProps)(Style);

    return (props) => (
        <Provider store={store}>
            <ConnectStyle params={props.params} query={props.location.query}/>
        </Provider>
    );
});