'use strict';

define(['react', 'ReactRouter', 'react-bootstrap', 'root/configMgr'], function (React, Router, ReactBootstrap, configMgr) {
    var RouteHandler = Router.RouteHandler;
    var Link = Router.Link;
    var Navbar = ReactBootstrap.Navbar,
        Nav = ReactBootstrap.Nav;

    var sections = configMgr.sections || [];

    class MgrNav extends React.Component {
        constructor (props) {
            super(props);
            this.state = props;
        }

        componentWillReceiveProps (nextProps) {
            this.setState(nextProps);
        }

        render () {
            return (
                <Navbar brand="后台管理" fixedTop inverse toggleNavKey={0} className="visible-xs-block">
                    <Nav right eventKey={0}>
                        {this.state.sections.map(
                            (item) =>
                                (<li key={item.index}><Link to={item.index}>{item.name}</Link></li>)
                        )}
                    </Nav>
                </Navbar>
                );
        }
    }
    MgrNav.propTypes = { section: React.PropTypes.array };
    MgrNav.defaultProps = { section: [] };

    class Main extends React.Component {
        constructor(props) {
            super(props);
            this.state = props;
        }

        static willTransitionTo(transition) {
            console.log(transition);
        }

        render () {
            return (
                <div className="container-fluid">
                    <MgrNav/>
                    <div className="row" className="visible-xs-block" style={{ height: 50 }}></div>
                    <div className="row">
                        <div className="col-sm-3 col-lg-2 hidden-xs" style={{ backgroundColor: 'red' }}>
                            <ListGroup>
                                {sections.map((item)=>(<li className="list-group-item" key={item.index}><Link to={item.index}>{item.name}</Link></li>))}
                            </ListGroup>
                        </div>
                        <div className="col-sm-9 col-md-10" style={{ backgroundColor: 'green' }}>
                            321
                            <RouteHandler/>
                        </div>
                    </div>
                </div>
            );
        }
    }

    return Main;
});