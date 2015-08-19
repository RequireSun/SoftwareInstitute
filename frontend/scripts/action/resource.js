/**
 * Created by kelvinsun on 2015/8/10.
 */
define(['common/network', 'root/config'], function (network, config) {
    var server = network.joinUrl({
        protocol: config.protocol,
        host: config.host,
        path: config.path
    });

    // 资源列表获取
    function ResourceList (callback, pageSize, pageRequest) {
        var url = server + '/ResourceList';
        $.ajax({
            url: url,
            type: 'GET',
            data: {
                pageSize: pageSize || config.pageSize,
                pageRequest: pageRequest || config.pageRequest
            },
            dataType: 'json'
        }).success(function (data, status, xhr) {
            callback(null, data);
        }).error(function (xhr, status, error) {
            network.errorToContent(callback, xhr.status, error);
        });
    }

    return {
        ResourceList: ResourceList
    };
});