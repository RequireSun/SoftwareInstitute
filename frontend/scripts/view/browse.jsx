'use strict';

define(['react', 'ReactRouter', 'view/public'], function (React, Router, templatePublic) {
    const { Shortcut, TitleLine } = templatePublic;
    const Browse = (props) => (
        <div>
            <TitleLine/>
            <Shortcut/>
            {props.children}
        </div>
    );
    return Browse;
});