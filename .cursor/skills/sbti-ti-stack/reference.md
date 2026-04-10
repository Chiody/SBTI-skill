# SBTI TI 仓库 — 结构与参考

## 1. 整体目录结构（逻辑分层）

```
TI/
├── index.html                 # 网页单页应用（展示 + 全部业务 JS）
├── image/                     # 网页用海报图（与 miniprogram 分包应对应同文件名）
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
│   │   ├── test/              # 答题（radio + 进度 + 饮酒分支题）
│   │   └── result/            # 结果（主类型 + 酒鬼侧写 + 十五维）
│   ├── utils/
│   │   ├── sbti-data.js       # 【生成】题目与人格库
│   │   └── sbti-engine.js     # 洗牌、可见题、计分（与网页算法对齐）
│   └── packageImages/         # 【分包】
│       ├── images/*.png|jpg   # 海报
│       └── pages/holder/      # 占位页（满足分包至少一页）
```

## 2. 「类型」统计（多义项对照）

### 2.1 按文件扩展名（便于 GitHub / 代码统计）

| 扩展名 | 用途 |
|--------|------|
| `.html` | 网页端单文件 |
| `.js` | 小程序页面逻辑、`utils`、Node 构建/校验脚本 |
| `.json` | 小程序页面配置、`app.json`、`project.config.json` |
| `.wxml` | 小程序结构 |
| `.wxss` | 小程序样式 |
| `.png` / `.jpg` | 人格结果海报 |
| `.sh` | 本地服务、同步图片 |

### 2.2 按架构职责（模块类型）

| 类型 | 位置 | 职责 |
|------|------|------|
| 视图（Web） | `index.html` 内 DOM + CSS | 三屏切换：介绍 / 测试 / 结果 |
| 视图（MP） | `pages/*/*.wxml` + `.wxss` | 三页路由：index / test / result |
| 数据层 | `sbti-data.js`（生成） | 题目、`TYPE_*`、维度元数据 |
| 领域逻辑 | `index.html` script / `sbti-engine.js` | 洗牌、饮酒题插入、`computeResult` |
| 构建 | `scripts/build-sbti-data.js` | HTML → 可 `require` 的模块 |
| 静态资源 | `image/`、`packageImages/images/` | 海报 |

### 2.3 业务内「人格类型」数量（来自数据结构）

以 `node -e "require('./miniprogram/utils/sbti-data.js')"` 实际 `length` / `Object.keys` 为准；当前快照约为：

- **`NORMAL_TYPES`**：参与模式匹配的条目数（当前 **25**）。
- **`TYPE_LIBRARY`**：带完整 `desc` 的条目键数量（当前 **27**，含兜底与隐藏人格等）。
- **`TYPE_IMAGES`**：海报路径条目数应与有图人格一致（当前 **26** 个文件级映射）。

## 3. 测试清单

### 3.1 自动化（Node，无浏览器）

```bash
node scripts/build-sbti-data.js
node scripts/verify-sbti-engine.js
```

期望：无异常退出；校验 `questions.length`、`computeResult` 返回含 `finalType`。

### 3.2 网页端（人工）

```bash
cd TI && ./start-local.sh
# 浏览器打开 http://127.0.0.1:8765/
```

- 完整答完提交，检查主类型、文案、十五维、海报。
- 选「饮酒」分支触发第二道补充题，再验证 **DRUNK** 与侧写区块。

### 3.3 微信小程序（人工）

1. 微信开发者工具打开 **含 `project.config.json` 的 TI 根目录**。
2. 编译 → 真机预览。
3. 重复网页端场景；确认首次进结果页分包图片能加载（答题页已配置 `preloadRule`）。

### 3.4 发布前检查

- [ ] `appid` 与微信公众平台一致。
- [ ] 主包体积未超标；大图仅在 `packageImages`。
- [ ] 内容类目与审核材料符合微信平台规范。

## 4. Cursor Skill 与 GitHub 的关系

- **Skill**：`.cursor/skills/sbti-ti-stack/` 随仓库提交后，协作者的 Cursor 可把本目录加入 Skills 扫描路径（按团队约定），Agent 会按 `SKILL.md` 约束改代码。
- **GitHub**：整仓推送即可；Skill 不是 npm 包，而是**文档 + 约定**，与 README 互补（README 面向人，Skill 面向 Agent）。
