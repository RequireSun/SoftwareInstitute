/**
 * Created by kelvinsun on 2016/5/6.
 */

define([
    'react',
    'react-redux',
    'common/redux_helper',
    'common/util',
    'root/store_manage',
], (React, ReactRedux, reduxHelper, util, store) => {
    const { Provider, connect } = ReactRedux;
    const { mapStateToProps, mapDispatchToProps } = reduxHelper;

    class ClassificationItemMenu extends React.Component {
        constructor (props) {
            super(props);
            this.state = {
                showDelete: false,
                showMove  : false,
            };
        }
        onShowDelete () {
            this.setState({
                showDelete: !this.state.showDelete,
            });
        }
        onShowMove () {
            this.setState({
                showMove: !this.state.showMove,
            });
        }
        render () {
            return (
                <div className="menu list-group">
                    <a className="list-group-item" onClick={this.props.onShowRename}>重命名</a>
                        <a className="list-group-item" onClick={this.onShowMove.bind(this)}>移动</a>
                        {this.state.showMove ?
                            <div className="list-group">
                                {this.props.outlines.toList().map(item =>
                                    this.props.outlineId != item.get('id') ?
                                        <a className="list-group-item" key={item.get('id')}
                                            onClick={this.props.onMove.bind(null, item.get('id'))}>
                                            {item.get('name')}
                                        </a> :
                                        ''
                                )}
                            </div> : ''
                        }
                    {this.state.showDelete ?
                        <div className="list-group-item">
                            <div className="content">删除</div>
                            <div key="btn-group" className="btn-group pull-right">
                                <button className="btn btn-xs btn-danger" onClick={this.props.onDelete}>
                                    <span className="glyphicon glyphicon-floppy-remove"></span>
                                </button>
                                <button className="btn btn-xs btn-success" onClick={this.onShowDelete.bind(this)}>
                                    <span className="glyphicon glyphicon-share-alt"></span>
                                </button>
                            </div>
                        </div> :
                        <a className="list-group-item" onClick={this.onShowDelete.bind(this)}>删除</a>
                    }
                </div>
            );
        }
    }

    class ClassificationItem extends React.Component {
        constructor (props) {
            super(props);
            this.state = {
                showMenu  : false,
                showRename: false,
            };
        }
        onMenu () {
            this.setState({ showMenu: !this.state.showMenu });
        }
        onShowRename (isShow = false) {
            this.setState({
                showMenu  : isShow,
                showRename: !this.state.showRename
            });
        }
        onRename () {
            const name = this.refs.name.value || '';
            this.props.onStructRename({
                outlineId: this.props.outlineId,
                categoryId: this.props.id,
                name
            });
            this.setState({ showMenu: false, showRename: false, });
        }
        onDelete () {
            this.props.onStructDelete({ outlineId: this.props.outlineId, categoryId: this.props.id, });
        }
        onMove (targetId) {
            this.props.onStructMove({ originId: this.props.outlineId, targetId, categoryId: this.props.id });
        }
        render () {
            return (
                <li className="list-group-item classification-item">
                    {this.state.showRename ?
                        <div className="input-group">
                            <input type="text" ref="name" defaultValue={this.props.name}
                                   className="form-control" placeholder="请输入名称"/>
                            <span className="input-group-btn">
                                <button className="btn btn-success" type="button"
                                        onClick={this.onRename.bind(this)}>
                                    <span className="glyphicon glyphicon-ok"></span>
                                </button>
                                <button className="btn btn-danger" type="button"
                                        onClick={this.onShowRename.bind(this, false)}>
                                    <span className="glyphicon glyphicon-remove"></span>
                                </button>
                            </span>
                        </div> :
                        <div className="title" onClick={this.onMenu.bind(this)}>{this.props.name}</div>
                    }
                    {this.state.showMenu ?
                        <ClassificationItemMenu outlineId={this.props.outlineId}
                                            onShowRename={this.onShowRename.bind(this, true)}
                                            onDelete={this.onDelete.bind(this)}
                                            onMove={this.onMove.bind(this)}
                                            outlines={this.props.outlines}/> :
                        ''
                    }
                </li>
            );
        }
    }

    class ClassificationCreate extends React.Component {
        constructor (props) {
            super(props);
            this.state = {};
        }
        onCreate () {
            this.props.onCreate(this.refs.name.value || '');
        }
        render () {
            return (
                <div className="input-group">
                    <input type="text" ref="name" className="form-control" placeholder="请输入名称"/>
                            <span className="input-group-btn">
                                <button className="btn btn-success" type="button"
                                        onClick={this.onCreate.bind(this)}>
                                    <span className="glyphicon glyphicon-ok"></span>
                                </button>
                                <button className="btn btn-danger" type="button"
                                        onClick={this.props.onShowCreate.bind(this, false)}>
                                    <span className="glyphicon glyphicon-remove"></span>
                                </button>
                            </span>
                </div>
            );
        }
    }

    class ClassificationList extends React.Component {
        constructor (props) {
            super(props);
            this.state = {
                showCreate: false,
                showRename: false,
                showDelete: false,
            };
        }
        onShowCreate (showCreate = false) {
            this.setState({ showCreate });
        }
        onShowRename (showRename = false) {
            this.setState({ showRename });
        }
        onShowDelete (showDelete = false) {
            this.setState({ showDelete });
        }
        onCreate (name = '') {
            if (!!name) {
                this.props.onStructCreate({
                    outlineId: this.props.id,
                    name,
                });
            }
            this.setState({ showCreate: false, showRename: false, showDelete: false, })
        }
        onRename () {
            const name = this.refs.name.value || '';
            this.props.onStructRename({
                outlineId : this.props.id,
                name
            });
            this.setState({ showCreate: false, showRename: false, showDelete: false, });
        }
        onDelete () {
            this.props.onStructDelete({
                outlineId: this.props.id
            });
        }
        render () {
            return (
                <div className="col-sm-6 col-md-4 col-lg-3">
                    <div className="panel panel-sharp">
                        <div className="panel-heading">
                            {this.state.showRename ?
                                <div className="input-group">
                                    <input type="text" ref="name" defaultValue={this.props.name}
                                           className="form-control" placeholder="请输入名称"/>
                                    <span className="input-group-btn">
                                        <button className="btn btn-success" type="button"
                                                onClick={this.onRename.bind(this)}>
                                            <span className="glyphicon glyphicon-ok"></span>
                                        </button>
                                        <button className="btn btn-danger" type="button"
                                                onClick={this.onShowRename.bind(this, false)}>
                                            <span className="glyphicon glyphicon-remove"></span>
                                        </button>
                                    </span>
                                </div> : [
                                this.props.name,
                                this.state.showDelete ?
                                    (<div key="btn-group" className="btn-group pull-right">
                                        <button className="btn btn-xs btn-danger" onClick={this.onDelete.bind(this)}>
                                            <span className="glyphicon glyphicon-floppy-remove"></span>
                                        </button>
                                        <button className="btn btn-xs btn-success" onClick={this.onShowDelete.bind(this, false)}>
                                            <span className="glyphicon glyphicon-share-alt"></span>
                                        </button>
                                    </div>) :
                                    (<div key="btn-group" className="btn-group pull-right">
                                        {this.state.showCreate ?
                                            '' :
                                            <button className="btn btn-xs btn-default" onClick={this.onShowCreate.bind(this, true)}>
                                                <span className="glyphicon glyphicon-plus"></span>
                                            </button>
                                        }
                                        <button className="btn btn-xs btn-default" onClick={this.onShowRename.bind(this, true)}>
                                            <span className="glyphicon glyphicon-pencil"></span>
                                        </button>
                                        <button className="btn btn-xs btn-default" onClick={this.onShowDelete.bind(this, true)}>
                                            <span className="glyphicon glyphicon-trash"></span>
                                        </button>
                                    </div>)
                            ]}
                        </div>
                        <ul className="list-group">
                            {this.props.categories.map(item =>
                                <ClassificationItem id={item.get('id')} name={item.get('name')}
                                                    outlineId={this.props.id} key={item.get('id')}
                                                    outlines={this.props.outlines}
                                                    onStructRename={this.props.onStructRename}
                                                    onStructDelete={this.props.onStructDelete}
                                                    onStructMove={this.props.onStructMove}/>
                            )}
                            {this.state.showCreate ?
                                <ClassificationCreate onShowCreate={this.onShowCreate.bind(this)}
                                                      onCreate={this.onCreate.bind(this)}/> : ''
                            }
                        </ul>
                    </div>
                </div>
            );
        }
    }

    class Classification extends React.Component {
        constructor (props) {
            super(props);
            this.state = Object.assign({ showCreate: false }, Classification.getState(props));
        }
        componentWillMount () {
            this.props.onStructGet({ all: true });
        }
        componentWillReceiveProps (nextProps) {
            this.setState(Classification.getState(nextProps));
        }
        static getState (state) {
            const struct = !state || !state['struct'] ||
                           '[object Object]' !== util.toString(state) ?
                               {} :
                               state['struct'];

            return Object.assign({}, struct);
        }
        onShowCreate (showCreate = false) {
            this.setState({ showCreate });
        }
        onCreate () {
            this.props.onStructCreate({ name: this.refs.name.value || '' });
            this.setState({ showCreate: false });
        }
        onUpload () {
            const struct = this.state.all || null;
            !!struct && this.props.onStructUpload(struct);
        }
        render () {
            return (
                <div className="row">
                    <div className="col-xs-12 form-inline controllers-container">
                        {this.state.showCreate ?
                            <div className="input-group">
                                <input type="text" ref="name" className="form-control" placeholder="请输入名称"/>
                                <span className="input-group-btn">
                                    <button className="btn btn-success" type="button"
                                            onClick={this.onCreate.bind(this)}>
                                        <span className="glyphicon glyphicon-ok"></span>
                                    </button>
                                    <button className="btn btn-danger" type="button"
                                            onClick={this.onShowCreate.bind(this, false)}>
                                        <span className="glyphicon glyphicon-remove"></span>
                                    </button>
                                </span>
                            </div> :
                            <button className="btn btn-success" onClick={this.onShowCreate.bind(this)}>
                                <span className="glyphicon glyphicon-plus"></span>
                                &nbsp;&nbsp;&nbsp;
                                添加大类
                            </button>
                        }
                        {this.state.changed ?
                            <button className="btn btn-blue-dark"
                                    onClick={this.onUpload.bind(this)}>
                                <span className="glyphicon glyphicon-ok"></span>
                                &nbsp;&nbsp;&nbsp;
                                保存
                            </button> : ''
                        }
                    </div>
                    {this.state.all.map((item, index) =>
                        <ClassificationList key={index} id={item.get('id')} name={item.get('name')}
                                            categories={item.get('categories')}
                                            outlines={this.state.all}
                                            onStructCreate={this.props.onStructCreate}
                                            onStructRename={this.props.onStructRename}
                                            onStructDelete={this.props.onStructDelete}
                                            onStructMove={this.props.onStructMove}/>
                    ).toList()}
                </div>
            );
        }
    }

    const ConnectClassification = connect(mapStateToProps, mapDispatchToProps)(Classification);

    return () =>
        (<Provider store={store}>
            <ConnectClassification/>
        </Provider>);
});