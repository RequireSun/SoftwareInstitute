define(['react', 'view/public', 'action/news', 'common/util'], function (React, templatePublic, actionNews, commonUtil) {
    var TitleLine = templatePublic.TitleLine,
        Shortcut = templatePublic.Shortcut;

    // 新闻详情控件
    var Detail = React.createClass({
        mixins: [actionNews, commonUtil],
        getData: function (id) {
            if (!id) {
                location.hash = '#notFound/请输入正确的新闻 ID！';
                return ;
            }
            this.NewsGet(function (err, data) {
                if (err) {
                    location.hash = '#notFound/' + err;
                    return ;
                }
                this.setState({
                    title: data.title,
                    supervisorName: data.supervisor_name,
                    article: data.article,
                    updateTime: data.update_time,
                    pageView: data.page_view
                });
            }.bind(this), id);
        },
        getInitialState: function () {
            return {
                id: this.props.params.newsId,
                title: '',
                supervisorName: '',
                article: '',
                updateTime: '',
                pageView: 0
            };
        },
        componentWillReceiveProps: function (nextProps) {
            this.setState({
                id: nextProps.params.id,
                title: '',
                supervisorName: '',
                article: '',
                updateTime: '',
                pageView: 0
            }, function () {
                this.getData(this.state.id);
            });
        },
        componentWillMount: function () {
            this.getData(this.state.id);
        },
        render: function () {
            return (
                <div className="container">
                    <div className="row">
                        <TitleLine title={this.state.title}/>
                    </div>
                    <div className="row">
                        <div className="col-sm-3 hidden-xs">
                            <Shortcut/>
                        </div>
                        <div className="col-sm-9">
                            <p>发布者 {this.state.supervisorName} 发布时间 {this.ConvertDateTimeFormat(this.state.updateTime)} 浏览量 {this.state.pageView}</p>
                            <article>{this.state.article}</article>
                        </div>
                    </div>
                </div>
            );
        }
    });
    return Detail;
});