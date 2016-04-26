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
    const pagerSize   = config.pagerSize   || 2,
          pageSize    = config.pageSize    || 20,
          pageRequest = config.pageRequest || 1;

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
            let pagerArray  = [];
            let tempCurrent = this.props.current,
                tempMax     = this.props.max,
                tempLink    = this.props.link || '';
            // 生成对应的前一页 / 后一页
            let prevLink = tempCurrent <= 1 ?
                (<li className="disabled">
                    <a href={tempLink.replace(/\{\#page\}/, tempCurrent)}>&laquo;</a>
                </li>) :
                (<li>
                    <a href={tempLink.replace(/\{\#page\}/, tempCurrent - 1)}>&laquo;</a>
                </li>);
            let nextLink = tempCurrent >= tempMax ?
                (<li className="disabled">
                    <a href={tempLink.replace(/\{\#page\}/, tempCurrent)}>&raquo;</a>
                </li>) :
                (<li>
                    <a href={tempLink.replace(/\{\#page\}/, tempCurrent - 0 + 1)}>&raquo;</a>
                </li>);
            for (
                let i = Math.max(1, tempCurrent - pagerSize),
                    l = Math.min(2 * pagerSize + i, tempMax);
                i <= l;
                ++i
            ) {
                pagerArray.push(i);
            }
            return (
                <ul className="pagination">
                    {prevLink}
                    {pagerArray.map((pager) =>
                        // pageCurrent 是字符串, pager 是数字
                        (<li className={pager == tempCurrent ? 'active' : ''}>
                            <a href={tempLink.replace(/\{\#page\}/, pager)}>{pager}</a>
                        </li>)
                    )}
                    {nextLink}
                </ul>
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

    class NavigatorCategory extends React.Component {
        constructor (props) {
            super(props);
            this.state = {
                title: this.props.title,
                category: this.props.category
            };
        }
        render () {
            var category = [], tempCategory = this.props.category;
            for (var i in tempCategory) {
                category.push(
                    <li>
                        <Link to="news" params={{ newsType: 'category' }} query={{ id: i, pageSize: pageSize, pageRequest: pageRequest }}>{tempCategory[i]}</Link>
                    </li>
                );
            }
            return (
                <li className="dropdown">
                    <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button">{this.props.title}<span className="caret"></span></a>
                    <ul className="dropdown-menu">
                        {category}
                    </ul>
                </li>
            );
        }
    }

    // 导航栏的单个选项列表
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

    class Navigation extends React.Component {
        constructor (props) {
            super(props);
            this.state = this.getState(props);
        }
        componentWillReceiveProps (nextProps) {
            this.setState(getState(nextProps));
        }
        getState (state) {
            const list = !state || !state['style'] ||
                         !state['style']['navigator'] ||
                         !Array.isArray(state['style']['navigator']) ?
                             [] :
                             state['style']['navigator'];
            return { list };
        }
        render () {
            // var navigatorCategory = [], tempCategory = this.state.navigatorCategory;
            // for (let i in tempCategory) {
            //     if (i !== 'null' && commonUtil.hasOwnProperty(tempCategory, i)) {
            //         navigatorCategory.push(<NavigatorCategory title={i} category={tempCategory[i]}/>);
            //     }
            // }
            return (
                <div className="navbar navbar-default">
                    <div className="container">
                        <div className="navbar-header">
                            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navigator-collapse-all">
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </button>
                            <a className="navbar-brand" href="#">Brand</a>
                        </div>
                        <div className="collapse navbar-collapse" id="navigator-collapse-all">
                            <ul className="nav navbar-nav">
                                <li><Link to="index">首页</Link></li>
                                {navigatorCategory}
                            </ul>
                        </div>
                    </div>
                </div>
            );
        }
    }

    // 导航栏
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
    var FooterCategory = React.createClass({
        getInitialState: function () {
            return {
                title: this.props.title,
                category: this.props.category
            };
        },
        componentWillReceiveProps: function (nextProps) {
            this.setState({
                title: nextProps.title,
                category: nextProps.category
            });
        },
        render: function () {
            var category = [], tempCategory = this.state.category;
            for (var i in tempCategory) {
                category.push(
                    <li>
                        <Link to="news" params={{ newsType: 'category' }} query={{ id: i, pageSize: pageSize, pageRequest: pageRequest }}>{tempCategory[i]}</Link>
                    </li>
                );
            }
            return (
                <ul className="nav nav-pills nav-stacked">
                    {this.state.title}
                    {category}
                </ul>
            );
        }
    });

    // 页脚
    var Footer = React.createClass({
        mixins: [actionNews, commonUtil],
        getInitialState: function () {
            return {
                footerCategory: []
            }
        },
        componentWillMount: function () {
            this.StyleCategory('footer', function (err, data) {
                if (err) {
                    location.hash = '#notFound/' + err;
                } else {
                    this.setState({
                        footerCategory: data
                    });
                }
            }.bind(this));
        },
        render: function () {
            console.log(this.state.footerCategory);
            var footerCategory = [], tempCategory = this.state.footerCategory;
            for (var i in tempCategory) {
                if (i !== 'null' && this.HasOwnProperty(tempCategory, i)) {
                    footerCategory.push(<FooterCategory title={i} category={tempCategory[i]}/>);
                }
            }
            footerCategory = footerCategory.slice(0, 2);
            return (
                <div className="container-fluid" style={{ backgroundColor: 'black' }}>
                    <div className="container">
                        {footerCategory}
                    </div>
                </div>
            );
        }
    });

    // 快捷入口单项
    var ShortcutItem = React.createClass({
        getInitialState: function () {
            return {
                id: this.props.id,
                title: this.props.title,
                newsType: this.props.newsType
            };
        },
        componentWillReceiveProps: function (nextProps) {
            this.setState({
                id: nextProps.id,
                title: nextProps.title,
                newsType: nextProps.newsType
            });
        },
        render: function () {
            return (
                <Link className="list-group-item" to="news" params={{ newsType: this.state.newsType }} query={{ id: this.state.id, pageSize: pageSize, pageRequest: pageRequest }}>{this.state.title}</Link>
            );
        }
    });

    // 每个页面里面左边的快捷入口
    var Shortcut = React.createClass({
        mixins: [actionNews, commonUtil],
        getData: function () {
            this.StyleCategory(function (err, data) {
                if (err) {
                    location.hash = '#notFound/' + err;
                } else {
                    this.setState({
                        shortcutCategory: data
                    });
                }
            }.bind(this), 'shortcut');
            this.StyleOutline(function (err, data) {
                if (err) {
                    location.hash = '#notFound/' + err;
                } else {
                    this.setState({
                        shortcutOutline: data
                    });
                }
            }.bind(this), 'shortcut');
        },
        getInitialState: function () {
            return {
                shortcutCategory: [],
                shortcutOutline: []
            };
        },
        componentWillMount: function () {
            this.getData();
        },
        render: function () {
            var shortcutCategory = {}, tempCategory = this.state.shortcutCategory, categoryArray = [];
            var shortcutOutline = {}, tempOutline = this.state.shortcutOutline, outlineArray = [];
            var i, j;
            // 遍历去重
            for (i in tempCategory) {
                if (this.HasOwnProperty(tempCategory, i)) {
                    for (j in tempCategory[i]) {
                        if (this.HasOwnProperty(tempCategory[i], j)) {
                            shortcutCategory[j] = tempCategory[i][j];
                        }
                    }
                }
            }
            for (i in shortcutCategory) {
                if (this.HasOwnProperty(shortcutCategory, i)) {
                    categoryArray.push(<ShortcutItem id={i} title={shortcutCategory[i]} newsType="category"/>);
                }
            }
            // 遍历去重
            for (i in tempOutline) {
                if (this.HasOwnProperty(tempOutline, i)) {
                    for (j in tempOutline[i]) {
                        if (this.HasOwnProperty(tempOutline[i], j)) {
                            shortcutOutline[j] = tempOutline[i][j];
                        }
                    }
                }
            }
            for (i in shortcutOutline) {
                if (this.HasOwnProperty(shortcutOutline, i)) {
                    outlineArray.push(<ShortcutItem id={i} title={shortcutOutline[i]} newsType="outline"/>);
                }
            }
            return (
                <div className="list-group">
                    {outlineArray}
                    {categoryArray}
                    <Link className="list-group-item" to="resource" query={{ pageSize: pageSize, pageRequest: pageRequest }}>资源下载</Link>
                </div>
            );
        }
    });

    // 标题栏
    var TitleLine = React.createClass({
        mixins: [actionNews, commonUtil],
        getData: function (id, type) {
            this.Struct(function (err, data) {
                var i, j, tempCategory, tempTitle = '';
                if (err) {
                    location.hash = '#notFound/' + err;
                } else {
                    switch (type) {
                        case 'category':
                            for (i in data) {
                                if (this.HasOwnProperty(data, i)) {
                                    tempCategory = data[i].category;
                                    for (j in tempCategory) {
                                        if (this.HasOwnProperty(tempCategory, j)) {
                                            if (id === tempCategory[j]) {
                                                tempTitle = j;
                                            }
                                        }
                                    }
                                }
                            }
                            break;
                        case 'outline':
                            for (i in data) {
                                if (this.HasOwnProperty(data, i)) {
                                    if (id === data[i].id) {
                                        tempTitle = i;
                                    }
                                }
                            }
                            break;
                        default:
                            tempTitle = this.state.title;
                            break;
                    }
                    console.log(tempTitle);
                    this.setState({
                        title: tempTitle
                    });
                }
            }.bind(this));
        },
        getInitialState: function () {
            return {
                id: this.props.id,
                type: this.props.type,
                title: this.props.type
            }
        },
        componentWillReceiveProps: function (nextProps) {
            this.setState({
                id: nextProps.id,
                type: nextProps.type,
                title: nextProps.title
            }, function () {
                if (this.state.type && 'text' !== this.state.type) {
                    this.getData(this.state.id, this.state.type);
                }
            });
        },
        componentWillMount: function () {
            if (this.state.type && 'text' !== this.state.type) {
                this.getData(this.state.id, this.state.type);
            }
        },
        render: function () {
            console.log(this.state);
            return (
                <header>{this.state.title}</header>
            );
        }
    });

    const ConnectNavigation = ReactRedux.connect(reduxHelper.mapStateToProps, reduxHelper.mapDispatchToProps)(Navigation);

    return {
        Navigation: () =>
            (<Provider store={store}>
                <ConnectNavigation/>
            </Provider>),
        Footer,
        Shortcut,
        TitleLine,
        Pager,
    };
});