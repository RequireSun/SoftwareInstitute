/**
 * Created by kelvinsun on 2016/5/16.
 */
define([
    'immutable',
    'react',
    'ReactRouter',
    'react-redux',
    'common/redux_helper',
    'common/util',
    'root/store_manage'
], (Immutable, React, ReactRouter, ReactRedux, reduxHelper, util, store) => {
    const { Link } = ReactRouter;
    const { Provider, connect } = ReactRedux;
    const { mapStateToProps, mapDispatchToProps } = reduxHelper;

    class ClassificationItem extends React.Component {
        constructor (props) {
            super(props);
            this.state = { open: false };
        }
        openChild (e) {
            this.setState({ open: !this.state.open });
            e.preventDefault();
            e.stopPropagation();
        }
        render () {
            return (
                <li href="javascript:;" className="list-group-item">
                    <a href="javascript:;">
                        {this.props.name}
                        <span onClick={this.openChild.bind(this)}
                              className={'pull-right glyphicon ' + (this.state.open ? 'glyphicon-chevron-up' : 'glyphicon-chevron-down')}></span>
                    </a>
                    <div className={'list-group' + (this.state.open ? '' : ' hidden')}>
                        {this.props.categories.map(category =>
                            <a href="javascript:;" className="list-group-item"
                               key={category.get('id')}>
                                {category.get('name')}
                            </a>
                        )}
                    </div>
                </li>
            );
        }
    }

    class Classification extends React.Component {
        render () {
            return (
                <nav className="list-group row classification">
                    {this.props.classification.map(item =>
                        <ClassificationItem key={item.get('id')}
                                            id={item.get('id')}
                                            name={item.get('name')}
                                            categories={item.get('categories')}/>
                    ).toList()}
                </nav>
            );
        }
    }
    Classification.defaultProps = { classification: Immutable.Map() };

    class News extends React.Component {
        constructor (props) {
            super(props);
            this.state = News.getState(props);
        }
        componentWillMount () {
            this.props.onStructGet({ all: true });
        }
        componentWillReceiveProps (nextProps) {
            this.setState(News.getState(nextProps));
        }
        static getState (state) {
            const struct = !state || !state['struct'] || '[object Object]' !== util.toString(state) ?
                    {} :
                    state['struct'];
            const news = !state || !state['news'] || '[object Object]' !== util.toString(state) ?
                    {} :
                    state['news'];

            return Object.assign({ classification: struct['all'] }, news);
        }
        render () {
            return (
                <div className="row news-container">
                    <div className="col-sm-4">
                        <Classification classification={this.state.classification}/>
                    </div>
                    <div className="col-sm-8"></div>
                </div>
            );
        }
    }

    const ConnectNews = connect(mapStateToProps, mapDispatchToProps)(News);

    return () =>
        (<Provider store={store}>
            <ConnectNews/>
        </Provider>);
});