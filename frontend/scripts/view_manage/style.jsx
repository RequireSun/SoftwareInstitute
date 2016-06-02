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
    const { hasOwnProperty } = util;

    class Style extends React.Component {
        constructor (props) {
            super(props);
            this.state = Style.getState(props);
        }
        componentWillReceiveProps (nextProps) {
            this.setState(Style.getState(nextProps));
        }
        componentWillMount () {
            this.props.onStyleAllGet();
        }
        componentDidMount () {
            this.editor = new JSONEditor(this.refs.editor, {
                onChange: () =>
                    this.refs.submit.disabled =
                        !!this.editor &&
                        Immutable.is(
                            Immutable.fromJS(this.editor.get()),
                            Immutable.fromJS(this.state.style)),
            });
            this.editor.set(this.state.style);
        }
        componentDidUpdate () {
            this.editor.set(this.state.style);
        }
        static getState (state) {
            const style =
                !state || !state['style'] || !state['style'] ?
                    {} :
                    state['style'];

            const styles = {};
            for (let i in style) {
                if (hasOwnProperty(style, i)) {
                    styles[i] = style[i].toJS();
                }
            }
            return { style: styles };
        }
        render () {
            return (
                <div className="row">
                    <div className="col-xs-12">
                        <div className="panel panel-sharp">
                            <div className="panel-heading">样式编辑</div>
                            <div className="panel-body">
                                <div ref="editor"></div>
                                <button className="btn btn-success pull-right"
                                        style={{ marginTop: 20 }}
                                        disabled ref="submit">提交</button>
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