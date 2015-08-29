define(['react', 'view/public', 'action/resource', 'common/util'], function (React, templatePublic, actionResource, commonUtil) {
    var TitleLine = templatePublic.TitleLine,
        Shortcut = templatePublic.Shortcut,
        Pager = templatePublic.Pager;

    var resourceLink = '#/browse/resource?pageSize=20&pageRequest={#page}';

    var ResourceItem = React.createClass({
        mixins: [commonUtil],
        getInitialState: function () {
            return {
                id: this.props.id,
                title: this.props.title,
                path: this.props.path,
                updateTime: this.props.update_time
            }
        },
        componentWillReceiveProps: function (nextProps) {
            this.setState({
                id: nextProps.id,
                title: nextProps.title,
                path: nextProps.path,
                updateTime: nextProps.updateTime
            });
        },
        render: function () {
            return (
                <li><a href={this.state.path}>{this.state.title}<span className="pull-right">{this.ConvertDateTimeToDate(this.state.updateTime)}</span></a></li>
            );
        }
    });
    var ResourceList = React.createClass({
        mixins: [actionResource],
        getData: function (pageSize, pageRequest) {
            this.ResourceList(function (err, data) {
                if (err) {
                    location.hash = '#notFound/' + err;
                    return ;
                }
                this.setState({
                    resourceList: data.data ? data.data : [],
                    resourceCount: data.count ? data.count : 0
                });
            }.bind(this), pageSize, pageRequest);
        },
        getInitialState: function () {
            return {
                pageSize : this.props.query.pageSize,
                pageRequest : this.props.query.pageRequest,
                resourceList: [],
                resourceCount: 0
            };
        },
        componentWillReceiveProps: function (nextProps) {
            this.setState({
                pageSize : nextProps.query.pageSize,
                pageRequest : nextProps.query.pageRequest,
                resourceList: [],
                resourceCount: 0
            }, function () {
                this.getData(this.state.pageSize, this.state.pageRequest);
            });
        },
        componentWillMount: function () {
            this.getData(this.state.pageSize, this.state.pageRequest);
        },
        render: function () {
            var resourceItems = [], tempResourceList = this.state.resourceList;
            for (var i = 0, l = tempResourceList.length; i < l; ++i) {
                resourceItems.push(
                    <ResourceItem {...tempResourceList[i]}/>
                );
            }
            return (
                <div className="container">
                    <div className="row">
                        <TitleLine title="资源下载"/>
                    </div>
                    <div className="row">
                        <div className="col-sm-3 hidden-xs">
                            <Shortcut/>
                        </div>
                        <div className="col-sm-9">
                            <ul>
                                {resourceItems}
                            </ul>
                            <Pager current={this.state.pageRequest} max={this.state.resourceCount} link={resourceLink}/>
                        </div>
                    </div>
                </div>
            );
        }
    });
    return ResourceList;
});