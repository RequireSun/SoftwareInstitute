/**
 * Created by kelvinsun on 2016/5/16.
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

    class NewsDetail extends React.Component {
        constructor (props) {
            super(props);
            this.state = NewsDetail.getState(props);
        }
        componentWillReceiveProps (nextProps) {
            this.setState(NewsDetail.getState(nextProps)/*, () => this.fillData()*/);
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
                // this.setState({ id });
                if (0 === id) {
                    this.refs.title.value = '';
                    this.refs.article.value = '';
                    this.setState({ title: '', article: '' });
                    props.onNewsDetailClear();
                } else {
                    props.onNewsDetailGet(id);
                }
            }
        }
        static getState (state) {
            const detail = !state || !state['detail'] ||
                           '[object Object]' !== util.toString(state) ?
                               {} :
                               state['detail'];
            const struct = !state || !state['struct'] ||
                           '[object Object]' !== util.toString(state) ?
                               {} :
                               state['struct'];
            if (!Immutable.Map.isMap(struct['all'])) {
                struct['all'] = Immutable.Map();
            }

            return Object.assign({ struct: struct['all'] }, detail);
        }
        fillData () {
            const recordId = this.refs.id.value,
                  currentId = this.state.id;
            if (/*!!this.refs.title.value && */recordId == currentId && this.refs.title.value !== this.state.title) {
                this.setState({ title: this.refs.title.value });
            } else {
                this.refs.title.value = this.state.title || '';
            }
            if (/*!!this.refs.article.value && */recordId == currentId && this.refs.article.value !== this.state.article) {
                this.setState({ article: this.refs.article.value });
            } else {
                this.refs.article.value = this.state.article || '';
            }
            if ((!!this.state.category_id || 0 === this.state.category_id) &&
                Immutable.Map.isMap(this.state.struct)) {
                const id = this.state.category_id;
                const outline = this.state.struct.find(item => item.get('categories').some(category => id == category.get('id')));
                if (!!outline) {
                    const category = outline.get('categories').find(category => id == category.get('id'));
                    this.refs.category.innerText = category.get('name') || '';
                } else {
                    this.refs.category.innerText = '请选择';
                }
            } else {
                this.refs.category.innerText = '请选择';
            }
            if (recordId != currentId) {
                this.refs.id.value = currentId;
            }
        }
        selectCategory (id) {
            this.setState({ category_id: id });
        }
        submitData () {
            this.props.onNewsDetailUpload(this.state.id, {
                category_id: this.state.category_id,
                title      : this.refs.title.value || '',
                article    : this.refs.article.value || '',
            });
        }
        render () {
            return (
                <div className="panel panel-sharp">
                    <div className="panel-heading">
                        编辑资讯
                        {this.state.update_time ?
                            <small className="pull-right">上次更新时间: {util.convertDateTimeStringFormat(this.state.update_time)}</small> : ''
                        }
                        <span className="pull-right">&nbsp;&nbsp;</span>
                        {this.state.supervisor_name ?
                            <small className="pull-right">上次更新者: {this.state.supervisor_name}</small> : ''
                        }
                    </div>
                    <div className="panel-body">
                        <form className="form-horizontal">
                            <input type="hidden" ref="id"/>
                            <div className="form-group">
                                <label htmlFor="titleInput"
                                       className="control-label col-sm-1">
                                    标题
                                </label>
                                <div className="col-sm-11">
                                    <input id="titleInput" ref="title"
                                           type="text"
                                           className="form-control"
                                           placeholder="title"/>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="categorySelect"
                                       className="control-label col-sm-1">
                                    分类
                                </label>
                                <div className="col-sm-11">
                                    <div className="dropdown">
                                        <a href="javascript:;" ref="category"
                                           className="btn btn-dropdown"
                                           data-toggle="dropdown" data-target="#">
                                            请选择
                                        </a>
                                        <ul className="dropdown-menu multi-level">
                                            {this.state.struct.toList().map(item =>
                                                <li key={item.get('id')} className="dropdown-submenu">
                                                    <a href="javascript:;">{item.get('name')}</a>
                                                    <ul className="dropdown-menu">
                                                        {item.get('categories').map(category =>
                                                            <li key={category.get('id')}>
                                                                <a onClick={this.selectCategory.bind(this, category.get('id'))}
                                                                   href="javascript:;">{category.get('name')}</a>
                                                            </li>
                                                        )}
                                                    </ul>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="articleInput"
                                       className="control-label col-sm-1">
                                    正文
                                </label>
                                <div className="col-sm-11">
                                    <textarea id="articleInput" ref="article"
                                              rows="10"
                                              className="form-control"
                                              placeholder="article"/>
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
            );
        }
    }

    class NewsList extends React.Component {
        constructor (props) {
            super(props);
            this.state = NewsList.getState(props);
        }
        componentWillReceiveProps (nextProps) {
            this.setState(NewsList.getState(nextProps));
            this.getData(nextProps);
        }
        componentWillMount () {
            this.getData(this.props);
        }
        getData (props) {
            const type        = props.params.type        || 'category',
                  id          = +props.query.id,
                  pageRequest = +props.query.pageRequest || +config.pageRequest,
                  pageSize    = +props.query.pageSize    || +config.pageSize;
            if (this.state.type !== type || this.state.id !== id ||
                this.state.pageRequest !== pageRequest ||
                this.state.pageSize !== pageSize) {
                this.setState({ type, id, pageRequest, pageSize });
                props.onNewsListGet(id, type, pageRequest, pageSize);
            }
        }
        static getState (state) {
            const news = !state || !state['news'] ||
                         '[object Object]' !== util.toString(state) ?
                             {} :
                             state['news'];
            if (!Immutable.List.isList(news['list'])) {
                news['list'] = Immutable.List();
            }
            if (isNaN(news['count'])) {
                news['count'] = 0;
            }

            return Object.assign({}, news);
        }
        render () {
            return (
                <div className="panel panel-sharp">
                    <div className="list-group">
                        {this.state.list.map(item =>
                            <Link to={{ pathname: "/news/detail", query: { id: item.get('id') }}}
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
                               link={`#/news/list/${this.state.type}?id=${this.state.id}&pageSize=${this.state.pageSize}&pageRequest={#page}`}/>
                    </div>
                </div>
            );
        }
    }

    class ClassificationItem extends React.Component {
        constructor (props) {
            super(props);
            this.state = { open: false };
        }
        openChild (e) {
            this.setState({ open: !this.state.open });
            e.preventDefault();
            e.stopPropagation();
        }
        render () {
            //onClick={this.props.onNewsActiveSet.bind(null, { id: this.props.id, type: 'outline' })}
            return (
                <li href="javascript:;" className="list-group-item">
                    <Link href="javascript:;"
                          to={{ pathname: '/news/list/outline', query: { id: this.props.id, }}}>
                        {this.props.name}
                        <span onClick={this.openChild.bind(this)}
                              className={'pull-right glyphicon ' + (this.state.open ? 'glyphicon-chevron-up' : 'glyphicon-chevron-down')}></span>
                    </Link>
                    <div className={'list-group' + (this.state.open ? '' : ' hidden')}>
                        {this.props.categories.map(category =>
                            <Link href="javascript:;" className="list-group-item"
                                  to={{ pathname: '/news/list/category', query: { id: category.get('id') }}}
                                  key={category.get('id')} >
                                {category.get('name')}
                            </Link>
                        )}
                    </div>
                </li>
            );
        }
    }

    const Classification = (props) => (
        <nav className="list-group row classification">
            {props.classification.map(item =>
                <ClassificationItem key={item.get('id')}
                                    id={item.get('id')}
                                    name={item.get('name')}
                                    categories={item.get('categories')}
                                    onNewsActiveSet={props.onNewsActiveSet}/>
            ).toList()}
        </nav>
    );
    Classification.defaultProps = { classification: Immutable.Map() };

    class News extends React.Component {
        constructor (props) {
            super(props);
            this.state = News.getState(props);
        }
        componentWillMount () {
            this.props.onStructGet({ all: true });
        }
        componentWillReceiveProps (nextProps) {
            this.setState(News.getState(nextProps));
        }
        static getState (state) {
            const struct = !state || !state['struct'] || '[object Object]' !== util.toString(state) ?
                    {} :
                    state['struct'];
            const news = !state || !state['news'] || '[object Object]' !== util.toString(state) ?
                    {} :
                    state['news'];

            return Object.assign({ classification: struct['all'] }, news);
        }
        render () {
            return (
                <div className="row news-container">
                    <div className="col-sm-3">
                        <div className="nav-btn-group row">
                            <Link className="btn btn-blue-dark col-sm-6 pull-right"
                                  to={{ pathname: "/news/detail", query: { id: 0 } }}>
                                发布资讯
                            </Link>
                        </div>
                        <Classification classification={this.state.classification}
                                        onNewsActiveSet={this.props.onNewsActiveSet}/>
                    </div>
                    <div className="col-sm-9">
                        {this.props.children}
                    </div>
                </div>
            );
        }
    }

    const ConnectNews = connect(mapStateToProps, mapDispatchToProps)(News),
          ConnectNewsList = connect(mapStateToProps, mapDispatchToProps)(NewsList),
          ConnectNewsDetail = connect(mapStateToProps, mapDispatchToProps)(NewsDetail);

    return {
        news: (props) => (
            <Provider store={store}>
                <ConnectNews params={props.params} query={props.location.query}
                             children={props.children}/>
            </Provider>
        ),
        newsList: (props) => (
            <Provider store={store}>
                <ConnectNewsList params={props.params} query={props.location.query}/>
            </Provider>
        ),
        newsDetail: (props) => (
            <Provider store={store}>
                <ConnectNewsDetail params={props.params} query={props.location.query}/>
            </Provider>
        )
    };
});