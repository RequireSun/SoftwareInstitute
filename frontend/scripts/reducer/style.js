/**
 * Created by kelvinsun on 2016/4/27.
 */
'use strict';

define(['immutable', 'common/util'], (Immutable, util) => (state = {}, action) => {
    const { hasOwnProperty } = util;
    switch (action.type) {
        case 'STYLE_INIT':
            const styles = {};
            for (let i in action.style) {
                if (hasOwnProperty(action.style, i)) {
                    styles[i] = Immutable.fromJS(action.style[i]);
                }
            }
            return Object.assign({}, styles);
        default:
            return state;
    }
});