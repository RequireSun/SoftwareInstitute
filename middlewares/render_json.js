/**
 * Created by kelvinsun on 2016/4/11.
 */
'use strict';
// TODO status 更改
module.exports = (req, res, next) => {
    // json success
    res.jsonSuccess                 = (data) => res.status(200).json({ code: 0, data });
    // json miss parameter
    res.jsonErrorParameterMissing   = (message) => res.status(200).json({ code: 1001, message });
    // json wrong parameter
    res.jsonErrorParameterWrong     = (message) => res.status(200).json({ code: 1002, message });
    // json no login
    res.jsonErrorNoLogin            = () => res.status(200).json({ code: 1900, message: false });
    // json no power
    res.jsonErrorNoPower            = () => res.status(200).json({ code: 1800, message: false });
    
    next();
};