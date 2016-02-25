Δ 管理员权限
☆ 不同用户不同权限
〇 对应用户

# 新闻条目

1. get 获取指定新闻
  * id 对应 ID
2. Δ post 发表新闻
  * category 栏目
  * title 标题
  * content 内容
  * 看不清
3. Δ put 修改新闻
  * id 对应 ID
  * category 栏目
  * title 标题
  * content 内容
  * 看不清
4. Δ delete 删除新闻
  * id 对应 ID

# 小栏目结构

1. get 获取小栏目结构
  * id 对应 ID
2. Δ post 增加小栏目
  * title 标题
  * outline 大栏目 (id?)
3. Δ put 修改小栏目
  * id 对应 ID
  * title 标题
  * outline 大栏目 (id?)
4. Δ delete 删除小栏目
  * id 对应 ID

# 大栏目结构

_思考: 数据库的对应结构怎么搞, 如何提高更新的效率_

1. get 获取大栏目结构
  * id 对应 ID
2. Δ post 增加大栏目
  * title 标题
  * category 小栏目组 (id 数组?)
3. Δ put 修改大栏目
  * id 对应 ID
  * title 标题
  * category 小栏目组 (id 数组?)
4. Δ delete 删除大栏目
  * id 对应 ID

# 栏目总结构

1. get 获取
2. Δ put 整体更新
   * outlines 栏目结构的 json 数组

# 小栏目条目

1. get 获取
   * id 对应栏目 ID

# 大栏目条目

1. get 获取
   * id 对应栏目 ID

# 个人信息

1. ☆ get 获取
   * id 对应用户 ID
2. 〇 post 新增
   * username 用户名
   * password 密码
   * nickname 昵称
3. 〇 put 修改
   * id 对应用户 ID
   * username 用户名
   * password 密码
   * nickname 昵称

# 用户列表

1. Δ get 获取

# 权限设置

_需要添加_

# 拉黑

1. Δ post 拉黑
   * id 对应用户 ID
2. Δ delete 取消拉黑
   * id 对应用户 ID

# 评论列表

1. get 获取对应新闻的评论
   id 新闻的 ID

# 评论

1. 〇 post 添加
   * article_id 文章 id
   * content 内容
   * _回复了谁?_
2. 〇 put _修改?_
3. 〇Δ delete
   * id 回复的 id