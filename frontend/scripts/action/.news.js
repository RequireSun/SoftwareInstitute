/**
 * Created by kelvin on 15-8-8.
 */
define(['jquery', 'root/config', 'common/network'], function ($, config, network) {
    var server = network.joinUrl({
        protocol: config.protocol,
        host: config.host,
        path: config.path
    });
    /**
     * 获取导航栏, 快捷入口, 页尾的样式数据
     * @param callback      传统的 callback, 成功的话, data 将会是样式对应的对象
     * @param categoryType  标明是哪个部位的样式
     * @constructor
     */
    function StyleCategory (callback, categoryType) {
        if (!categoryType || !callback) {
            return;
        }
        var data = { categoryType: categoryType }, url = server + '/StyleCategory';
        $.ajax({
            url: url,
            type: 'GET',
            data: data,
            dataType: 'json'
        }).success(function (data, status, xhr) {
            callback(null, data);
        }).error(function (xhr, status, error) {
            network.errorToContent(callback, xhr.status, error);
        });
    }
    /**
     * 获取导航栏, 快捷入口, 页尾的样式数据
     * @param callback      传统的 callback, 成功的话, data 将会是样式对应的对象
     * @param outlineType   标明是哪个部位的样式
     * @constructor
     */
    function StyleOutline (callback, outlineType) {
        if (!outlineType || !callback) {
            return;
        }
        var data = { outlineType: outlineType }, url = server + '/StyleOutline';
        $.ajax({
            url: url,
            type: 'GET',
            data: data,
            dataType: 'json'
        }).success(function (data, status, xhr) {
            callback(null, data);
        }).error(function (xhr, status, error) {
            network.errorToContent(callback, xhr.status, error);
        });
    }

    function Struct (callback) {
        $.ajax({
            url: server + '/Struct',
            type: 'GET',
            dataType: 'json'
        }).success(function (data, status, xhr) {
            callback(null, data);
        }).error(function (xhr, status, error) {
            network.errorToContent(callback, xhr.status, error);
        });
    }
    /**
     * 获取新闻列表
     * @param callback      传统的 callback 函数
     * @param newsType      outline 或是 category
     * @param id            对应的类别 id
     * @param pageSize      页大小
     * @param pageRequest   请求的页
     * @constructor
     */
    function NewsList (callback, newsType, id, pageSize, pageRequest) {
        if (!id || !callback) {
            return;
        }
        var data, url = server + ('outline' === newsType ? '/NewsOutline' : '/NewsCategory');
        data = {
            pageSize : pageSize || config.pageSize,
            pageRequest: pageRequest || config.pageRequest
        };
        data['outline' === newsType ? 'outlineId' : 'categoryId'] = id;
        $.ajax({
            url: url,
            type: 'GET',
            data: data,
            dataType: 'json'
        }).success(function (data, status, xhr) {
            callback(null, data);
        }).error(function (xhr, status, error) {
            network.errorToContent(callback, xhr.status, error);
        });
    }

    function NewsGet (callback, newsId) {
        if (!newsId) {
            return ;
        }
        var url = server + '/News';
        $.ajax({
            url: url,
            type: 'GET',
            data: {
                id: newsId
            },
            dataType: 'json'
        }).success(function (data, status, xhr) {
            callback(null, data);
        }).error(function (xhr, status, error) {
            network.errorToContent(callback, xhr.status, error);
        });
    }

    return {
        StyleCategory: StyleCategory,
        StyleOutline: StyleOutline,
        Struct: Struct,
        NewsList: NewsList,
        NewsGet: NewsGet
    };
});