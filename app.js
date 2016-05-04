/*!
 * softwareinstitute - app.js
 */
/*
 * Module dependencies.
 */
'use strict';

let config = require('./config');

// TODO 部署的时候记得用 newrelic 性能检测（配置文件里还有相应配置）
// if (!config.debug) {
//     require('newrelic');
// }

////////// 引入类库 开始 //////////

// 用于更改命令行显示的字色
require('colors');
let path        = require('path');
// 一个用来压缩、加载 css 的插件
// let Loader      = require('loader');
let express     = require('express');
let session     = require('express-session');
// 用来验证登陆
//let passport    = require('passport');

////////// 引入类库 结束 //////////


////////// 引入自定 router 开始 //////////

let webRouter   = require('./web_router');
let apiRouter   = require('./api_router');

////////// 引入自定 router 结束 //////////


////////// 引入中间件 开始 //////////

//let proxyMiddleware     = require('./middlewares/proxy');
// redis session 管理
//let RedisStore          = require('connect-redis')(session);
// lodash 常用函数库
// let _                   = require('lodash');
// 用于解析请求体
let bodyParser          = require('body-parser');
// 验证用的模块，必须在 session 模块之后引用
let csurf               = require('csurf');
// http 压缩用的模块（deflate，gzip）
//let compression         = require('compression');
// 用于大文件上传
//let busboy              = require('connect-busboy');
// 用于在开发环境下打印错误信息
let errorhandler        = require('errorhandler');
// 用于支持 CORS 跨域
let cors                = require('cors');
let requestLog          = require('./middlewares/request_log');
let renderPageMiddleware= require('./middlewares/render_page');
let renderJsonMiddleware= require('./middlewares/render_json');
//let renderMiddleware    = require('./middlewares/render');
let logger              = require('./common/logger');

// 引入的 ejs 模块并自定义了一些 filter， 引入顺序不能错
let ejs                 = require('ejs');
require('./common/ejs_filter');

////////// 引入中间件 结束 //////////


// 静态文件目录
let staticDir   = path.join(__dirname, 'public');
// assets
let assets      = {};

// 非 debug 模式下开启压缩
// if (config.mini_assets) {
//     try {
//         assets = require('./assets.json');
//     } catch (e) {
//         console.log('You must execute `make build` before start app when mini_assets is true.');
//         throw e;
//     }
// }

let urlinfo     = require('url').parse(config.host);
config.hostname = urlinfo.hostname || config.host;

let app         = express();

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
// app.use(Loader.less(__dirname));
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
   // store: new RedisStore(Object.assign({}, config.redis, { db: redis_session_db })),
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
 if (!config.debug) {
     app.use(function (req, res, next) {
         if (-1 === req.path.indexOf(/\/api\b/)) {
             csurf()(req, res, next);
             return;
         }
         next();
     });
     // 启用模板预编译缓存
     app.set('view cache', true);
 }

// for debug
app.get('/err', function (req, res, next) {
    next(new Error('Artificial Error!'));
});

// 设置辅助函数
Object.assign(app.locals, {
    config: config,
    // Loader: Loader,
    assets: assets,
});

// 为 response 添加信息提示渲染方法的中间件
app.use(renderPageMiddleware.errorPage);
app.use(renderJsonMiddleware);
// 为当前作用域添加 lodash 方法（标识符为 _）和渲染相关方法
Object.assign(app.locals, require('./common/render_helper'));

// 加载csrf模块，必须在 cookie-parser 之后加载
app.use(function (req, res, next) {
    // 将获取到的 csrf token 附加到当前作用域中
    res.locals.csrf = req.csrfToken ? req.csrfToken() : '';
    next();
});

// 引用 router
app.use('/api', cors(config.cors_sites), apiRouter);
app.use('/page', webRouter);

if (config.debug) {
    app.use(errorhandler());
} else {
    //app.use(function (err, req, res, next) {
    //    console.error('server 500 error: ', err);
    //    return res.status(500).send('500 status');
    //});
}

app.listen(config.port, function () {
  logger.info('CMS listening on port', config.port);
  logger.info('You can debug your app with http://' + config.hostname + ':' + config.port);
});

module.exports = app;
