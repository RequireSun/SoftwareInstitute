'use strict';
// 还是不用
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