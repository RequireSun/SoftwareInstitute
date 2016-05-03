'use strict';

define([
    'react',
    'react-redux',
    'common/redux_helper',
    'root/store',
    'view/public',
    'common/util',
], function (React, ReactRedux, reduxHelper, store, templatePublic, commonUtil) {
    const { Provider }            = ReactRedux;
    const { TitleLine, Shortcut } = templatePublic;

    class NewsDetail extends React.Component {
        constructor (props) {
            super(props);
            this.state = NewsDetail.getState(props);
        }
        componentWillReceiveProps (nextProps) {
            this.setState(NewsDetail.getState(nextProps));
            this.getData(nextProps);
        }
        componentWillMount () {
            this.getData(this.props);
        }
        static getState (state) {
            const detail = !state || !state['detail'] ||
                           '[object Object]' !== commonUtil.toString(state) ?
                               {} :
                               state['detail'];
            return detail;
        }
        getData (props) {
            const id = +props.query.id;
            if (this.state.id !== id) {
                this.setState({ id });
                props.onNewsDetailGet(id);
            }
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
                                            <TitleLine title={this.state.title}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="content-container container">
                        <div className="row">
                            <div className="detail-container col-xs-12 col-sm-9 col-sm-offset-3">
                                <section className="information">
                                    发布时间: {commonUtil.convertDateTimeStringFormat(this.state.update_time) || new Date} |
                                    发布者: {this.state.supervisor_name || ''} |
                                    浏览量: {this.state.page_view || 0}
                                </section>
                                <article>
                                    {this.state.article}
                                </article>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }

    const ConnectNewsDetail = ReactRedux.connect(reduxHelper.mapStateToProps, reduxHelper.mapDispatchToProps)(NewsDetail);

    return (props) => {
        return (
            <Provider store={store}>
                <ConnectNewsDetail params={props.params} query={props.location.query}/>
            </Provider>
        );
    };
    // 新闻详情控件
    // var Detail = React.createClass({
    //     mixins: [actionNews, commonUtil],
    //     getData: function (id) {
    //         if (!id) {
    //             location.hash = '#notFound/请输入正确的新闻 ID！';
    //             return ;
    //         }
    //         this.NewsGet(function (err, data) {
    //             if (err) {
    //                 location.hash = '#notFound/' + err;
    //                 return ;
    //             }
    //             this.setState({
    //                 title: data.title,
    //                 supervisorName: data.supervisor_name,
    //                 article: data.article,
    //                 updateTime: data.update_time,
    //                 pageView: data.page_view
    //             });
    //         }.bind(this), id);
    //     },
    //     getInitialState: function () {
    //         return {
    //             id: this.props.params.newsId,
    //             title: '',
    //             supervisorName: '',
    //             article: '',
    //             updateTime: '',
    //             pageView: 0
    //         };
    //     },
    //     componentWillReceiveProps: function (nextProps) {
    //         this.setState({
    //             id: nextProps.params.id,
    //             title: '',
    //             supervisorName: '',
    //             article: '',
    //             updateTime: '',
    //             pageView: 0
    //         }, function () {
    //             this.getData(this.state.id);
    //         });
    //     },
    //     componentWillMount: function () {
    //         this.getData(this.state.id);
    //     },
    //     render: function () {
    //         return (
    //             <div className="container">
    //                 <div className="row">
    //                     <TitleLine title={this.state.title}/>
    //                 </div>
    //                 <div className="row">
    //                     <div className="col-sm-3 hidden-xs">
    //                         <Shortcut/>
    //                     </div>
    //                     <div className="col-sm-9">
    //                         <p>发布者 {this.state.supervisorName} 发布时间 {this.ConvertDateTimeFormat(this.state.updateTime)} 浏览量 {this.state.pageView}</p>
    //                         <article>{this.state.article}</article>
    //                     </div>
    //                 </div>
    //             </div>
    //         );
    //     }
    // });
    // return Detail;
});