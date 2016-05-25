/**
 * Created by kelvinsun on 2016/5/26.
 */
'use strict';

define([
    'immutable',
    'react',
    'ReactRouter',
    'react-redux',
    'common/redux_helper',
    'root/config',
    'root/store_manage',
    'common/util',
    'pView/pager',
], (Immutable, React, ReactRouter, ReactRedux, reduxHelper, config, store, util, Pager) => {
    const { Link } = ReactRouter;
    const { Provider, connect } = ReactRedux;
    const { mapStateToProps, mapDispatchToProps } = reduxHelper;

    class ResourceDetail extends React.Component {
        constructor (props) {
            super(props);
        }
        render () {
            return (
                <div className="row resource-container">
                </div>
            );
        }
    }

    class ResourceList extends React.Component {
        constructor (props) {
            super(props);
            this.state = ResourceList.getState(props);
        }
        componentWillReceiveProps (nextProps) {
            this.setState(ResourceList.getState(nextProps));
            this.getData(nextProps);
        }
        componentWillMount () {
            this.getData(this.props);
        }
        getData (props) {
            const pageRequest = +props.query.pageRequest || +config.pageRequest,
                  pageSize    = +props.query.pageSize    || +config.pageSize;
            if (this.state.pageRequest !== pageRequest ||
                this.state.pageSize !== pageSize) {
                this.setState({ pageRequest, pageSize });
                props.onResourceListGet(pageRequest, pageSize);
            }
        }
        static getState (state) {
            const resource = !state || !state['resource'] ||
                  '[object Object]' !== util.toString(state) ?
                      {} :
                      state['resource'];
            if (!Immutable.List.isList(resource['list'])) {
                resource['list'] = Immutable.List();
            }
            if (isNaN(resource['count'])) {
                resource['count'] = 0;
            }

            return Object.assign({}, resource);
        }
        render () {
            return (
                <div className="row resource-container">
                    <div className="col-xs-12">
                        <div className="panel panel-sharp">
                            <div className="list-group">
                                {this.state.list.map(item =>
                                    <Link to={{ pathname: "/resource/detail", query: { id: item.get('id') }}}
                                          className="list-group-item" key={item.get('id')}>
                                        {item.get('title')}
                                        <span className="pull-right">
                                            {util.convertDateTimeStringToDate(item.get('update_time'))}
                                        </span>
                                    </Link>
                                )}
                            </div>
                            <div className="pull-right">
                                <Pager current={this.state.pageRequest} max={this.state.count}
                                       link={`#/resource/list?pageSize=${this.state.pageSize}&pageRequest={#page}`}/>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }

    const ConnectResourceList = connect(mapStateToProps, mapDispatchToProps)(ResourceList),
          ConnectResourceDetail = connect(mapStateToProps, mapDispatchToProps)(ResourceDetail);


    return {
        resourceList: (props) => (
            <Provider store={store}>
                <ConnectResourceList params={props.params} query={props.location.query}/>
            </Provider>
        ),
        resourceDetail: (props) => (
            <Provider store={store}>
                <ConnectResourceDetail params={props.params} query={props.location.query}/>
            </Provider>
        ),
    };
});