# sbti.ti

> _「测完 MBTI 你更空虚了？四个字母框不住你，但三十道题可以把你骂笑又骂哭——这一次，结果页上的图和字，全都在你手里。」_

静态网页 · 微信小程序 · Cursor Skill · 零外链可离线

---

你还在到处搜「免费人格测试」结果点进去全是广告？  
你还在截图别人的结果页却不敢转发因为水印丑到窒息？  
你想自己改一题、换一张海报、上架成小程序，却发现源码像失踪人口？  
你让 AI 帮你维护项目，它却把题目改一半、路径改断、分包忘传？

**把一整套「能跑、能改、能发」的 SBTI 留在仓库里——从浏览器到微信，从人类到 Agent，一次对齐。**

给你：**同一套题库与计分**、**网页一键本地预览**、**原生小程序工程（含图片分包）**、**从 HTML 自动生成小程序数据脚本**、**给 Cursor 看的项目 Skill（改题不翻车）**。

**能力一览 · 安装运行 · 使用方式 · 场景 Demo · 功能与设计 · 目录结构 · 注意事项**

---

> **给路过的人一句实话**：这不是诊疗，不是招聘，不是相亲判决书；这是赛博塔罗牌，是你和朋友喝酒时的谈资，是你深夜怀疑人生时的电子创可贴。  
> 觉得戳心就 **Star**，想改就 **Fork**，想骂就 **Issue**——情绪到位了，传播自然会发生。

---

## 能力一览

> beta 气质：能稳跑、能魔改；你要的是「拿得走」，不是「租云端」。

| 你要的 | 网页 `index.html` | 微信小程序 | 脚本 / Skill |
|--------|-------------------|------------|----------------|
| 离线可玩（无外链统计、无图床回退） | ✅ | ✅ 本地资源路径 | — |
| 三十道常规题 + 饮酒分支隐藏逻辑 | ✅ | ✅ 同源算法 | `sbti-engine.js` |
| 多人格海报图 | `image/` | 分包 `packageImages/images/` | `sync-mp-images.sh` |
| 改题后同步双端 | 改 HTML 后生成 | 自动更新 `sbti-data.js` | `build-sbti-data.js` |
| Agent 协作约定 | — | — | `.cursor/skills/sbti-ti-stack/` |
| 冒烟自检 | 浏览器手点 | 开发者工具真机 | `verify-sbti-engine.js` |

---

## 安装与运行

### 克隆仓库

```bash
git clone <你的仓库地址>.git
cd <仓库目录>
```

### 网页：本地预览

```bash
chmod +x ./start-local.sh
./start-local.sh
```

浏览器打开 **`http://127.0.0.1:8765/`**（端口以终端提示为准）。

### 微信小程序

1. 安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)。  
2. **导入项目**，目录选择本仓库**根目录**（含 `project.config.json`）。  
3. 在 `project.config.json` 中填写你的 **`appid`**。  
4. 编译 → 预览 / 真机调试。海报在分包，答题页已配置预加载，减少结果页首次白图。

### 依赖说明

- 网页端：**无 npm 依赖**，有 Python 3 即可起静态服务。  
- 数据生成与校验：**仅需 Node.js**（用于执行 `scripts/*.js`）。

---

## 使用方式

### 我只玩，不改

- 网页：`./start-local.sh` 打开即玩。  
- 小程序：开发者工具导入根目录，编译即玩。

### 我要改题目 / 人格文案 / 维度

1. 只改 **`index.html`** 里 `<script>` 中的数据（题目、`TYPE_LIBRARY`、`NORMAL_TYPES` 等）。  
2. 执行：

```bash
node scripts/build-sbti-data.js
./scripts/sync-mp-images.sh
```

3. 再跑：

```bash
node scripts/verify-sbti-engine.js
```

4. 网页刷新验证；小程序重新编译验证。

### 我要让 Cursor 别乱改生成文件

打开 **`.cursor/skills/sbti-ti-stack/SKILL.md`**，把本仓库交给 Agent 时它会优先遵守「单一事实来源、先构建再提交」的约定；细则见同目录 **`reference.md`**。

---

## 场景 Demo

**场景 1：第一次打开**

```
你            ❯ 点开链接，只想测一把，别让我注册。

sbti.ti       ❯ 首页一句话，按钮一按，题全在一张长卷上滑完。
                没有登录墙，没有「再看一段广告解锁结果」。
```

**场景 2：测完破防了**

```
你            ❯ 这结果怎么骂得这么准？？？

sbti.ti       ❯ 十五个维度摊开给你看，海报图怼脸。
                友情提示里写清楚：娱乐向，别当人生判决书。
```

**场景 3：你想魔改上架**

```
你            ❯ 我要换成自己的梗图、自己的免责声明。

sbti.ti       ❯ 改 HTML → 一条命令刷到小程序数据 → 分包图片同步。
                合规类目你自己对平台负责，代码层不绑任何云服务。
```

---

## 功能与设计

### 双端如何对齐

| 部分 | 说明 |
|------|------|
| **单一事实来源** | 题目与核心数据以 `index.html` 内脚本为准；小程序侧 `miniprogram/utils/sbti-data.js` 由脚本生成，**勿手改**。 |
| **计分与分支** | `miniprogram/utils/sbti-engine.js` 与网页逻辑对齐：洗牌插入、饮酒题、兜底人格等。 |
| **体积** | 大图走 **`packageImages` 分包**，避免主包爆表。 |

### 你可以怎么进化它

- 换 UI、换配色、加分享卡片——页面层随便卷。  
- 加埋点、加云函数——你自己接，本仓库默认 **零外链**。  
- 把 Skill 拷到个人 `~/.cursor/skills/`——全仓库通用。

---

## 目录结构

```
.
├── index.html                 # 网页单页（内联样式与逻辑）
├── image/                     # 网页用海报图
├── start-local.sh             # 本地 HTTP 预览
├── project.config.json        # 微信开发者工具工程入口
├── miniprogram/               # 小程序源码
│   ├── app.*
│   ├── pages/index|test|result/
│   ├── utils/sbti-data.js     # 【生成】勿手改
│   ├── utils/sbti-engine.js
│   └── packageImages/         # 分包：images/ + 占位页
├── scripts/
│   ├── build-sbti-data.js
│   ├── sync-mp-images.sh
│   └── verify-sbti-engine.js
└── .cursor/skills/sbti-ti-stack/
    ├── SKILL.md
    └── reference.md
```

---

## 注意事项

- **内容合规**：上架微信小程序前，请自行对照平台类目、审核规范与用户协议；本仓库不提供法律意见。  
- **密钥**：**AppSecret** 永远不要写进仓库；`project.private.config.json` 已在 `.gitignore` 中忽略（若你本地有）。  
- **质量**：脚本冒烟通过 ≠ 真机无坑；发版前务必真机走完全流程（含饮酒分支与结果图加载）。  
- **Star**：若这篇 README 让你心里「咯噔」一下，那颗星是给深夜还在改题的你自己的。

---

## 许可

仓库内若未单独声明，以各文件头或根目录 **LICENSE** 为准（可自行补充 MIT 等）。使用、改编、再发布时请遵守当地法律与平台规则。

**测完可以笑，可以骂，可以关掉页面去睡觉——但别把一个娱乐测试，活成你的人生终审。**
