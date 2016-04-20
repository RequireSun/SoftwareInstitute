# SoftwareInstitute
A Node.js CMS using MySQL.

__正在 gulp 化__

开发环境:

1. 安装 mysql
2. 安装 redis (目前还没用)
3. 安装 node.js
4. 安装 ruby (为了 sass)
5. 安装 python (为了编译 node-sass)
6. `npm install` 安装 node 依赖
7. `bower install` 安装 javascript 库依赖
8. `npm install -g supervisor grunt grunt-cli` 安装 supervisor 和 grunt
9. linux 用户
   + `npm run develop` 开启监视
   + `npm run stopdev` 结束任务
10. windows 用户 (分别在两个终端中)
   + `node app` (最好是 `supervisor app`) 开启后端业务
   + `grunt nodeserve` 开启前端监视
   + 直接结束进程就可以结束任务

TODO:

- [ ] request_log 中间件的 ip 获取方式
- [x] 把前端部分合并进来
- [ ] 新闻阅读量防刷
- [ ] 减少包的依赖数量 (必要的话从 sass 迁到 less, 因为 sass 的依赖实在太恶心了)
- [ ] 文件路径获取
- [ ] 数据库更新 update_time 的时候要把 pv 的值删掉啊

数据库结构解释:

style_type 样式的类型 (左侧栏 / 标题栏 / 页脚)

style 样式内部的列表组 (第一个 xxx / 第二个 yyy / 第三个 zzz)

style_relation 列表组内部连接到的大 / 小栏目