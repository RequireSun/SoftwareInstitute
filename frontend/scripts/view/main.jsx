'use strict';

define(['react', 'root/store', 'action/style', 'view/public'], (React, store, style, templatePublic) => {
    const Navigation = templatePublic.Navigation,
          Footer     = templatePublic.Footer;

    class Main extends React.Component {
        constructor (props) {
            super(props);
            store.dispatch(style.init(window['_styleConfig_']));
        }
        render () {
            return (
                <div>
                    <Navigation/>
                    {this.props.children}
                    <Footer/>
                </div>
            );
        }
    }

    return Main;
});