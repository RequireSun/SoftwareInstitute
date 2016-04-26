'use strict';

define(['react', 'view/public'], (React, templatePublic) => {
    const Navigation = templatePublic.Navigation,
          Footer     = templatePublic.Footer;

    return ({children}) => (
        <div>
            <Navigation/>
            {children}
            <Footer/>
        </div>
    );
});