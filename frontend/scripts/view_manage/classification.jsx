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
                <ul>
                    <li onClick={this.props.onRename}>重命名</li>
                    <li>移动</li>
                    <li>删除</li>
                </ul>
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
        onRename () {
            this.setState({
                showMenu: false,
                showRename: !this.state.showRename
            });
        }
        render () {
            return (
                <li>
                    <div>
                        {this.state.showRename ?
                            <div className="input-group">
                                <input type="text" defaultValue={this.props.name}
                                       className="form-control" placeholder="请输入名称"/>
                                <span className="input-group-btn">
                                    <button className="btn btn-success" type="button">
                                        <span className="glyphicon glyphicon-ok"></span>
                                    </button>
                                    <button className="btn btn-danger" type="button">
                                        <span className="glyphicon glyphicon-remove"></span>
                                    </button>
                                </span>
                            </div> :
                            <span onClick={this.onMenu.bind(this)}>{this.props.name}</span>
                        }
                    </div>
                    {this.state.showMenu ? <ClassificationMenu onRename={this.onRename.bind(this)}/> : ''}
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
                <div>
                    <div>{this.props.name}</div>
                    <ul>
                        {this.props.categories.map(item =>
                            <ClassificationItem key={item['id']} {...item} />
                        )}
                    </ul>
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
            const DOMArray = [],
                  { all }  = this.state;
            console.log(all);
            for (let key in all) {
                if (util.hasOwnProperty(all, key)) {
                    DOMArray.push(<ClassificationList key={key} {...all[key]}/>);
                }
            }
            return (
                <div>
                    {DOMArray}
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