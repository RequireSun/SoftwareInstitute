'use strict';

define([
    'react',
    'root/store',
    'action/style',
    'action/struct',
    'view/public'
], (React, store, style, struct, templatePublic) => {
    const Navigation = templatePublic.Navigation,
          Header     = templatePublic.Header,
          Footer     = templatePublic.Footer;

    class Main extends React.Component {
        constructor (props) {
            super(props);
            store.dispatch(style.init(window['_styleConfig_'] || {}));
            store.dispatch(struct.init(window['_categoryConfig_'] || [], window['_outlineConfig_'] || []));
        }
        render () {
            return (
                <div>
                    <Header/>
                    <Navigation/>
                    {this.props.children}
                    <Footer/>
                </div>
            );
        }
    }

    return Main;
});