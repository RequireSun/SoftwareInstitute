define(['react', 'ReactRouter', 'action/news', 'common/util', 'root/config'], function (React, Router, actionNews, commonUtil, config) {
    var Link = Router.Link;
    var pagerSize = config.pagerSize || 2,
        pageSize = config.pageSize || 20,
        pageRequest = config.pageRequest || 1;


    /**
     * 页码生成组件
     * @param   current 当前页码
     * @param   max     总页码数
     * @param   link    页码链接, 字符串, 其中需要有 {#page} 标记, 用于将此处替换为请求的页码
     */
    var Pager = React.createClass({
        getInitialState: function () {
            return {
                current: this.props.current,
                max: this.props.max,
                link: this.props.link
            };
        },
        componentWillReceiveProps: function (nextProps) {
            this.setState({
                current: nextProps.current,
                max: nextProps.max,
                link: nextProps.link
            });
        },
        render: function () {
            var pagerArray = [];
            var tempCurrent = this.state.current,
                tempLink = this.state.link || '';
            // 生成对应的前一页 / 后一页
            var prevLink = tempCurrent <= 1 ? (<li className="disabled"><a href={tempLink.replace(/\{\#page\}/, tempCurrent)}>&laquo;</a></li>) : (<li><a href={tempLink.replace(/\{\#page\}/, tempCurrent - 1)}>&laquo;</a></li>),
                nextLink = tempCurrent >= this.state.max ? (<li className="disabled"><a href={tempLink.replace(/\{\#page\}/, tempCurrent)}>&raquo;</a></li>) : (<li><a href={tempLink.replace(/\{\#page\}/, tempCurrent - 0 + 1)}>&raquo;</a></li>);
            for (var i = Math.max(1, tempCurrent - pagerSize), l = Math.min(2 * pagerSize + i, this.state.max); i <= l; ++i) {
                pagerArray.push(i);
            }
            return (
                <ul className="pagination">
                    {prevLink}
                    {
                        pagerArray.map(function (pager) {
                            // pageCurrent 是字符串, pager 是数字
                            var activeClass = pager == tempCurrent ? 'active' : '';
                            return (<li className={activeClass}><a href={tempLink.replace(/\{\#page\}/, pager)}>{pager}</a></li>);
                        })
                    }
                    {nextLink}
                </ul>
            );
        }
    });

    // 导航栏的单个选项列表
    var NavigatorCategory = React.createClass({
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
                        <Link to="news" params={{ newsType: 'category' }} query={{ id: i, pageSize: 20, pageRequest: 1 }}>{tempCategory[i]}</Link>
                    </li>
                );
            }
            return (
                <li className="dropdown">
                    <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button">{this.state.title}<span className="caret"></span></a>
                    <ul className="dropdown-menu">
                        {category}
                    </ul>
                </li>
            );
        }
    });

    // 导航栏
    var Navigation = React.createClass({
        mixins: [commonUtil],
        getInitialState: function () {
            return {
                navigatorCategory: {}
            };
        },
        componentWillMount: function () {
            actionNews.StyleCategory('navigator', function (err, data) {
                if (err) {
                    location.hash = '#notFound/' + err;
                } else {
                    this.setState({
                        navigatorCategory: data
                    });
                }
            }.bind(this));
        },
        render: function () {
            var navigatorCategory = [], tempCategory = this.state.navigatorCategory;
            for (var i in tempCategory) {
                if (this.HasOwnProperty(tempCategory, i)) {
                    navigatorCategory.push(<NavigatorCategory title={i} category={tempCategory[i]}/>);
                }
            }
            return (
                <div className="navbar navbar-default">
                    <div className="container-fluid">
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
    });

    // 页脚
    var Footer = React.createClass({
        render: function () {
            return (
                <div>Footer</div>
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
            this.StyleCategory('shortcut', function (err, data) {
                if (err) {
                    location.hash = '#notFound/' + err;
                } else {
                    this.setState({
                        shortcutCategory: data
                    });
                }
            }.bind(this));
            this.StyleOutline('shortcut', function (err, data) {
                if (err) {
                    location.hash = '#notFound/' + err;
                } else {
                    this.setState({
                        shortcutOutline: data
                    });
                }
            }.bind(this));
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
                    <Link className="list-group-item" to="resource" query={{ pageSize: 20, pageRequest: 1 }}>资源下载</Link>
                </div>
            );
        }
    });

    // 标题栏
    var TitleLine = React.createClass({
        getInitialState: function () {
            return {
                title: ''
            }
        },
        componentWillReceiveProps: function (nextProps) {
            this.setState({
                title: nextProps.title
            });
        },
        render: function () {
            return (
                <header>{this.state.title}</header>
            );
        }
    });

    return {
        Navigation: Navigation,
        Footer: Footer,
        Shortcut: Shortcut,
        TitleLine: TitleLine,
        Pager: Pager
    };
});