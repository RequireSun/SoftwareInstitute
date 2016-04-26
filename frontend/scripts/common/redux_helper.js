/**
 * Created by kelvinsun on 2016/4/27.
 */
'use strict';

define(['action/style'], (Style) => ({
    mapStateToProps: ({ style }) => ({
        style,
    }),
    mapDispatchToProps: (dispatch) => ({
        onStyleInit: () =>
            dispatch(Style.init()),
    }),
}));