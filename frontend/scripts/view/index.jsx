'use strict';

define([
    'immutable',
    'react',
    'ReactRouter',
    'react-redux',
    'common/util',
    'common/redux_helper',
    'root/config',
    'root/store',
], function (
    Immutable, React, Router, ReactRedux,
    util, reduxHelper, config, store
) {
    const { Link }      = Router;
    const { Provider }  = ReactRedux;
    const indexNewsSize = config['style'] && config['style']['indexNews']? config['style']['indexNews']: 2,
          scrollSize    = config['style'] && config['style']['scroll']   ? config['style']['scroll']   : 0,
          resourceSize  = config['style'] && config['style']['resource'] ? config['style']['resource'] : 5;

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
        const length = props.list.size;
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
                        <ScrollItem key={index} img={item.get('img')}
                                    name={item.get('name')} desc={item.get('desc')}
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
    ScrollSection.defaultProp = { list: Immutable.List(), active: 0, play: false, coolDown: false, };

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
                      listLength = this.props.list.size;
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
    Scroll.defaultProps = { list: Immutable.List() };

    class News extends React.Component {
        constructor (props) {
            super(props);
            this.state = {
                title: '',
                list: Immutable.List(),
            };
        }
        componentDidMount () {
            if (2 === this.props.style) {
                this.setState({
                    title: '',
                    list: Immutable.fromJS([{
                        id: 1,
                        title: '标题1',
                        update_time: 1465679151054,
                    },{
                        id: 2,
                        title: '标题2',
                        update_time: 1465679151054,
                    },{
                        id: 3,
                        title: '标题3',
                        update_time: 1465679151054,
                    },{
                        id: 4,
                        title: '标题4',
                        update_time: 1465679151054,
                    },{
                        id: 5,
                        title: '标题5',
                        update_time: 1465679151054,
                    },]),
                });
            } else {
                this.setState({
                    title: '标题',
                    list: Immutable.fromJS([{
                        id: 1,
                        title: '标题1',
                        update_time: 1465679151054,
                    },{
                        id: 2,
                        title: '标题2',
                        update_time: 1465679151054,
                    },{
                        id: 3,
                        title: '标题3',
                        update_time: 1465679151054,
                    },{
                        id: 4,
                        title: '标题4',
                        update_time: 1465679151054,
                    },{
                        id: 5,
                        title: '标题5',
                        update_time: 1465679151054,
                    },]),
                });
            }
        }
        render () {
            return (
                <div className="col-sm-4">
                    <div className={"panel panel-index row style-" + this.props.style}>
                        <div className="panel-heading">
                            {this.state.title || this.props.name || '新闻'}
                            <Link to={{ pathname: `/browse/news/${this.props.type}`, query: { id: this.props.id }}}
                                  className="more">
                                查看更多
                            </Link>
                        </div>
                        {1 === this.props.style ? (
                            <div className={"list-group " + ['light-blue', 'blue', 'gray', 'cyan'][Math.floor(4 * Math.random())]}>
                                {this.state.list.map(item => (
                                    <Link className="list-group-item" key={item.get('id')}
                                          to={{ pathname: '/browse/detail', query: { id: item.get('id') }}}>
                                        <span className="time">
                                            <span className="month">
                                                {['JAN','FEB','MAR','APR','MAY','JUN',
                                                    'JUL','AUG','SEPT','OCT','NOV','DEC'][new Date(item.get('update_time')).getMonth()]}
                                            </span>
                                            <span className="date">
                                                {new Date(item.get('update_time')).getDate()}
                                            </span>
                                        </span>
                                        <span className="title">
                                            {item.get('title')}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="list-group">
                                {this.state.list.map(item => (
                                    <Link className="list-group-item" key={item.get('id')}
                                          to={{ pathname: '/browse/detail', query: { id: item.get('id') }}}>
                                        <span className="title">
                                            {item.get('title')}
                                        </span>
                                        <span className="time">
                                            {util.convertDateTimeStringToDate(item.get('update_time'))}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            );
        }
    }
    News.defaultProps = { id: 0, type: 'category', name: '', style: 1 };

    const Resource = (props) => (
        <div className="col-sm-4">
            <div className="panel panel-index style-3 row">
                <div className="panel-heading">资源下载</div>
                <div className="list-group">
                    {props.list.map((item) => (
                        <a className="list-group-item" href={`${uploadUrl}${item.get('path')}`}
                           key={item.get('id')} target="_blank">
                            {item.get('title')}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
    Resource.defaultProps = { list: Immutable.List() };

    class Index extends React.Component {
        constructor (props) {
            super(props);
            this.state = Index.getState(props);
        }
        componentWillReceiveProps (nextProps) {
            this.setState(Index.getState(nextProps));
        }
        componentWillMount () {
            this.props.onResourceListGet(0, 5);
        }
        static getState (state) {
            let scrollList =
                !state || !state['style'] || !state['style']['scroll'] ||
                !Immutable.List.isList(state['style']['scroll']) ?
                    Immutable.List() :
                    state['style']['scroll'];
            let newsList =
                !state || !state['style'] || !state['style']['indexNews'] ||
                !Immutable.List.isList(state['style']['indexNews']) ?
                    Immutable.List() :
                    state['style']['indexNews'];
            let resourceList =
                !state || !state['resource'] || !state['resource']['list'] ||
                !Immutable.List.isList(state['resource']['list']) ?
                    Immutable.List() :
                    state['resource']['list'];
            scrollList   = scrollList.slice(0, scrollSize || scrollList.length);
            newsList     = newsList.slice(0, indexNewsSize || newsList.length);
            resourceList = resourceList.slice(0, resourceSize || resourceList.length);
            return { scrollList, newsList, resourceList };
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
                    <div className="row index-news-container">
                        {/*newsArray.map((news) =>
                            <News id={news.id} title={news.title}/>
                        )*/}
                        <News list={this.state.resourceList} style={1}/>
                        <News list={this.state.resourceList} style={2}/>
                        <Resource list={this.state.resourceList}/>
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