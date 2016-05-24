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
        }
        render () {
            return (
                <div></div>
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
            return (
                <li href="javascript:;" className="list-group-item">
                    <a href="javascript:;" onClick={this.props.onNewsActiveSet.bind(null, { id: this.props.id, type: 'outline' })}>
                        {this.props.name}
                        <span onClick={this.openChild.bind(this)}
                              className={'pull-right glyphicon ' + (this.state.open ? 'glyphicon-chevron-up' : 'glyphicon-chevron-down')}></span>
                    </a>
                    <div className={'list-group' + (this.state.open ? '' : ' hidden')}>
                        {this.props.categories.map(category =>
                            <Link href="javascript:;" className="list-group-item"
                                  to={{ pathname: "/news/list/category", query: { id: category.get('id') }}}
                                  key={category.get('id')} >
                                {category.get('name')}
                            </Link>
                        )}
                    </div>
                </li>
            );
        }
    }

    class Classification extends React.Component {
        render () {
            return (
                <nav className="list-group row classification">
                    {this.props.classification.map(item =>
                        <ClassificationItem key={item.get('id')}
                                            id={item.get('id')}
                                            name={item.get('name')}
                                            categories={item.get('categories')}
                                            onNewsActiveSet={this.props.onNewsActiveSet}/>
                    ).toList()}
                </nav>
            );
        }
    }
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