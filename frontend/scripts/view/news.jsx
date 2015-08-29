define(['react', 'ReactRouter', 'view/public', 'action/news', 'common/util'], function (React, Router, templatePublic, actionNews, commonUtil) {
    var Link = Router.Link;
    var TitleLine = templatePublic.TitleLine,
        Shortcut = templatePublic.Shortcut,
        Pager = templatePublic.Pager;

    var newsLink = '#/browse/news/{#newsType}?id={#id}&pageSize=20&pageRequest={#page}';

    var NewsItem = React.createClass({
        mixins: [commonUtil],
        getInitialState: function () {
            return {
                id: this.props.id,
                title: this.props.title,
                updateTime: this.props.update_time
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
                <li><Link to="detail" params={{ newsId: this.state.id }}>{this.state.title}<span className="pull-right">{this.ConvertDateTimeToDate(this.state.updateTime)}</span></Link></li>
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
                this.getData(this.state.id, this.state.newsType, this.state.pageSize, this.state.pageRequest);
            }.bind(this));
        },
        componentWillMount: function () {
            this.getData(this.state.id, this.state.newsType, this.state.pageSize, this.state.pageRequest);
        },
        render: function () {
            var newsItems = [], tempNewsList = this.state.newsList;
            var tempNewsLink = newsLink.replace(/\{\#newsType\}/, this.state.newsType).replace(/\{\#id\}/, this.state.id);
            for (var i = 0, l = tempNewsList.length; i < l; ++i) {
                newsItems.push(
                    <NewsItem {...tempNewsList[i]}/>
                );
            }
            return (
                <div className="container">
                    <div className="row">
                        <TitleLine id={this.state.id} type={this.state.newsType}/>
                    </div>
                    <div className="row">
                        <div className="col-sm-3 hidden-xs">
                            <Shortcut/>
                        </div>
                        <div className="col-sm-9">
                            <ul>
                                {newsItems}
                            </ul>
                            <Pager current={this.state.pageRequest} max={this.state.newsCount} link={tempNewsLink}/>
                        </div>
                    </div>
                </div>
            );
        }
    });
    return NewsList;
});