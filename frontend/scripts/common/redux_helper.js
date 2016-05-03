/**
 * Created by kelvinsun on 2016/4/27.
 */
'use strict';

define([
    'jquery',
    'root/config',
    'action/style',
    'action/news',
    'action/resource'
], ($, config, Style, News, Resource) => ({
    mapStateToProps: ({ style, news, resource }) => ({
        style,
        news,
        resource,
    }),
    // TODO 错误处理
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
                if (!data['code']) {
                    const { list, count } = data['data'];
                    dispatch(News.listSet(list, count));
                }
            }).error((xhr, msg) => {
                console.log(msg);
            });
        },
        onResourceListGet: (pageRequest = config.pageRequest, pageSize = config.pageSize) => {
            const url = '/api/resourceList';
            $.ajax({
                url,
                method: 'GET',
                data: {
                    pageSize,
                    pageRequest,
                },
                dataType: 'json',
            }).success(data => {
                if (!data['code']) {
                    const { list, count } = data['data'];
                    dispatch(Resource.listSet(list, count));
                }
            }).error((xhr, msg) => {
                console.log(msg);
            });
        },
    }),
}));