'use strict';

define([
    'react',
    'ReactRouter',
    'react-redux',
    'common/util',
    'common/redux_helper',
    'root/config',
    'root/store',
    'action/news',
    'action/resource',
], function (React, Router, ReactRedux, commonUtil, reduxHelper, config, store, actionNews, actionResource) {
    const { Link }      = Router;
    const { Provider }  = ReactRedux;
    const scrollSize    = config['style'] && config['style']['scroll']    ? config['style']['scroll']    : 0;

    const ScrollItem = (props) => (
        <li>
            <figure>
                <img src={props['img']} alt={props['name']}/>
                <div className="content">
                    <figurecaption>{props['name']}</figurecaption>
                    <article>{props['desc']}</article>
                </div>
            </figure>
        </li>
    );

    const Scroll = (props) => (
        <div className="row scroll-container">
            <section className="scroll-section scroll-shadow left">
                <ul>
                    {props.list.map((item, index) =>
                        <ScrollItem key={index} {...item}/>
                    )}
                </ul>
            </section>
            {/*<section className="scroll-section">>
                <ul>
                    {props.list.map((item, index) =>
                        <ScrollItem key={index} {...item}/>
                    )}
                </ul>
            </section>
            <section className="scroll-section scroll-shadow right">>
                <ul>
                    {props.list.map((item, index) =>
                        <ScrollItem key={index} {...item}/>
                    )}
                </ul>
            </section>*/}
        </div>
    );

    class News extends React.Component {
        constructor (props) {
            super(props);
            this.state = {
                id      : props.id,
                title   : props.title,
                newsList: [],
            };
        }
        render () {
            return (
                <div className="col-sm-4">
                    <h4>{this.state.title || '暂无内容'}</h4>
                    <div className="list-group">
                        {this.state.newsList.map((news) => (
                            <Link className="list-group-item" to="detail" params={{ newsId: news.id }}>
                                {news.title}
                                <span className="pull-right">
                                    {commonUtil.convertDateTimeToDate(news.update_time)}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            );
        }
    }

    class Resource extends React.Component {
        constructor (props) {
            super(props);
            this.state = {
                resourceList: [],
            };
        }
        componentWillMount () {}
        render () {
            return (
                <div className="col-sm-4">
                    <h4>资源下载</h4>
                    <div className="list-group">
                        {this.state.resourceList.map((resource) => (
                            <a className="list-group-item" href={resource.path}>
                                {resource.title}
                                <span className="pull-right">
                                    {commonUtil.convertDateTimeToDate(resource.update_time)}
                                </span>
                            </a>
                        ))}
                    </div>
                </div>
            );
        }
    }

    class Index extends React.Component {
        constructor (props) {
            super(props);
            this.state = Index.getState(props);
        }
        componentWillReceiveProps (nextProps) {
            this.setState(Index.getState(nextProps));
        }
        static getState (state) {
            let scrollList =
                !state || !state['style'] || !state['style']['scroll'] ||
                !Array.isArray(state['style']['scroll']) ?
                    [] :
                    state['style']['scroll'];
            scrollList = scrollList.slice(0, scrollSize || scrollList.length);
            return { scrollList };
        }
        render () {
            // var newsArray = [], newsCount = 0;
            // for (var i in this.state.outlines) {
            //     newsArray.push({
            //         id: this.state.outlines[i].id,
            //         title: i
            //     })
            // }
            // newsArray = newsArray.slice(0, 2);
            // while (2 > newsArray.length) {
            //     newsArray.push({});
            // }
            return (
                <div className="container">
                    <Scroll list={this.state.scrollList}/>
                    <div className="row">
                        {/*newsArray.map((news) =>
                            <News id={news.id} title={news.title}/>
                        )*/}
                        <Resource/>
                    </div>
                </div>
            );
        }
    }

    const ConnectIndex = ReactRedux.connect(reduxHelper.mapStateToProps, reduxHelper.mapDispatchToProps)(Index);

    return () =>
        (<Provider store={store}>
            <ConnectIndex/>
        </Provider>);
});

// var News = React.createClass({
//     mixins: [actionNews, commonUtil],
//     getData: function (id) {
//         this.NewsList(function (err, data) {
//             if (err) {
//                 location.hash = '#notFound/' + err;
//                 return ;
//             }
//             this.setState({
//                 newsList: data.data ? data.data : []
//             });
//         }.bind(this), 'outline', id, 5, 1);
//     },
//     getInitialState: function () {
//         return {
//             id: this.props.id,
//             title: this.props.title,
//             newsList: []
//         };
//     },
//     componentWillReceiveProps: function (nextProps) {
//         this.setState({
//             id: nextProps.id,
//             title: nextProps.title,
//             newsList: []
//         }, function () {
//             this.getData(this.state.id);
//         });
//     },
//     componentWillMount: function () {
//         this.getData(this.state.id);
//     },
//     render: function () {
//         return (
//             <div className="col-sm-4">
//                 <h4>{this.state.title ? this.state.title : '暂无内容'}</h4>
//                 <div className="list-group">
//                     {
//                         this.state.newsList.map(function (news) {
//                             return (<Link className="list-group-item" to="detail" params={{ newsId: news.id }}>{news.title}<span className="pull-right">{this.ConvertDateTimeToDate(news.update_time)}</span></Link>);
//                         }.bind(this))
//                     }
//                 </div>
//             </div>
//         );
//     }
// });

// var Resource = React.createClass({
//     mixins: [actionResource, commonUtil],
//     getData: function () {
//         this.ResourceList(function (err, data) {
//             if (err) {
//                 location.hash = '#notFound/' + err;
//                 return ;
//             }
//             this.setState({
//                 resourceList: data.data ? data.data : []
//             });
//         }.bind(this), 5, 1);
//     },
//     getInitialState: function () {
//         return {
//             resourceList: []
//         };
//     },
//     componentWillMount: function () {
//         this.getData();
//     },
//     render: function () {
//         return (
//             <div className="col-sm-4">
//                 <h4>资源下载</h4>
//                 <div className="list-group">
//                     {
//                         this.state.resourceList.map(function (resource) {
//                             return (<a className="list-group-item" href={resource.path}>{resource.title}<span className="pull-right">{this.ConvertDateTimeToDate(resource.update_time)}</span></a>);
//                         }.bind(this))
//                     }
//                 </div>
//             </div>
//         );
//     }
// });

// var Index = React.createClass({
//     mixins: [actionNews],
//     getInitialState: function () {
//         return {
//             outlines: {}
//         };
//     },
//     componentWillMount: function () {
//         this.Struct(function (err, data) {
//             if (err) {
//                 location.hash = '#notFound/' + err;
//                 return ;
//             }
//             this.setState({
//                 outlines: data
//             });
//         }.bind(this));
//     },
//     render: function () {
//         var newsArray = [], newsCount = 0;
//         for (var i in this.state.outlines) {
//             newsArray.push({
//                 id: this.state.outlines[i].id,
//                 title: i
//             })
//         }
//         newsArray = newsArray.slice(0, 2);
//         while (2 > newsArray.length) {
//             newsArray.push({});
//         }
//         return (
//             <div className="container">
//                 <Scroll/>
//                 <div className="row">
//                     {
//                         newsArray.map(function (news) {
//                             return <News id={news.id} title={news.title}/>;
//                         })
//                     }
//                     <Resource/>
//                 </div>
//             </div>
//         );
//     }
// });