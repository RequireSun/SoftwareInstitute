/**
 * Created by kelvin on 15-8-8.
 */
define(['jquery', 'root/config', 'common/network'], function ($, config, network) {
    var server = network.joinUrl({
        protocol: config.protocol,
        host: config.host,
        path: config.path
    });

    function NavigatorCategory (callback) {
        if (!callback) {
            return;
        }
        var url = server + '/NavigatorCategory';
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json'
        }).success(function (data, status, xhr) {
            callback(null, data);
        }).error(function (xhr, status, error) {
            network.errorToContent(callback, xhr.status, error);
        });
    }

    function NewsList (callback, newsType, id, pageSize, pageRequest) {
        if (!id || !callback) {
            return;
        }
        var data, url = server + ('outline' === newsType ? '/NewsListOutline' : '/NewsListCategory');
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

    function NewsDetail (callback, newsId) {
        if (!newsId) {
            return ;
        }
        var url = server + '/NewsDetail';
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
        NavigatorCategory: NavigatorCategory,
        NewsList: NewsList,
        NewsDetail: NewsDetail
    };
});