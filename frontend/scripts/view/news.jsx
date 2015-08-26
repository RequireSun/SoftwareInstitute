define(['react', 'ReactRouter', 'view/public', 'action/news'], function (React, Router, templatePublic, actionNews) {
    var Link = Router.Link;
    var TitleLine = templatePublic.TitleLine,
        Shortcut = templatePublic.Shortcut,
        Pager = templatePublic.Pager;

    var newsLink = '';

    var NewsItem = React.createClass({
        getInitialState: function () {
            return {
                id: this.props.item.id,
                title: this.props.item.title,
                updateTime: this.props.item.update_time
            };
        },
        componentWillReceiveProps: function (nextProps) {
            this.setState({
                id: nextProps.id,
                title: nextProps.title,
                updateTime: nextProps.update_time
            });
        },
        render: function () {
            return (
                <li><Link to="detail" params={{ newsId: this.state.id }}>{this.state.title} {this.state.updateTime}</Link></li>
            );
        }
    });

    var NewsList = React.createClass({
        mixins: [actionNews],
        getData: function (id, newsType, pageSize, pageRequest) {
            if (!id) {
                location.hash = '#notFound/请输入正确的类别 ID！';
                return ;
            }
            this.NewsList(function (err, data) {
                if (err) {
                    location.hash = '#notFound/' + err;
                    return ;
                }
                this.setState({
                    newsList: data.data ? data.data : [],
                    newsCount: data.count ? data.count : 0
                });
            }.bind(this), newsType, id, pageSize, pageRequest);
        },
        getInitialState: function () {
            return {
                newsType: this.props.params.newsType,
                id : this.props.query.id,
                pageSize : this.props.query.pageSize,
                pageRequest : this.props.query.pageRequest,
                newsList: [],
                newsCount: 0
            };
        },
        componentWillReceiveProps: function (nextProps) {
            this.setState({
                newsType: nextProps.params.newsType,
                id : nextProps.query.id,
                pageSize : nextProps.query.pageSize,
                pageRequest : nextProps.query.pageRequest,
                newsList: [],
                newsCount: 0
            }, function () {
                this.getData(this.state.id, this.state.newsType, this.state.pageSize, this.state.pageRequest)
            }.bind(this));
        },
        componentWillMount: function () {
            this.getData(this.state.id, this.state.newsType, this.state.pageSize, this.state.pageRequest)
        },
        render: function () {
            var newsItems = [], tempNewsList = this.state.newsList;
            for (var i = 0, l = tempNewsList.length; i < l; ++i) {
                newsItems.push(
                    <NewsItem item={tempNewsList[i]}/>
                );
            }
            return (
                <div>
                    <Shortcut/>
                    <TitleLine/>
                    <ul>
                        {newsItems}
                    </ul>
                    {/*<Pager/>*/}
                </div>
            );
        }
    });
    return NewsList;
});