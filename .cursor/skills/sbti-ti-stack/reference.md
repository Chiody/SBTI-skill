# Personality Test Engine — 结构与参考

## 1. 整体目录结构（逻辑分层）

```
personality-test-engine/
├── index.html                 # 网页 Demo（展示 + 全部业务 JS，单一事实来源）
├── image/                     # 网页用图片（当前为 placeholder.svg）
├── start-local.sh             # 本地起 HTTP 服务预览网页
├── project.config.json        # 微信开发者工具（小程序根：miniprogram/）
├── scripts/
│   ├── build-sbti-data.js     # 从 index.html 抽取数据 → utils/sbti-data.js
│   ├── sync-mp-images.sh      # image/ → packageImages/images/
│   └── verify-sbti-engine.js  # Node 冒烟测试
├── miniprogram/
│   ├── app.js / app.json / app.wxss
│   ├── pages/
│   │   ├── index/             # 首页 · 开始测试
│   │   ├── test/              # 答题（radio + 进度 + 条件分支题）
│   │   └── result/            # 结果（主类型 + 隐藏类型侧写 + 15 维）
│   ├── utils/
│   │   ├── sbti-data.js       # 【生成】题目与类型库
│   │   └── sbti-engine.js     # 洗牌、可见题、计分（与网页算法对齐）
│   └── packageImages/         # 【分包】
│       ├── images/            # 图片资源
│       └── pages/holder/      # 占位页（满足分包至少一页）
├── docs/
│   └── appendix-popular-tests.md  # 12 种测试横评附录
└── .cursor/skills/sbti-ti-stack/
    ├── SKILL.md
    └── reference.md
```

## 2. 按架构职责（模块类型）

| 类型 | 位置 | 职责 |
|------|------|------|
| 视图（Web） | `index.html` 内 DOM + CSS | 三屏切换：介绍 / 测试 / 结果 |
| 视图（MP） | `pages/*/*.wxml` + `.wxss` | 三页路由：index / test / result |
| 数据层 | `sbti-data.js`（生成） | 题目、类型库、维度元数据 |
| 领域逻辑 | `index.html` script / `sbti-engine.js` | 洗牌、条件分支题插入、`computeResult` |
| 构建 | `scripts/build-sbti-data.js` | HTML → 可 `require` 的模块 |
| 静态资源 | `image/`、`packageImages/images/` | 图片（当前为 placeholder） |
| 文档 | `docs/`、`README.md` | 机制拆解、测试横评、使用说明 |

## 3. 引擎核心算法

### 计分流程

1. 每道题关联一个维度，用户选择的 `value`（1/2/3）累加到对应维度
2. 原始分 → L/M/H 分档（`<=3` → L, `==4` → M, `>=5` → H）
3. L/M/H → 数值 1/2/3，组成 15 维用户向量
4. 与每个类型原型的 15 维模式向量计算曼哈顿距离
5. `similarity = max(0, round((1 - distance/30) * 100))`
6. 排序：距离最小 → 精确命中最多 → 相似度最高

### 特殊分支

- **隐藏类型**：当 `DRUNK_TRIGGER_QUESTION_ID` 对应题目的答案为 2 时触发
- **兜底类型**：当最佳匹配相似度 < 60% 时分配 FALLBACK

## 4. 当前数据规模（占位示例）

- **`questions`**：3 道示例题
- **`specialQuestions`**：2 道（gate + trigger）
- **`NORMAL_TYPES`**：2 条示例映射
- **`TYPE_LIBRARY`**：4 个类型（ALPHA、BETA、FALLBACK、HIDDEN）
- **`DIM_EXPLANATIONS`**：15 个维度 × 3 档 = 45 条说明
- **`TYPE_IMAGES`**：4 条 placeholder 路径

> 用户应替换为自己的原创内容。以上数量仅为引擎最小可运行配置。

## 5. 测试清单

### 5.1 自动化（Node，无浏览器）

```bash
node scripts/build-sbti-data.js
node scripts/verify-sbti-engine.js
```

期望：无异常退出；校验 `questions.length`、`computeResult` 返回含 `finalType`。

### 5.2 网页端（人工）

```bash
./start-local.sh
# 浏览器打开 http://127.0.0.1:8765/
```

- 完整答完提交，检查主类型、文案、15 维、图片
- 选条件分支触发隐藏题，验证隐藏类型与侧写区块

### 5.3 微信小程序（人工）

1. 微信开发者工具打开含 `project.config.json` 的根目录
2. 编译 → 真机预览
3. 重复网页端场景；确认分包图片能加载

### 5.4 发布前检查

- [ ] `appid` 与微信公众平台一致
- [ ] 主包体积未超标；大图仅在 `packageImages`
- [ ] 内容类目与审核材料符合微信平台规范
- [ ] 仓库不含任何密钥或敏感信息
