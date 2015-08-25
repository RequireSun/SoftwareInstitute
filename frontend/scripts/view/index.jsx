define(['react', 'ReactRouter', 'action/news', 'action/resource'], function (React, Router, actionNews, actionResource) {
    var Link = Router.Link;
    var Scroll = React.createClass({
        render: function () {
            return (
                <div>Scroll</div>
            );
        }
    });

    var News = React.createClass({
        mixins: [actionNews],
        getData: function (id) {
            this.NewsList(function (err, data) {
                if (err) {
                    location.hash = '#notFound/' + err;
                    return ;
                }
                this.setState({
                    newsList: data.data ? data.data : []
                });
            }.bind(this), 'outline', id, 5, 1);
        },
        getInitialState: function () {
            return {
                id: this.props.id,
                title: this.props.title,
                newsList: []
            };
        },
        componentWillReceiveProps: function (nextProps) {
            this.setState({
                id: nextProps.id,
                title: nextProps.title,
                newsList: []
            }, function () {
                this.getData(this.state.id);
            });
        },
        componentWillMount: function () {
            this.getData(this.state.id);
        },
        render: function () {
            return (
                <div>
                    {this.state.title ? this.state.title : '暂无内容'}
                    <ul>
                        {
                            this.state.newsList.map(function (news) {
                                return (<li><Link to="detail" params={{ newsId: news.id }}>{news.title} {news.update_time}</Link></li>);
                            })
                        }
                    </ul>
                </div>
            );
        }
    });

    var Resource = React.createClass({
        mixins: [actionResource],
        getData: function () {
            this.ResourceList(function (err, data) {
                if (err) {
                    location.hash = '#notFound/' + err;
                    return ;
                }
                this.setState({
                    resourceList: data.data ? data.data : []
                });
            }.bind(this), 5, 1);
        },
        getInitialState: function () {
            return {
                resourceList: []
            };
        },
        componentWillMount: function () {
            this.getData();
        },
        render: function () {
            return (
                <div>
                    资源下载
                    <ul>
                        {
                            this.state.resourceList.map(function (resource) {
                                return (<li><a href={resource.path}>{resource.title} {resource.update_time}</a></li>);
                            })
                        }
                    </ul>
                </div>
            );
        }
    });

    var Index = React.createClass({
        mixins: [actionNews],
        getInitialState: function () {
            return {
                outlines: {}
            };
        },
        componentWillMount: function () {
            this.OutlineCategory(function (err, data) {
                if (err) {
                    location.hash = '#notFound/' + err;
                    return ;
                }
                this.setState({
                    outlines: data
                });
            }.bind(this));
        },
        render: function () {
            var newsArray = [], newsCount = 0;
            for (var i in this.state.outlines) {
                newsArray.push({
                    id: this.state.outlines[i].id,
                    title: i
                })
            }
            newsArray = newsArray.slice(0, 2);
            while (2 > newsArray.length) {
                newsArray.push({});
            }
            return (
                <div>
                    <Scroll/>
                    {
                        newsArray.map(function (news) {
                            return <News id={news.id} title={news.title}/>;
                        })
                    }
                    <Resource/>
                </div>
            );
        }
    });
    return Index;
});