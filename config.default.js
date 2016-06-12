/**
 * config
 */

var path = require('path');

var config = {
    // 虽然还不太会用，但 debug 参数先写在这里
    debug: true,

    name: '哈尔滨工业大学（威海）软件学院', // 工程名字
    description: '哈尔滨工业大学国家示范性软件学院是经教育部、国家计委批准的国家示范性软件学院。软件学院（威海）充分利用哈尔滨工业大学的综合资源，依托哈工大计算机学科的综合优势，坚持“国际化、工业化、高质量、高速度”的办学理念，本着“高起点、高层次、高标准”的原则，加强国际合作，按照国际标准，以工业化需求为目标，培养软件产业急需的，具有国际竞争能力的高级软件人才。', // 网站简介
    keywords: '哈尔滨工业大学, 哈尔滨工业大学（威海）, 软件学院, 国家级示范性软件学院',

    // 添加到 html head 中的信息
    site_headers: [
        '<meta name="author" content="KelvinSun@HITWH">'
    ],
    // 站点左上角大图 logo
    site_logo: '',
    // 站点标题栏 logo
    site_icon: '/public/images/logo.png',
    // cdn host，如 http://cnodejs.qiniudn.com
    site_static_host: '', // 静态文件存储域名
    // 网站的域名
    host: '127.0.0.1',
    // 默认的 Google tracker ID，自有站点请修改，申请地址：http://www.google.com/analytics/
    google_tracker_id: '',
    // 默认的 cnzz tracker ID，自有站点请修改
    cnzz_tracker_id: '',

    // 数据库连接配置（MySQL）
    db: {
        host: '127.0.0.1',
        port: 3306,
        user: 'user_name',
        password: 'user_password',
        database: 'project_database',
        charset: 'UTF8MB4_UNICODE_CI'
    },

    // redis 配置，默认在本地
    redis: {
        host: '127.0.0.1',
        port: 6379,
    },
    // redis_host: '127.0.0.1',
    // redis_port: 6379,
    redis_session_db: 0,
    redis_cache_db: 1,

    // 秘钥，没事可以换换玩
    session_secret: 'your_secret',
    // cookie 名字
    auth_cookie_name: 'your_cookie_name',

    // 程序运行的端口
    port: 3000,

    // 默认新闻列表长度
    default_news_list_count: 20,

    // RSS 配置（目前还没用）
    rss: {
        title: '哈尔滨工业大学（威海）软件学院',
        link: 'http://software.hitwh.edu.cn',
        language: 'zh-cn',
        description: '来自哈尔滨工业大学（威海）软件学院的新闻通知',
        // 最多获取 RSS Item 的数量
        max_rss_items: 50,
        docs: 'http://software.hitwh.edu.cn/api/rss',
        ttl: 60,
    },

    // 邮箱配置
    mail_opts: {
        host: 'example.example.com',
        port: 25,
        auth: {
            user: 'example@example.com',
            pass: 'example'
        }
    },

    // weibo app key
    // weibo_key: 1000000,
    // weibo_id: 'your_weibo_id',

    // admin 设置
    admins: {
        user_login_name: true
    },

    // github 登陆的配置
    // GITHUB_OAUTH: {
    //     clientID: 'your GITHUB_CLIENT_ID',
    //     clientSecret: 'your GITHUB_CLIENT_SECRET',
    //     callbackURL: 'http://software.hitwh.edu.cn/auth/github/callback'
    // },

    // 是否允许直接注册
    allow_sign_up: false,

    // newrelic 是个用来监控网站性能的服务
    // newrelic_key: 'yourkey',

    // 文件上传配置
    upload: {
        path: path.join(__dirname, 'public/upload/'),
        url: '/public/upload/'
    },

    // 右上角的导航区
    site_navs: [
        // 格式 [ path, title, [target=''] ]
        [ '/about', '关于' ]
    ],

    // 版块
    tabs: [
        ['share', '分享'],
        ['ask', '问答'],
        ['job', '招聘']
    ],

    create_post_pre_day: 1000, // 每个用户一天可以发的主题数
    visit_per_day: 1000, // 每个 ip 每天能访问的次数

    page_jump_size: 2,
    cors_sites: [
        'localhost'
    ],
};

if ('test' === process.env.NODE_ENV) {
    config.db = {
        host: '127.0.0.1',
        port: 3306,
        user: 'user_name',
        password: 'user_password',
        database: 'project_database',
        charset: 'UTF8MB4_UNICODE_CI'
    };
}

module.exports = config;