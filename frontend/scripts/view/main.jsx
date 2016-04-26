'use strict';

define(['react', 'view/public'], (React, templatePublic) => {
    const Navigation = templatePublic.Navigation,
          Footer     = templatePublic.Footer;

    // class Main extends React.Component {
    //     render () {
    //         return (
    //             <div>
    //                 <Navigation/>
    //                 {this.props.children}
    //                 <Footer/>
    //             </div>
    //         );
    //     }
    // }

    return ({children}) => (
        <div>
            <Navigation/>
            {children}
            <Footer/>
        </div>
    );
});