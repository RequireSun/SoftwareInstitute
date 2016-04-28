'use strict';

define([
    'react',
    'ReactRouter',
    'react-redux',
    'common/util',
    'common/redux_helper',
    'root/config',
    'root/store',
    'action/news'
], (React, Router, ReactRedux, commonUtil, reduxHelper, config, store, actionNews) => {
    const { Link } = Router;
    const { Provider } = ReactRedux;
    const pagerSize     = config['pagerSize']   || 2,
          pageSize      = config['pageSize']    || 20,
          pageRequest   = config['pageRequest'] || 0,
          navigatorSize = config['style'] && config['style']['navigator'] ? config['style']['navigator'] : 7,
          headerSize    = config['style'] && config['style']['header']    ? config['style']['header']    : 0,
          footerSize    = config['style'] && config['style']['footer']    ? config['style']['footer']    : 2,
          shortcutSize  = config['style'] && config['style']['shortcut']  ? config['style']['shortcut']  : 0;
    // TODO page 的 prop state 逻辑明显不对
    /**
     * 页码生成组件
     * @param   current 当前页码
     * @param   max     总页码数
     * @param   link    页码链接, 字符串, 其中需要有 {#page} 标记, 用于将此处替换为请求的页码
     */
    class Pager extends React.Component {
        constructor (props) {
            super(props);
        }
        render () {
            let tempCurrent = this.props.current,
                tempMax     = this.props.max,
                tempLink    = this.props.link || '';
            let pagerArray  = [tempCurrent];
            // 生成对应的前一页 / 后一页
            const prevLink = tempCurrent <= 0 ?
                (<li className="disabled">
                    <a href={tempLink.replace(/\{#page}/, tempCurrent + '')}>&laquo;</a>
                </li>) :
                (<li>
                    <a href={tempLink.replace(/\{#page}/, tempCurrent - 1 + '')}>&laquo;</a>
                </li>);
            const nextLink = tempCurrent >= tempMax ?
                (<li className="disabled">
                    <a href={tempLink.replace(/\{#page}/, tempCurrent + '')}>&raquo;</a>
                </li>) :
                (<li>
                    <a href={tempLink.replace(/\{#page}/, +tempCurrent + 1 + '')}>&raquo;</a>
                </li>);
            // 来回徘徊插值, 确保页码尺寸最合理
            for (
                let pagerCount = 1;
                 pagerArray.length < 2 * pagerSize + 1 && pagerCount < 2 * pagerSize + 1;
                ++pagerCount
            ) {
                if (tempCurrent - pagerCount >= 0) {
                    pagerArray.push(tempCurrent - pagerCount);
                }
                if (tempCurrent + pagerCount <= tempMax) {
                    pagerArray.push(tempCurrent + pagerCount);
                }
            }
            pagerArray = pagerArray.sort();
            return (
                <ul className="pagination">
                    {prevLink}
                    {pagerArray.map(pager =>
                        // pageCurrent 是字符串, pager 是数字
                        (<li className={pager == tempCurrent ? 'active' : ''}>
                            <a href={tempLink.replace(/\{#page}/, pager)}>{pager}</a>
                        </li>)
                    )}
                    {nextLink}
                </ul>
            );
        }
    }
    // TODO 没有兼容 name - link 式
    // 导航栏的单个选项列表
    const NavigatorItem = props => (
        <li className="dropdown">
            {!!props.list && !!props.list.length ? [
                <a href="javascript:;" className="dropdown-toggle" data-toggle="dropdown" role="button">
                    {props.name}
                </a>,
                <div><span className="glyphicon glyphicon-chevron-down"></span></div>,
                <ul className="dropdown-menu">
                    {props.list.map(item =>
                        <li>
                            {!!item['id'] ?
                                <Link to="newsList" params={{ newsType: item['type'] }}
                                      query={{ id: item['id'], pageSize, pageRequest }}>
                                    {item['name']}
                                </Link> :
                                <a href={item['link'] || 'javascript:;'}>{item['name']}</a>
                            }
                        </li>
                    )}
                </ul>
            ] : (
                !!props.id ?
                    <Link to="newsList" params={{ newsType: props.type }}
                        query={{ id: props.id, pageSize, pageRequest }}
                        className="dropdown-toggle">
                        {props.name}
                    </Link> :
                    <a href={props.link}>{props.name}</a>
            )}
        </li>
    );
    NavigatorItem.defaultProps = { title: '', id: 0, type: 'category', category: [], };
    // 导航栏
    class Navigation extends React.Component {
        constructor (props) {
            super(props);
            this.state = this.getState(props);
        }
        componentWillReceiveProps (nextProps) {
            this.setState(getState(nextProps));
        }
        getState (state) {
            let list =
                !state || !state['style'] || !state['style']['navigator'] ||
                !Array.isArray(state['style']['navigator']) ?
                    [] :
                    state['style']['navigator'];
            list = list.slice(0, navigatorSize || list.length);
            return { list };
        }
        render () {
            return (
                <div className="navbar navigation">
                    <div className="container">
                        <div className="navbar-header visible-xs">
                            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navigator-collapse-all">
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </button>
                            <a className="navbar-brand" href="#">哈尔滨工业大学(威海)</a>
                        </div>
                        <div className="collapse navbar-collapse" id="navigator-collapse-all">
                            <ul className="nav navbar-nav">
                                <li><Link to="index">首页</Link></li>
                                {this.state.list.map(item =>
                                    <NavigatorItem {...item}/>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            );
        }
    }
    Navigation.defaultProps = { navigator: [] };
    // 页脚的单个选项列表
    const FooterItem = props => (
        <ul className="nav nav-pills nav-stacked">
            {props.title}
            {props.category.map(item =>
                <li>
                    <Link to="newsList" params={{ newsType: item['type'] }}
                          query={{ id: item['id'], pageSize, pageRequest }}>{item['name']}</Link>
                </li>
            )}
        </ul>
    );
    FooterItem.defaultProps = { title: '', category: [] };
    // 页脚
    class Footer extends React.Component {
        constructor (props) {
            super(props);
            this.state = this.getState(props);
        }
        componentWillReceiveProps (nextProps) {
            this.setState(getState(nextProps));
        }
        getState (state) {
            let list =
                !state || !state['style'] || !state['style']['footer'] ||
                !Array.isArray(state['style']['footer']) ?
                    [] :
                    state['style']['footer'];
            list = list.slice(0, footerSize || list.length);
            return { list };
        }
        render () {
            return (
                <div className="container-fluid">
                    <div className="container">
                        {this.state.list.map(item =>
                            <FooterItem id={item['id']} type={item['type']}
                                            title={item['name']} category={item['list']}/>
                        )}
                    </div>
                </div>
            );
        }
    }
    Footer.defaultProps = { footer: [] };
    // 每个页面里面左边的快捷入口
    class Shortcut extends React.Component {
        constructor (props) {
            super(props);
            this.state = this.getState(props);
        }
        componentWillReceiveProps (nextProps) {
            this.setState(getState(nextProps));
        }
        getState (state) {
            let list =
                !state || !state['style'] || !state['style']['shortcut'] ||
                !Array.isArray(state['style']['shortcut']) ?
                    [] :
                    state['style']['shortcut'];
            list = list.slice(0, shortcutSize || list.length);
            return { list };
        }
        render () {
            return (
                <div className="list-group">
                    {this.state.list.map(item =>
                        <Link className="list-group-item" to="newsList"
                              params={{ newsType: item['type'] }}
                              query={{ id: item['id'], pageSize, pageRequest }}>{item['name']}</Link>
                    )}
                    <Link className="list-group-item" to="resource"
                          query={{ pageSize, pageRequest }}>资源下载</Link>
                </div>
            );
        }
    }
    Shortcut.defaultProps = { shortcut: [] };
    // 标题栏
    const TitleLine = ({ title }) => (
        <header>title</header>
    );
    TitleLine.defaultProps = { title: '' };

    class HeaderLine extends React.Component {
        constructor (props) {
            super(props);
            this.state = this.getState(props);
        }
        componentWillReceiveProps (nextProps) {
            this.setState(getState(nextProps));
        }
        getState (state) {
            let list =
                !state || !state['style'] || !state['style']['header'] ||
                !Array.isArray(state['style']['header']) ?
                    [] :
                    state['style']['header'];
            list = list.slice(0, headerSize || list.length);
            return { list };
        }
        render () {
            return (
                <div className="container hidden-xs header">
                    <div className="row">
                        <div className="col-sm-6">
                            <a href="#" className="logo">
                                <img src="/public/images/LogoTitle.png" alt="首页"/>
                            </a>
                        </div>
                        <div className="col-sm-6 child-right">
                            <div>
                                <ul className="breadcrumb">
                                    {this.state.list.map(item =>
                                        <li>
                                            <Link to="newsList" params={{ newsType: item['type'] }}
                                                  query={{ id: item['id'], pageSize, pageRequest }}>{item['name']}</Link>
                                        </li>
                                    )}
                                </ul>
                            </div>
                            <div>
                                <form action="#">
                                    <input type="search"/>
                                    <button type="submit"><span className="glyphicon glyphicon-search"></span></button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }

    // var Pager = React.createClass({
    //     getInitialState: function () {
    //         return {
    //             current: this.props.current,
    //             max: this.props.max,
    //             link: this.props.link
    //         };
    //     },
    //     componentWillReceiveProps: function (nextProps) {
    //         this.setState({
    //             current: nextProps.current,
    //             max: nextProps.max,
    //             link: nextProps.link
    //         });
    //     },
    //     render: function () {
    //         var pagerArray = [];
    //         var tempCurrent = this.state.current,
    //             tempLink = this.state.link || '';
    //         // 生成对应的前一页 / 后一页
    //         var prevLink = tempCurrent <= 1 ? (<li className="disabled"><a href={tempLink.replace(/\{\#page\}/, tempCurrent)}>&laquo;</a></li>) : (<li><a href={tempLink.replace(/\{\#page\}/, tempCurrent - 1)}>&laquo;</a></li>),
    //             nextLink = tempCurrent >= this.state.max ? (<li className="disabled"><a href={tempLink.replace(/\{\#page\}/, tempCurrent)}>&raquo;</a></li>) : (<li><a href={tempLink.replace(/\{\#page\}/, tempCurrent - 0 + 1)}>&raquo;</a></li>);
    //         for (var i = Math.max(1, tempCurrent - pagerSize), l = Math.min(2 * pagerSize + i, this.state.max); i <= l; ++i) {
    //             pagerArray.push(i);
    //         }
    //         return (
    //             <ul className="pagination">
    //                 {prevLink}
    //                 {
    //                     pagerArray.map(function (pager) {
    //                         // pageCurrent 是字符串, pager 是数字
    //                         var activeClass = pager == tempCurrent ? 'active' : '';
    //                         return (<li className={activeClass}><a href={tempLink.replace(/\{\#page\}/, pager)}>{pager}</a></li>);
    //                     })
    //                 }
    //                 {nextLink}
    //             </ul>
    //         );
    //     }
    // });

    // var NavigatorCategory = React.createClass({
    //     getInitialState: function () {
    //         return {
    //             title: this.props.title,
    //             category: this.props.category
    //         };
    //     },
    //     componentWillReceiveProps: function (nextProps) {
    //         this.setState({
    //             title: nextProps.title,
    //             category: nextProps.category
    //         });
    //     },
    //     render: function () {
    //         var category = [], tempCategory = this.state.category;
    //         for (var i in tempCategory) {
    //             category.push(
    //                 <li>
    //                     <Link to="news" params={{ newsType: 'category' }} query={{ id: i, pageSize: pageSize, pageRequest: pageRequest }}>{tempCategory[i]}</Link>
    //                 </li>
    //             );
    //         }
    //         return (
    //             <li className="dropdown">
    //                 <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button">{this.state.title}<span className="caret"></span></a>
    //                 <ul className="dropdown-menu">
    //                     {category}
    //                 </ul>
    //             </li>
    //         );
    //     }
    // });

    // var Navigation = React.createClass({
    //     mixins: [actionNews, commonUtil],
    //     getInitialState: function () {
    //         return {
    //             navigatorCategory: {}
    //         };
    //     },
    //     componentWillMount: function () {
    //         this.StyleCategory(function (err, data) {
    //             if (err) {
    //                 location.hash = '#notFound/' + err;
    //             } else {
    //                 this.setState({
    //                     navigatorCategory: data
    //                 });
    //             }
    //         }.bind(this), 'navigator');
    //     },
    //     render: function () {
    //         var navigatorCategory = [], tempCategory = this.state.navigatorCategory;
    //         for (var i in tempCategory) {
    //             if (i !== 'null' && this.HasOwnProperty(tempCategory, i)) {
    //                 navigatorCategory.push(<NavigatorCategory title={i} category={tempCategory[i]}/>);
    //             }
    //         }
    //         return (
    //             <div className="navbar navbar-default">
    //                 <div className="container">
    //                     <div className="navbar-header">
    //                         <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navigator-collapse-all">
    //                             <span className="icon-bar"></span>
    //                             <span className="icon-bar"></span>
    //                             <span className="icon-bar"></span>
    //                         </button>
    //                         <a className="navbar-brand" href="#">Brand</a>
    //                     </div>
    //                     <div className="collapse navbar-collapse" id="navigator-collapse-all">
    //                         <ul className="nav navbar-nav">
    //                             <li><Link to="index">首页</Link></li>
    //                             {navigatorCategory}
    //                         </ul>
    //                     </div>
    //                 </div>
    //             </div>
    //         );
    //     }
    // });

    // 导航栏的单个选项列表
    // var FooterCategory = React.createClass({
    //     getInitialState: function () {
    //         return {
    //             title: this.props.title,
    //             category: this.props.category
    //         };
    //     },
    //     componentWillReceiveProps: function (nextProps) {
    //         this.setState({
    //             title: nextProps.title,
    //             category: nextProps.category
    //         });
    //     },
    //     render: function () {
    //         var category = [], tempCategory = this.state.category;
    //         for (var i in tempCategory) {
    //             category.push(
    //                 <li>
    //                     <Link to="news" params={{ newsType: 'category' }} query={{ id: i, pageSize: pageSize, pageRequest: pageRequest }}>{tempCategory[i]}</Link>
    //                 </li>
    //             );
    //         }
    //         return (
    //             <ul className="nav nav-pills nav-stacked">
    //                 {this.state.title}
    //                 {category}
    //             </ul>
    //         );
    //     }
    // });
    // var Footer = React.createClass({
    //     mixins: [actionNews, commonUtil],
    //     getInitialState: function () {
    //         return {
    //             footerCategory: []
    //         }
    //     },
    //     componentWillMount: function () {
    //         this.StyleCategory('footer', function (err, data) {
    //             if (err) {
    //                 location.hash = '#notFound/' + err;
    //             } else {
    //                 this.setState({
    //                     footerCategory: data
    //                 });
    //             }
    //         }.bind(this));
    //     },
    //     render: function () {
    //         console.log(this.state.footerCategory);
    //         var footerCategory = [], tempCategory = this.state.footerCategory;
    //         for (var i in tempCategory) {
    //             if (i !== 'null' && this.HasOwnProperty(tempCategory, i)) {
    //                 footerCategory.push(<FooterCategory title={i} category={tempCategory[i]}/>);
    //             }
    //         }
    //         footerCategory = footerCategory.slice(0, 2);
    //         return (
    //             <div className="container-fluid" style={{ backgroundColor: 'black' }}>
    //                 <div className="container">
    //                     {footerCategory}
    //                 </div>
    //             </div>
    //         );
    //     }
    // });

    // 快捷入口单项
    // var ShortcutItem = React.createClass({
    //     getInitialState: function () {
    //         return {
    //             id: this.props.id,
    //             title: this.props.title,
    //             newsType: this.props.newsType
    //         };
    //     },
    //     componentWillReceiveProps: function (nextProps) {
    //         this.setState({
    //             id: nextProps.id,
    //             title: nextProps.title,
    //             newsType: nextProps.newsType
    //         });
    //     },
    //     render: function () {
    //         return (
    //             <Link className="list-group-item" to="news" params={{ newsType: this.state.newsType }} query={{ id: this.state.id, pageSize: pageSize, pageRequest: pageRequest }}>{this.state.title}</Link>
    //         );
    //     }
    // });

    // 每个页面里面左边的快捷入口
    // var Shortcut = React.createClass({
    //     mixins: [actionNews, commonUtil],
    //     getData: function () {
    //         this.StyleCategory(function (err, data) {
    //             if (err) {
    //                 location.hash = '#notFound/' + err;
    //             } else {
    //                 this.setState({
    //                     shortcutCategory: data
    //                 });
    //             }
    //         }.bind(this), 'shortcut');
    //         this.StyleOutline(function (err, data) {
    //             if (err) {
    //                 location.hash = '#notFound/' + err;
    //             } else {
    //                 this.setState({
    //                     shortcutOutline: data
    //                 });
    //             }
    //         }.bind(this), 'shortcut');
    //     },
    //     getInitialState: function () {
    //         return {
    //             shortcutCategory: [],
    //             shortcutOutline: []
    //         };
    //     },
    //     componentWillMount: function () {
    //         this.getData();
    //     },
    //     render: function () {
    //         var shortcutCategory = {}, tempCategory = this.state.shortcutCategory, categoryArray = [];
    //         var shortcutOutline = {}, tempOutline = this.state.shortcutOutline, outlineArray = [];
    //         var i, j;
    //         // 遍历去重
    //         for (i in tempCategory) {
    //             if (this.HasOwnProperty(tempCategory, i)) {
    //                 for (j in tempCategory[i]) {
    //                     if (this.HasOwnProperty(tempCategory[i], j)) {
    //                         shortcutCategory[j] = tempCategory[i][j];
    //                     }
    //                 }
    //             }
    //         }
    //         for (i in shortcutCategory) {
    //             if (this.HasOwnProperty(shortcutCategory, i)) {
    //                 categoryArray.push(<ShortcutItem id={i} title={shortcutCategory[i]} newsType="category"/>);
    //             }
    //         }
    //         // 遍历去重
    //         for (i in tempOutline) {
    //             if (this.HasOwnProperty(tempOutline, i)) {
    //                 for (j in tempOutline[i]) {
    //                     if (this.HasOwnProperty(tempOutline[i], j)) {
    //                         shortcutOutline[j] = tempOutline[i][j];
    //                     }
    //                 }
    //             }
    //         }
    //         for (i in shortcutOutline) {
    //             if (this.HasOwnProperty(shortcutOutline, i)) {
    //                 outlineArray.push(<ShortcutItem id={i} title={shortcutOutline[i]} newsType="outline"/>);
    //             }
    //         }
    //         return (
    //             <div className="list-group">
    //                 {outlineArray}
    //                 {categoryArray}
    //                 <Link className="list-group-item" to="resource" query={{ pageSize: pageSize, pageRequest: pageRequest }}>资源下载</Link>
    //             </div>
    //         );
    //     }
    // });

    // 标题栏
    // var TitleLine = React.createClass({
    //     mixins: [actionNews, commonUtil],
    //     getData: function (id, type) {
    //         this.Struct(function (err, data) {
    //             var i, j, tempCategory, tempTitle = '';
    //             if (err) {
    //                 location.hash = '#notFound/' + err;
    //             } else {
    //                 switch (type) {
    //                     case 'category':
    //                         for (i in data) {
    //                             if (this.HasOwnProperty(data, i)) {
    //                                 tempCategory = data[i].category;
    //                                 for (j in tempCategory) {
    //                                     if (this.HasOwnProperty(tempCategory, j)) {
    //                                         if (id === tempCategory[j]) {
    //                                             tempTitle = j;
    //                                         }
    //                                     }
    //                                 }
    //                             }
    //                         }
    //                         break;
    //                     case 'outline':
    //                         for (i in data) {
    //                             if (this.HasOwnProperty(data, i)) {
    //                                 if (id === data[i].id) {
    //                                     tempTitle = i;
    //                                 }
    //                             }
    //                         }
    //                         break;
    //                     default:
    //                         tempTitle = this.state.title;
    //                         break;
    //                 }
    //                 console.log(tempTitle);
    //                 this.setState({
    //                     title: tempTitle
    //                 });
    //             }
    //         }.bind(this));
    //     },
    //     getInitialState: function () {
    //         return {
    //             id: this.props.id,
    //             type: this.props.type,
    //             title: this.props.type
    //         }
    //     },
    //     componentWillReceiveProps: function (nextProps) {
    //         this.setState({
    //             id: nextProps.id,
    //             type: nextProps.type,
    //             title: nextProps.title
    //         }, function () {
    //             if (this.state.type && 'text' !== this.state.type) {
    //                 this.getData(this.state.id, this.state.type);
    //             }
    //         });
    //     },
    //     componentWillMount: function () {
    //         if (this.state.type && 'text' !== this.state.type) {
    //             this.getData(this.state.id, this.state.type);
    //         }
    //     },
    //     render: function () {
    //         console.log(this.state);
    //         return (
    //             <header>{this.state.title}</header>
    //         );
    //     }
    // });

    const ConnectNavigation = ReactRedux.connect(reduxHelper.mapStateToProps, reduxHelper.mapDispatchToProps)(Navigation);
    const ConnectFooter     = ReactRedux.connect(reduxHelper.mapStateToProps, reduxHelper.mapDispatchToProps)(Footer);
    const ConnectShortcut   = ReactRedux.connect(reduxHelper.mapStateToProps, reduxHelper.mapDispatchToProps)(Shortcut);
    const ConnectTitleLine  = ReactRedux.connect(reduxHelper.mapStateToProps, reduxHelper.mapDispatchToProps)(TitleLine);
    const ConnectHeaderLine = ReactRedux.connect(reduxHelper.mapStateToProps, reduxHelper.mapDispatchToProps)(HeaderLine);

    return {
        Navigation: () =>
            (<Provider store={store}>
                <ConnectNavigation/>
            </Provider>),
        Footer: () =>
            (<Provider store={store}>
                <ConnectFooter/>
            </Provider>),
        Shortcut: () =>
            (<Provider store={store}>
                <ConnectShortcut/>
            </Provider>),
        TitleLine: () =>
            (<Provider store={store}>
                <ConnectTitleLine/>
            </Provider>),
        Header: () =>
            (<Provider store={store}>
                <ConnectHeaderLine/>
            </Provider>),
        Pager,
    };
});