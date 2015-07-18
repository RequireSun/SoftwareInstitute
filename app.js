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

// 用于更改命令行显示的字色
require('colors');
var path        = require('path');
// 一个用来压缩、加载 css 的插件
var Loader      = require('loader');
var express     = require('express');
var session     = require('express-session');
// 用来验证登陆
//var passport    = require('passport');

////////// 引入类库 结束 //////////


////////// 引入自定 router 开始 //////////

var webRouter   = require('./web_router');
var apiRouter   = require('./api_router');

////////// 引入自定 router 结束 //////////


////////// 引入中间件 开始 //////////

//var proxyMiddleware     = require('./middlewares/proxy');
// redis session 管理
var RedisStore          = require('connect-redis')(session);
// lodash 常用函数库
var _                   = require('lodash');
// 用于解析请求体
var bodyParser          = require('body-parser');
// 验证用的模块，必须在 session 模块之后引用
//var csurf               = require('csurf');
// http 压缩用的模块（deflate，gzip）
//var compression         = require('compression');
// 用于大文件上传
//var busboy              = require('connect-busboy');
// 用于在开发环境下打印错误信息
var errorhandler        = require('errorhandler');
// 用于支持 CORS 跨域
//var cors                = require('cors');
var requestLog          = require('./middlewares/request_log');
var errorPageMiddleware = require("./middlewares/error_page");
//var renderMiddleware    = require('./middlewares/render');
var logger              = require('./common/logger');

// 引入的 ejs 模块并自定义了一些 filter， 引入顺序不能错
var ejs                 = require('ejs');
require('./common/ejs_filter');

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
app.engine('html', ejs.__express);
// 设置信任，方便 nginx 反向代理
app.enable('trust proxy');

// 请求记录
app.use(requestLog);

// if (config.debug) {
//     // 渲染时间
//     app.use(renderMiddleware.render);
// }

// 静态资源
// sign 会用之后找个 sass 的
app.use(Loader.less(__dirname));
app.use('/public', express.static(staticDir));
//app.use('/agent', proxyMiddleware.proxy);

// 每日访问限制

app.use(require('response-time')());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// 添加额外的支持头，如 PUT DELETE
//app.use(require('method-override')());
app.use(require('cookie-parser')(config.session_secret));
//app.use(compression());
app.use(session({
    secret: config.session_secret,
    // 使用 redis 存储
    store: new RedisStore({
        port: config.redis_port,
        host: config.redis_host
    }),
    // 就算 session 没有变化也要进行一次存储（因为仓储有时限）
    resave: true,
    // 存储没有修改过的 session （刚刚生成，但是没有修改过的情况就属于此种情况）
    saveUninitialized: true,
}));


//app.use(passport.initiallize());


// 自定义中间件
// app.use(auth.authUser);
// app.use(auth.blockUser());

// 非 debug 模式下调用api是需要验证的
// if (!config.debug) {
//     app.use(function (req, res, next) {
//         if (-1 === req.path.indexOf('/api')) {
//             csurf()(req, res, next);
//             return;
//         }
//         next();
//     });
//     // 启用模板预编译缓存
//     app.set('view cache', true);
// }

// for debug
app.get('/err', function (req, res, next) {
    next(new Error('Artificial Error!'));
});

// 设置辅助函数
_.extend(app.locals, {
    config: config,
    Loader: Loader,
    assets: assets,
});

// 为 response 添加信息提示渲染方法的中间件
app.use(errorPageMiddleware.errorPage);
// 为当前作用域添加 lodash 方法（标识符为 _）和渲染相关方法
_.extend(app.locals, require('./common/render_helper'));

// 加载csrf模块，必须在 cookie-parser 之后加载
app.use(function (req, res, next) {
    // 将获取到的 csrf token 附加到当前作用域中
    res.locals.csrf = req.csrfToken ? req.csrfToken() : '';
    next();
});

// 引用 router
app.use('/', webRouter);

if (config.debug) {
    app.use(errorhandler());
} else {
    app.use(function (err, req, res, next) {
        console.error('server 500 error: ', err);
        return res.status(500).send('500 status');
    });
}

app.listen(config.port, function () {
  logger.info('CMS listening on port', config.port);
  logger.info('You can debug your app with http://' + config.hostname + ':' + config.port);
});

module.exports = app;


