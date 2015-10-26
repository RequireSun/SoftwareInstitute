define(['react', 'ReactRouter', 'root/configMgr', 'common/event', 'action/news'], function (React, Router, configMgr, Event, actionNews) {
    'use strict';
    var RouteHandler = Router.RouteHandler,
        Link = Router.Link;

    var sectionsNews = configMgr.sectionsNews || [];

    class NewsContent extends React.Component {
        constructor (props) {
            super(props);
            this.state = props;
        }

        componentWillReceiveProps (nextProps) {
            this.setState(nextProps);
        }

        render () {
            return (
                <div>NewsContent</div>
            );
        }
    }

    class NewsStructureItem extends React.Component {
        constructor (props) {
            super(props);
            this.state = props;
        }

        componentWillReceiveProps (nextProps) {
            this.setState(nextProps);
        }

        render () {
            var tempCategories = this.state.categories, tempOutlines = this.state.outlines;
            var categoryElements = [], outlineElements = [];
            for (var i in tempCategories) {
                if (tempCategories.hasOwnProperty(i)) {
                    categoryElements.push(<a href="javascript:;" className="list-group-item">{i}</a>);
                }
            }
            for (var i in tempOutlines) {
                outlineElements.push(<button type="button" className="list-group-item">{i}</button>);
            }
            var popUpStyle = {
                position: 'absolute',
                right: 0,
                top: 0
            };
            return (
                <div className="panel panel-default" style={{ position: 'relative' }}>
                    <div className="panel-heading">{this.state.name}</div>
                    <div className="list-group">
                        {categoryElements}
                    </div>
                    <div className="list-group" style={popUpStyle}>
                        {outlineElements}
                    </div>
                </div>
            );
        }
    }
    NewsStructureItem.defaultProps = { id: 0, name: '', categories: {}, outlines: {} };

    class NewsStructure extends React.Component {
        constructor (props) {
            super(props);
            this.state = props;
        }

        componentWillReceiveProps (nextProps) {
            this.setState(nextProps);
        }

        componentWillMount () {
            actionNews.OutlineCategory(function (err, data) {
                if (err) {
                    location.hash = '#notFound/' + err;
                    return ;
                }
                this.setState({
                    outlines: data
                });
            }.bind(this));
        }

        componentWillUnmount () {
        }

        render () {
            var tempOutlines = this.state.outlines;
            var outlineElements = [];
            for (var i in tempOutlines) {
                outlineElements.push(<NewsStructureItem id={tempOutlines[i].id} name={i} categories={tempOutlines[i].category} outlines={this.state.outlines}/>);
            }
            return (
                <div>
                    {outlineElements}
                </div>
            );
        }
    }
    NewsStructure.defaultProps = { outlines: {} };

    class NewsRouter extends React.Component {
        constructor (props) {
            super(props);
            this.state = props;
            Event.emit('abc', 123, 666, 'yes');
        }

        componentWillReceiveProps (nextProps) {
            this.setState(nextProps);
        }

        render () {
            return (
                <div className="row">
                    {this.state.sectionsNews.map((item) => <Link to={item.index}>{item.name}</Link>)}
                </div>
            );
        }
    }
    NewsRouter.propTypes = { sectionsNews: React.PropTypes.array };
    NewsRouter.defaultProps = { sectionsNews: sectionsNews };

    class News extends React.Component {
        constructor (props) {
            super(props);
            this.state = props;
            Event.on('abc', function () {
                console.log(arguments);
            });
        }

        componentWillReceiveProps (nextProps) {
            this.setState(nextProps);
        }

        render () {
            return (<div>
                <div className="page-header">
                    <h1>新闻通知</h1>
                </div>
                <RouteHandler/>
            </div>);
        }
    }

    return {
        News: News,
        NewsRouter: NewsRouter,
        NewsStructure: NewsStructure,
        NewsContent: NewsContent
    };
});