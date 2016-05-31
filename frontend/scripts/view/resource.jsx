'use strict';

define([
    'immutable',
    'react',
    'react-redux',
    'common/redux_helper',
    'root/config',
    'root/store',
    'common/util',
    'view/public',
], function (Immutable, React, ReactRedux, reduxHelper, config, store, commonUtil, templatePublic) {
    const { Provider } = ReactRedux;
    const { TitleLine, Shortcut, Pager } = templatePublic;

    const ResourceItem = (props) => (
        <li>
            <a href={`${uploadUrl}${props['path']}`}>
                {props['title']}
                <span className="pull-right">
                    {commonUtil.convertDateTimeStringToDate(props['update_time'])}
                </span>
            </a>
        </li>
    );

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
                             '[object Object]' !== commonUtil.toString(state) ?
                                 {} :
                                 state['resource'];
            if (!Immutable.List.isList(resource['list'])) {
                resource['list'] = Immutable.List();
            }
            if (isNaN(resource['count'])) {
                resource['count'] = 0;
            }
            return resource;
        }
        render () {
            return (
                <div>
                    <div className="container-fluid">
                        <div className="row">
                            <div className="title-header">
                                <div className="container">
                                    <div className="row">
                                        <div className="shortcut-container col-sm-3 hidden-xs">
                                            <Shortcut/>
                                        </div>
                                        <div className="col-xs-12 col-sm-9 col-sm-offset-3">
                                            <TitleLine title="资源下载"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="content-container container">
                        <div className="row">
                            <div className="newsList-container col-xs-12 col-sm-9 col-sm-offset-3">
                                <ul className="newsList-box">
                                    {this.state.list.map(item =>
                                        <ResourceItem key={item.get('id')} title={item.get('title')}
                                                      path={item.get('path')} update_time={item.get('update_time')}/>
                                    )}
                                </ul>
                                <div className="pull-right">
                                    <Pager current={this.state.pageRequest} max={this.state.count}
                                           link={`#/browse/resource?pageSize=${this.state.pageSize}&pageRequest={#page}`}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }

    const ConnectNewsList = ReactRedux.connect(reduxHelper.mapStateToProps, reduxHelper.mapDispatchToProps)(ResourceList);

    return (props) => {
        return (
            <Provider store={store}>
                <ConnectNewsList params={props.params} query={props.location.query}/>
            </Provider>
        );
    };

    // var ResourceList = React.createClass({
    //     mixins: [actionResource],
    //     getData: function (pageSize, pageRequest) {
    //         this.ResourceList(function (err, data) {
    //             if (err) {
    //                 location.hash = '#notFound/' + err;
    //                 return ;
    //             }
    //             this.setState({
    //                 resourceList: data.data ? data.data : [],
    //                 resourceCount: data.count ? data.count : 0
    //             });
    //         }.bind(this), pageSize, pageRequest);
    //     },
    //     getInitialState: function () {
    //         return {
    //             pageSize : this.props.query.pageSize,
    //             pageRequest : this.props.query.pageRequest,
    //             resourceList: [],
    //             resourceCount: 0
    //         };
    //     },
    //     componentWillReceiveProps: function (nextProps) {
    //         this.setState({
    //             pageSize : nextProps.query.pageSize,
    //             pageRequest : nextProps.query.pageRequest,
    //             resourceList: [],
    //             resourceCount: 0
    //         }, function () {
    //             this.getData(this.state.pageSize, this.state.pageRequest);
    //         });
    //     },
    //     componentWillMount: function () {
    //         this.getData(this.state.pageSize, this.state.pageRequest);
    //     },
    //     render: function () {
    //         var resourceItems = [], tempResourceList = this.state.resourceList;
    //         for (var i = 0, l = tempResourceList.length; i < l; ++i) {
    //             resourceItems.push(
    //                 <ResourceItem {...tempResourceList[i]}/>
    //             );
    //         }
    //         return (
    //             <div className="container">
    //                 <div className="row">
    //                     <TitleLine title="资源下载"/>
    //                 </div>
    //                 <div className="row">
    //                     <div className="col-sm-3 hidden-xs">
    //                         <Shortcut/>
    //                     </div>
    //                     <div className="col-sm-9">
    //                         <ul>
    //                             {resourceItems}
    //                         </ul>
    //                         <Pager current={this.state.pageRequest} max={this.state.resourceCount} link={resourceLink}/>
    //                     </div>
    //                 </div>
    //             </div>
    //         );
    //     }
    // });
    // return ResourceList;
});