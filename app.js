/*!
 * softwareinstitute - app.js
 */

/*
 * Module dependencies.
 */

var config = require('./config');

// sign 部署的时候记得用 newrelic 性能检测（配置文件里还有相应配置）
// if (!config.debug) {
//     require('newrelic');
// }

////////// 引入类库 开始 //////////

// sign 一个漂亮的 css 颜色库，暂时用不着
// require('colors');
var path        = require('path');
// 一个用来压缩、加载 css 的插件
var Loader      = require('loader');
var express     = require('express');
var session     = require('express-session');
// 用来验证登陆
var passport    = require('passport');

////////// 引入类库 结束 //////////


////////// 引入自定 model 开始 //////////

require('./models');

var webRouter   = require('./web_router');
var apiRouter   = require('./api_router');

////////// 引入自定 model 结束 //////////


////////// 引入中间件 开始 //////////

var proxyMiddleware     = require('./middlewares/proxy');
// redis session 管理
var RedisStore          = require('connect-redis')(session);
// lodash 常用函数库
var _                   = require('lodash');
// 验证用的模块，必须在 session 模块之后引用
//var csurf               = require('csurf');
// http 压缩用的模块（deflate，gzip）
//var compression         = require('compression');
// 用于解析请求体
var bodyParser          = require('body-parser');
// 用于大文件上传
//var busboy              = require('connect-busboy');
// 用于在开发环境下打印错误信息
var errorhandler        = require('errorhandler');
// 用于支持 CORS 跨域
//var cors                = require('cors');
var requestLog          = require('./middlewares/request_log');
var renderMiddleware    = require('./middlewares/render');
var logger              = require('./common/logger');

////////// 引入中间件 结束 //////////


// 静态文件目录
var staticDir   = path.join(__dirname, 'public');
// assets
var assets      = {};

// 非 debug 模式下开启压缩
// if (config.mini_assets) {
//     try {
//         assets = require('./assets.json');
//     } catch (e) {
//         console.log('You must execute `make build` before start app when mini_assets is true.');
//         throw e;
//     }
// }

var urlinfo     = require('url').parse(config.host);
config.hostname = urlinfo.hostname || config.host;

var app         = express();

// 配置环境变量
// 视图/模板引擎相关
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs-mate'));
app.locals._layoutFile = 'layout.html';
// 设置信任，方便 nginx 反向代理
app.enable('trust proxy');

// 请求记录
app.use(requestLog);

if (config.debug) {
    // 渲染时间
    app.use(renderMiddleware.render);
}

// 静态资源
// sign 会用之后找个 sass 的
app.use(Loader.less(__dirname));
app.use('/public', express.static(staticDir));
app.use('/agent', proxyMiddleware.proxy);

// 每日访问限制

app.use(require('response-time')());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// 添加额外的支持头，如 PUT DELETE
//app.use(require('method-override')());
app.use(require('cookie-parser')(config.session_secret));
app.use(compression());
app.use(session({
    secret: config.session_secret
}));

