define(['react', 'ReactRouter', 'root/configMgr', 'common/event'], function (React, Router, configMgr, Event) {
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

    class NewsStructure extends React.Component {
        constructor (props) {
            super(props);
            this.state = props;
        }

        componentWillReceiveProps (nextProps) {
            this.setState(nextProps);
        }

        render () {
            return (
                <div>NewsStructure</div>
            );
        }
    }

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