/**
 * Created by kelvinsun on 2016/4/27.
 */
'use strict';

define([
    'jquery',
    'root/config',
    'action/style',
    'action/struct',
    'action/detail',
    'action/news',
    'action/resource'
], ($, config, Style, Struct, Detail, News, Resource) => ({
    mapStateToProps: ({ style, detail, struct, news, resource }) => ({
        style,
        struct,
        detail,
        news,
        resource,
    }),
    // TODO 错误处理 (跳转到错误页)
    mapDispatchToProps: (dispatch) => ({
        onStyleInit: (style) =>
            dispatch(Style.init(style)),
        onStructInit: (category, outline) =>
            dispatch(Struct.init(category, outline)),
        onNewsDetailGet: (id) => {
            const url = '/api/news';
            $.ajax({
                url,
                method: 'GET',
                data: {
                    id,
                },
                dataType: 'json',
            }).success(data => {
                if (!data['code']) {
                    dispatch(Detail.detailSet(data['data']));
                } else {
                    dispatch(Detail.detailSet({}));
                }
            }).error((xhr, msg) => {
                // console.log(msg);
                alert('请检查您的网络！');
            });
        },
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
                } else {
                    dispatch(News.listSet([], 0));
                }
            }).error((xhr, msg) => {
                alert('请检查您的网络！')
                // console.log(msg);
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
                } else {
                    dispatch(Resource.listSet([], 0));
                }
            }).error((xhr, msg) => {
                alert('请检查您的网络！');
                // console.log(msg);
            });
        },
    }),
}));