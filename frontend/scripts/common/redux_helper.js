/**
 * Created by kelvinsun on 2016/4/27.
 */
'use strict';
// TODO 详细返回逻辑没做
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
], ($, config, util, Style, Struct, Detail, News, Resource, nStruct) => {

    return {
        mapStateToProps: ({ style, detail, struct, news, resource }) => ({
            style,
            struct,
            detail,
            news,
            resource,
        }),
        // TODO 错误处理 (跳转到错误页)
        mapDispatchToProps: (dispatch) => {
            const onNewsListGet = (id, type = 'category', pageRequest = config.pageRequest, pageSize = config.pageSize) => {
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
            };

            return {
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
                onStructCreate ({ outlineId, name }) {
                    dispatch(Struct.create({ outlineId, name }));
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
                onStructUpload (struct) {
                    const url = '/api/struct';

                    if (!!struct.toJS) {
                        struct = struct.toJS();
                    }

                    $.ajax({
                        url,
                        method: 'PUT',
                        data: {
                            struct: JSON.stringify(struct),
                        },
                        // contentType: 'application/json',
                        dataType: 'json',
                    }).success(data => {
                        if (!data['code']) {
                            // dispatch(Detail.detailSet(data['data']));
                            alert(1);
                        } else {
                            alert(2);
                            // dispatch(Detail.detailSet({}));
                        }
                        // alert(1);
                    }).error((xhr, msg) => {
                        // console.log(msg);
                        // alert('请检查您的网络！');
                        alert(3);
                    });
                },

                onNewsActiveSet: ({ id, type = 'category' } = {}) => {
                    dispatch(News.activeSet({ id, type }));
                    onNewsListGet(id, type);
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
                onNewsDetailUpload: (id, data) => {
                    const { title, article, category_id } = data;

                    let url, method;

                    if (!!id) {
                        url = `/api/news?id=${id}`;
                        method = 'PUT';
                    } else {
                        url = '/api/news';
                        method = 'POST';
                    }

                    $.ajax({
                        url,
                        method,
                        data: {
                            title,
                            article,
                            categoryId: category_id,
                        },
                        dataType: 'json',
                    }).success(data => {
                        if (!data['code']) {
                            // dispatch(Detail.detailSet(data['data']));
                            alert(1);
                        } else {
                            alert(2);
                            // dispatch(Detail.detailSet({}));
                        }
                    }).error((xhr, msg) => {
                        alert(3);
                    });
                },
                onNewsDetailClear () {
                    dispatch(Detail.detailClear());
                },
                onNewsDetailDelete (id) {
                    const url = `/api/news?id=${id}`;

                    $.ajax({
                        url,
                        method: 'DELETE',
                        dataType: 'json',
                    }).success(data => {
                        if (!data['code']) {
                            // dispatch(Detail.detailSet(data['data']));
                            alert(1);
                        } else {
                            alert(2);
                            // dispatch(Detail.detailSet({}));
                        }
                    }).error((xhr, msg) => {
                        alert(3);
                    });
                },
                onNewsListGet,

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
            };
        },
    };
});