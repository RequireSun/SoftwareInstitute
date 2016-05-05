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
    const scrollSize    = config['style'] && config['style']['scroll'] ? config['style']['scroll'] : 0;
          // scrollTime    = config['time']  && config['time']['scroll']  ? config['time']['scroll']  : 2000;

    class ScrollItem extends React.Component {
        constructor (props) {
            super(props);
        }
        componentDidMount () {
            this.refs.root.className = ScrollItem.judgeClassName(this.props.pos);
        }
        componentDidUpdate (prevProps, prevState) {
            const root = this.refs.root,
                  pos  = this.props.pos;
            if (!prevProps.pos && ('left' === pos || 'right' === pos)) {
                // 为了保证图片的正常显示层次
                root.className = ScrollItem.judgeClassName(pos).replace(/^.*\s/, '');
                setTimeout(() =>
                    root.className = ScrollItem.judgeClassName(pos)
                , 20);
            } else {
                root.className = ScrollItem.judgeClassName(pos);
            }
        }
        static judgeClassName (pos) {
            switch (pos) {
                case 'left':
                    return 'transition-translateX transform-translateLeft';
                case 'center':
                    return 'transition-translateX transform-translateCenter';
                case 'right':
                    return 'transition-translateX transform-translateRight';
                default:
                    return '';
            }
        }
        render () {
            return (
                <li ref="root">
                    <figure>
                        <img src={this.props['img']} alt={this.props['name']}/>
                        <div className="content">
                            <figcaption>{this.props['name']}</figcaption>
                            <article>{this.props['desc']}</article>
                        </div>
                    </figure>
                </li>
            );
        }
    }

    const ScrollSection = (props) => {
        const length = props.list.length;
        const left   = (props.active - 1 + length) % length,
              center = props.active,
              right  = (props.active + 1) % length;
        const pos    = props.pos || '';
        return (
            <section className={
                     "scroll-section " +
                     (props.showShadow ? " scroll-shadow " : "") +
                     pos}>
                <ul>
                    {props.list.map((item, index) =>
                        <ScrollItem key={index} {...item}
                                    pos={left === index ? 'left' :
                                         center === index ? 'center' :
                                         right === index ? 'right' : ''}/>
                    )}
                </ul>
                {props.showController ? [
                    <div className="scroll-controller-order prev"
                         key="prev"
                         onClick={props.round.bind(null, true)}>
                        <span className="glyphicon glyphicon-chevron-left"></span>
                    </div>,
                    <div className="scroll-controller-order next"
                         key="next"
                         onClick={props.round.bind(null, false)}>
                        <span className="glyphicon glyphicon-chevron-right"></span>
                    </div>,
                    <div className="scroll-controller-play"
                         key="play"
                         onClick={props.autoRound}>
                        <span className={"glyphicon glyphicon-" + (!!props.play ? "play" : "pause")}></span>
                    </div>
                ] : ''}
            </section>
        );
    };
    ScrollSection.defaultProp = { list: [], active: 0, play: false, coolDown: false, };

    class Scroll extends React.Component {
        constructor (props) {
            super(props);
            this.state = {
                active: 0,
                play  : false,
                coolDown: false,
            };
        }
        componentDidMount () {
            this.autoRound();
        }
        componentWillUnmount () {
            !!this.state.interval && window.clearInterval(this.state.interval);
        }
        autoRound () {
            if (!this.state.play) {
                const interval = window.setInterval(() =>
                    this.round()
                , 3000);

                this.setState({ play: true, interval, });
            } else {
                window.clearInterval(this.state.interval);
                this.setState({ play: false, interval: 0, });
            }
        }
        round (isReverse = false) {
            if (!this.state.coolDown) {
                const lastActive = this.state.active,
                      listLength = this.props.list.length;
                const active = !isReverse ?
                                   ((lastActive + 1) % listLength) :
                                   ((lastActive - 1 + listLength)) % listLength;
                this.setState({
                        active,
                        coolDown: true
                    }, () =>
                        setTimeout(() =>
                            this.setState({ coolDown: false }),
                        1500
                    )
                );
            }
        }
        render () {
            const list = this.props.list;
            const prev = list.slice(-1).concat(list.slice(0, -1)),
                  next = list.slice(1).concat(list.slice(0, 1));
            return (
                <div className="row scroll-container">
                    <ScrollSection key="left" list={prev} pos="left" {...this.state}
                                   showController={false} showShadow={true}
                                   round={this.round.bind(this)} autoRound={this.autoRound.bind(this)}/>
                    <ScrollSection key="center" list={list} pos="center" {...this.state}
                                   showController={true} showShadow={false}
                                   round={this.round.bind(this)} autoRound={this.autoRound.bind(this)}/>
                    <ScrollSection key="right" list={next} pos="right" {...this.state}
                                   showController={false} showShadow={true}
                                   round={this.round.bind(this)} autoRound={this.autoRound.bind(this)}/>
                </div>
            );
        }
    }
    Scroll.defaultProps = { list: [] };

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