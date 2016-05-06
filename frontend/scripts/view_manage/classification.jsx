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

    class ClassificationItem extends React.Component {
        constructor (props) {
            super(props);
        }
        render () {
            return (
                <li>
                    {this.props.name}
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