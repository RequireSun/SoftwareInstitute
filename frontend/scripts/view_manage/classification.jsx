/**
 * Created by kelvinsun on 2016/5/6.
 */

define([
    'react',
    'react-redux',
    'common/redux_helper',
    'common/util',
    'root/store_manage'
], (React, ReactRedux, reduxHelper, util, store) => {
    const { Provider, connect } = ReactRedux;
    const { mapStateToProps, mapDispatchToProps } = reduxHelper;

    class ClassificationMenu extends React.Component {
        constructor (props) {
            super(props);
        }
        render () {
            return (
                <div className="menu list-group">
                    <a className="list-group-item" onClick={this.props.onShowRename}>重命名</a>
                    <a className="list-group-item">移动</a>
                    <a className="list-group-item">删除</a>
                </div>
            );
        }
    }

    class ClassificationItem extends React.Component {
        constructor (props) {
            super(props);
            this.state = {
                showMenu: false,
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
            const name = this.refs.name.value;
            this.props.onStructRename({
                outlineId: this.props.outlineId,
                categoryId: this.props.id,
                name
            });
            this.setState({ showMenu: false, showRename: false, });
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
                    {this.state.showMenu ? <ClassificationMenu onShowRename={this.onShowRename.bind(this, true)}/> : ''}
                </li>
            );
        }
    }

    class ClassificationList extends React.Component {
        constructor (props) {
            super(props);
        }
        render () {
            return (
                <div className="col-sm-6 col-md-4 col-lg-3">
                    <div className="panel panel-sharp">
                        <div className="panel-heading">
                            {this.props.name}
                        </div>
                        <ul className="list-group">
                            {this.props.categories.map(item =>
                                <ClassificationItem id={item.get('id')} name={item.get('name')}
                                                    outlineId={this.props.id} key={item.get('id')}
                                                    onStructRename={this.props.onStructRename}/>
                            )}
                        </ul>
                    </div>
                </div>
            );
        }
    }

    class Classification extends React.Component {
        constructor (props) {
            super(props);
            this.state = Classification.getState(props);
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
        render () {
            // const DOMArray = [],
            //       { all }  = this.state;
            // console.log(all);
            // for (let key in all) {
            //     if (util.hasOwnProperty(all, key)) {
            //         DOMArray.push(<ClassificationList key={key} {...all[key]}/>);
            //     }
            // }
            // console.log(this.state.all.map((item, index) =>
            //     <ClassificationList key={index} {...item}/>
            // ));
            return (
                <div className="row">
                    {this.state.all.map((item, index) =>
                        <ClassificationList key={index} id={item.get('id')} name={item.get('name')}
                                            categories={item.get('categories')}
                                            onStructRename={this.props.onStructRename}/>
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