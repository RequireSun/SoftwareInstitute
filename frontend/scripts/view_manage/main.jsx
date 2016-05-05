'use strict';

define([
    'react',
    'view/public',
], (React, viewPublic) => {
    const { Navigation, Menu } = viewPublic;
    // classification

    class Main extends React.Component {
        constructor (props) {
            super(props);
        }
        render () {
            return (
                <div>
                    <Navigation/>
                    <Menu/>
                    {this.props.children}
                </div>
            );
        }
    }

    return Main;
});