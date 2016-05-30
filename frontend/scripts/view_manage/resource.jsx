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
            this.state = ResourceDetail.getState(props);
        }
        componentWillReceiveProps (nextProps) {
            this.setState(ResourceDetail.getState(nextProps));
            this.getData(nextProps);
        }
        componentWillMount () {
            this.getData(this.props);
        }
        componentDidMount () {
            this.fillData();
        }
        componentDidUpdate () {
            this.fillData();
        }
        getData (props) {
            const id = +props.query.id;
            if (this.state.id !== id) {
                if (0 === id) {
                    this.refs.title.value = '';
                    this.setState({ title: '' });
                    props.onResourceDetailClear();
                } else {
                    props.onResourceDetailGet(id);
                }
            }
        }
        static getState (state) {
            const resource = !state || !state['resource'] ||
                 '[object Object]' !== util.toString(state) ?
                     {} :
                     state['resource'];

            return Object.assign({}, resource);
        }
        fillData () {
            const recordId = this.refs.id.value,
                  currentId = this.state.id;
            if (recordId == currentId && this.refs.title.value !== this.state.title) {
                this.setState({ title: this.refs.title.value });
            } else {
                this.refs.title.value = this.state.title || '';
            }
            // TODO: 这里怎么改
            // if (recordId == currentId && this.refs.article.value !== this.state.article) {
            //     this.setState({ article: this.refs.article.value });
            // } else {
            //     this.refs.article.value = this.state.article || '';
            // }
            if (recordId != currentId) {
                this.refs.id.value = currentId;
            }
        }
        submitData (e) {
            this.props.onResourceUpload(this.refs.form);
            e.preventDefault();
        }
        render () {
            return (
                <div className="row resource-container">
                    <div className="col-xs-12">
                        <div className="panel panel-sharp">
                            <div className="panel-heading">
                                编辑资源
                                {this.state.update_time ?
                                    <small className="pull-right">上次更新时间: {util.convertDateTimeStringFormat(this.state.update_time)}</small> : ''
                                }
                                <span className="pull-right">&nbsp;&nbsp;</span>
                                {this.state.supervisor_name ?
                                    <small className="pull-right">上次更新者: {this.state.supervisor_name}</small> : ''
                                }
                            </div>
                            <div className="panel-body">
                                <form ref="form" className="form-horizontal"
                                      action="/api/resource" method="POST"
                                      encType="multipart/form-data">
                                    {/*<iframe name="target_frame" frameborder="0"
                                            style={{ display: 'none' }} onLoad={function () { console.log(111); }}/>*/}
                                    <input type="hidden" ref="id" name="id"/>
                                    <input type="hidden" name="_method"
                                           value={!!this.state.id ? 'PUT' : 'POST'}/>
                                    <div className="form-group">
                                        <label htmlFor="titleInput"
                                               className="control-label col-sm-1">
                                            标题
                                        </label>
                                        <div className="col-sm-11">
                                            <input id="titleInput" ref="title"
                                                   type="text" name="title"
                                                   className="form-control"
                                                   placeholder="title"/>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="fileInput"
                                               className="control-label col-sm-1">
                                            文件
                                        </label>
                                        <div className="col-sm-11">
                                            <input id="fileInput" ref="file"
                                                   type="file" name="file"
                                                   className="form-control"
                                                   placeholder="file"/>
                                        </div>
                                    </div>
                                    <button onClick={this.submitData.bind(this)}
                                            className="btn btn-success pull-right">提交</button>
                                    {0 == this.state.id ? '' :
                                        <button className="btn btn-danger pull-right"
                                                style={{ margin: '0 .1rem' }}
                                                onClick={this.props.onNewsDetailDelete.bind(null, this.state.id)}>
                                            删除
                                        </button>
                                    }
                                </form>
                            </div>
                        </div>
                    </div>
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