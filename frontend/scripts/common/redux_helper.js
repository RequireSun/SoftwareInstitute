/**
 * Created by kelvinsun on 2016/4/27.
 */
'use strict';

define([
    'jquery',
    'root/config',
    'common/util',
    'action/style',
    'action/struct',
    'action/detail',
    'action/news',
    'action/resource',
    'network/struct',
], ($, config, util, Style, Struct, Detail, News, Resource, nStruct) => ({
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
        onStructInit: (data) =>
            dispatch(Struct.init(data)),
        onStructGet: ({ category = false, outline = false, all = false } = {}) => {
            const promises = [];
            if (all) {
                promises.push(new Promise(util.promiseWrap(nStruct.getAll)));
            } else {
                promises.push(Promise.resolve());
            }

            if (outline) {
                promises.push(new Promise(util.promiseWrap(nStruct.outlineGetAll)));
            } else {
                promises.push(Promise.resolve());
            }

            if (category) {
                promises.push(new Promise(util.promiseWrap(nStruct.categoryGetAll)));
            } else {
                promises.push(Promise.resolve());
            }

            return Promise.all(promises).then(([dataAll = undefined, dataOutline = undefined, dataCategory = undefined]) => {
                dispatch(Struct.init({ all: dataAll, outline: dataOutline, category: dataCategory }));
            }, () => {
                alert('请检查您的网络！');
            });
        },
        onStructRename ({ outlineId, categoryId, name }) {
            dispatch(Struct.rename({ outlineId, categoryId, name }));
        },
        onStructDelete ({ outlineId, categoryId }) {
            dispatch(Struct.delete({ outlineId, categoryId }));
        },
        onStructMove ({ originId, targetId, categoryId }) {
            dispatch(Struct.move({ originId, targetId, categoryId }));
        },
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