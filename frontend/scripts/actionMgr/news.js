/**
 * Created by kelvinsun on 2015/10/23.
 */
define(['jquery', 'root/config', 'common/network'], function ($, config, network) {
    var server = network.joinUrl({
        protocol: config.protocol,
        host: config.host,
        path: config.path
    });
});