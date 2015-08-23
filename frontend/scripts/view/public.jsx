define(['react', 'ReactRouter', 'action/news', 'common/util'], function (React, Router, actionNews, util) {
    var Link = Router.Link;

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
                <li>
                    <ul>
                        {this.state.title}
                        {category}
                    </ul>
                </li>
            );
        }
    });

    // 导航栏
    var Navigation = React.createClass({
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
                if (util.hasOwnProperty(tempCategory, i)) {
                    navigatorCategory.push(<NavigatorCategory title={i} category={tempCategory[i]}/>);
                }
            }
            return (
                <div>
                    Navigation
                    <ul>
                        <Link to="index">首页</Link>
                        {navigatorCategory}
                    </ul>
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
                <li>
                    <ul>
                        {this.state.title}
                        {category}
                    </ul>
                </li>
            );
        }
    });

    // 每个页面里面左边的快捷入口
    var Shortcut = React.createClass({
        getInitialState: function () {
            return {
                shortcutCategory: []
            };
        },
        componentWillMount: function () {
            actionNews.StyleCategory('shortcut', function (err, data) {
                if (err) {
                    location.hash = '#notFound/' + err;
                } else {
                    this.setState({
                        shortcutCategory: data
                    });
                }
            }.bind(this));
        },
        render: function () {
            var shortcutCategory = [], tempCategory = this.state.shortcutCategory;
            for (var i in tempCategory) {
                if (util.hasOwnProperty(tempCategory, i)) {
                    shortcutCategory.push(<NavigatorCategory title={i} category={tempCategory[i]}/>);
                }
            }
            return (
                <ul>
                    {shortcutCategory}
                    <li><Link to="resource" query={{ pageSize: 20, pageRequest: 1 }}>资源下载</Link></li>
                </ul>
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
        TitleLine: TitleLine
    };
});