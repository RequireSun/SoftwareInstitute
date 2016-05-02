/**
 * Created by kelvinsun on 2016/4/27.
 */
'use strict';

define(['jquery', 'root/config', 'action/style', 'action/news'], ($, config, Style, News) => ({
    mapStateToProps: ({ style, news }) => ({
        style,
        news,
    }),
    mapDispatchToProps: (dispatch) => ({
        onStyleInit: (style) =>
            dispatch(Style.init(style)),
        onNewsListGet: (id, type, pageRequest = config.pageRequest, pageSize = config.pageSize) => {
            let url;
            switch (type) {
                case 'category':
                    url = '/api/newsCategory';
                    break;
                case 'outline':
                    url = '/api/newsOutline';
                    break;
            }
            $.ajax({
                url,
                method: 'GET',
                data: {
                    pageSize,
                    pageRequest,
                    id,
                },
                dataType: 'json',
            }).success(data => {
                // console.log(data);
                if (!data['code']) {
                    const { list, count } = data['data'];
                    dispatch(News.listSet(list, count));
                }
            }).error((xhr, msg) => {
                console.log(msg);
            });
            // dispatch(News);
        },
    }),
}));