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

    // 看起来只能拿 dragenter 来做了
    class NewsStructureItem extends React.Component {
        constructor (props) {
            super(props);
            this.state = props;
        }

        componentWillReceiveProps (nextProps) {
            this.setState(nextProps);
        }

        dragStart (itemId, event) {
            Event.emit('management.news.drag.start', this.state.id, itemId, event);
        }

        dragEnd () {
            Event.emit('management.news.drag.end');
        }

        dragEnter (event) {
            Event.emit('management.news.drag.enter', this.state.id, event);
        }

        render () {
            var tempCategories = this.state.categories;
            var categoryElements = [];
            for (var i in tempCategories) {
                categoryElements.push(<a href="javascript:;" onDragStart={this.dragStart.bind(this, tempCategories[i])} className="list-group-item">{i}</a>);
            }
            return (
                <div className="panel panel-default" onDragEnd={this.dragEnd.bind(this)} onDragEnter={this.dragEnter.bind(this)}>
                    <div className="panel-heading">{this.state.name}</div>
                    <div className="list-group">
                        {categoryElements}
                    </div>
                </div>
            );
        }
    }
    NewsStructureItem.defaultProps = { id: 0, name: '', categories: {} };

    class NewsStructure extends React.Component {
        constructor (props) {
            super(props);
            this.state = props;
        }

        componentWillReceiveProps (nextProps) {
            this.setState(nextProps);
        }

        componentWillMount () {
            var draggedSource = 0,
                draggedTarget = 0,
                draggedItemId = 0;
            var intervalKey, canMove = false;
            var domElem;
            Event.on('management.news.drag.start', function (sourceId, itemId, event) {
                draggedSource = sourceId;
                draggedTarget = sourceId;
                draggedItemId = itemId;

                domElem = $('<div>123</div>');
                domElem.css({
                    'position': 'fixed',
                    'top': event.screenY,
                    'left': event.screenX
                });
                domElem.appendTo(document.body);
                intervalKey = setInterval(function () {
                    canMove = true;
                }, 50);
            });
            Event.on('management.news.drag.end', function () {
                console.log(draggedSource, draggedTarget, draggedItemId);
                clearInterval(intervalKey);
            });
            Event.on('management.news.drag.enter', function (enterId, event) {
                if (canMove) {
                    domElem.css({
                        'top': event.screenY,
                        'left': event.screenX
                    });
                    canMove = false;
                }
                draggedTarget = enterId;
            });
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
            Event.off('management.news.drag.start');
            Event.off('management.news.drag.end');
            Event.off('management.news.drag.enter');
            Event.off('management.news.drag.leave');
        }

        render () {
            var tempOutlines = this.state.outlines;
            var outlineElements = [];
            for (var i in tempOutlines) {
                outlineElements.push(<NewsStructureItem id={tempOutlines[i].id} name={i} categories={tempOutlines[i].category}/>);
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