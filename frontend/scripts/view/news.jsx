'use strict';

define([
    'immutable',
    'react',
    'ReactRouter',
    'react-redux',
    'common/redux_helper',
    'root/config',
    'root/store',
    'common/util',
    'view/public',
], (Immutable, React, ReactRouter, ReactRedux, reduxHelper, config, store, commonUtil, templatePublic) => {
    const { Link }     = ReactRouter;
    const { Provider } = ReactRedux;
    const TitleLine    = templatePublic.TitleLine,
          Shortcut     = templatePublic.Shortcut,
          Pager        = templatePublic.Pager;

    const NewsItem = (props) => (
        <li>
            <Link to={{ pathname: "/browse/detail", query: { id: props.id }}}>
                {props.title}
                <span className="pull-right">
                    {commonUtil.convertDateTimeStringToDate(props.update_time)}
                </span>
            </Link>
        </li>
    );
    
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
                         '[object Object]' !== commonUtil.toString(state) ?
                         {} :
                         state['news'];
            // if (!Array.isArray(news['list'])) {
            //     news['list'] = [];
            // }
            if (!Immutable.List.isList(news['list'])) {
                news['list'] = Immutable.List();
            }
            if (isNaN(news['count'])) {
                news['count'] = 0;
            }
            const struct = !state || !state['struct'] ||
                           '[object Object]' !== commonUtil.toString(state) ?
                               {} :
                               state['struct'];

            return Object.assign({}, news, struct);
        }
        render () {
            const titleText = (this.state[this.state.type || 'category'] || Immutable.List()).find(item =>
                this.state.id === item.get('id')
            ).get('name') || '新闻列表';

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
                                            <TitleLine title={titleText}/>
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
                                        <NewsItem key={item.get('id')} id={item.get('id')}
                                                  title={item.get('title')}
                                                  update_time={item.get('update_time')}/>
                                    )}
                                </ul>
                                <div className="pull-right">
                                    <Pager current={this.state.pageRequest} max={this.state.count}
                                           link={`#/browse/news/${this.state.type}?id=${this.state.id}&pageSize=${this.state.pageSize}&pageRequest={#page}`}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }

    const ConnectNewsList = ReactRedux.connect(reduxHelper.mapStateToProps, reduxHelper.mapDispatchToProps)(NewsList);

    return (props) => (
        <Provider store={store}>
            <ConnectNewsList params={props.params} query={props.location.query}/>
        </Provider>
    );
});