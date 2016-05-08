'use strict';

define([
    'react',
    'view/public',
], (React, viewPublic) => {
    const { Navigation, Menu } = viewPublic;

    class Main extends React.Component {
        constructor (props) {
            super(props);
        }
        render () {
            return (
                <div>
                    <div className="manage-container">
                        <Navigation/>
                        <div className="container-fluid">
                            <div className="row">
                                <div className="menu-container col-sm-3 col-lg-2 hidden-xs">
                                    <Menu pathname={this.props.location.pathname}/>
                                </div>
                                <div className="col-sm-9 col-lg-10">
                                    {this.props.children}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }

    return Main;
});