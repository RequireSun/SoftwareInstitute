/**
 * Created by kelvinsun on 2016/4/13.
 */
'use strict';

class PowerError extends Error {
    constructor (message, fileName, lineNumber) {
        super(message, fileName, lineNumber);
    }
}

module.exports = {
    PowerError,
};