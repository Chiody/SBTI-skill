<div align="center">

# SBTI.skill

**「拆解全网刷屏的人格测试——从 MBTI 到 SBTI，它们到底是怎么做出来的？」**

[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Engine](https://img.shields.io/badge/Engine-15--Dimension-blue.svg)](#引擎核心算法说明)
[![Tests](https://img.shields.io/badge/横评-12_种主流测试-orange.svg)](#流行测试大横评)

</div>

<div align="center">

你测过 MBTI，截图发了朋友圈，觉得自己终于被理解了。
你测过 SBTI，笑到捶桌子，然后把结果甩到群里。
你测过星座、塔罗、九型人格、大五人格……
你做了一百次测试，但你有没有想过——

**这些测试背后，其实都是同一套技术模式？**

</div>

<div align="center">

15 维打分 → 模式匹配 → 类型映射 → 隐藏分支 → 结果渲染

**一套引擎，跑通所有趣味人格测试。**

</div>

---

> **本仓库不包含任何特定测试的完整题库或美术资产。**
>
> 本仓库做的事情是：拆解趣味人格测试的**通用实现机制**，提供一个**可复用的引擎框架**，并横向对比 **12 种主流人格/命运测试**的原理与科学边界。
>
> 你可以用这个引擎，填入你自己的题库，做出属于你自己的人格测试。

---

## 一个人格测试是怎么跑起来的？

不管是 MBTI、大五人格还是网上各种趣味测试，核心技术架构都可以抽象为以下流程：

```
题库（N 道题，每题关联一个维度）
        │
        ▼
  洗牌 + 条件分支（Fisher-Yates + 隐藏题触发）
        │
        ▼
  用户作答 → 按维度累加原始分
        │
        ▼
  原始分 → 分档（L / M / H 三级量化）
        │
        ▼
  用户向量 vs 类型原型向量 → 距离计算（曼哈顿距离）
        │
        ▼
  相似度排序 → 匹配最佳类型（含兜底 & 隐藏分支）
        │
        ▼
  渲染结果页（类型描述 + 维度评分 + 海报）
```

本仓库的引擎完整实现了上述每一步，并且支持：

- **15 维度打分体系**（可自定义维度数量和名称）
- **Fisher-Yates 洗牌**（每次答题顺序不同）
- **条件分支题**（特定答案触发隐藏题目）
- **隐藏人格机制**（特殊触发条件直接覆盖常规匹配）
- **兜底类型**（当所有类型匹配度低于阈值时的 fallback）
- **曼哈顿距离 + 精确维度命中数**双重排序

---

## 本仓库包含什么

| 模块 | 路径 | 说明 |
|------|------|------|
| 网页 Demo | `index.html` + `image/` | 单页应用，内联 CSS/JS，填入你的题库即可运行 |
| 微信小程序框架 | `miniprogram/` | 原生页面结构，数据由构建脚本从网页端同步 |
| 引擎核心 | `miniprogram/utils/sbti-engine.js` | 洗牌、可见题计算、计分、距离匹配、进度状态 |
| 数据层（生成） | `miniprogram/utils/sbti-data.js` | 由 `build-sbti-data.js` 从 `index.html` 提取，勿手改 |
| 构建脚本 | `scripts/build-sbti-data.js` | HTML → 可 `require` 的 JS 模块 |
| 图片同步 | `scripts/sync-mp-images.sh` | `image/` → `miniprogram/packageImages/images/` |
| 冒烟测试 | `scripts/verify-sbti-engine.js` | Node 环境下验证数据加载与计分逻辑 |
| Cursor Skill | `.cursor/skills/sbti-ti-stack/` | 让 AI Agent 按约定维护本仓库 |

> 当前仓库内的题库和类型描述为**占位示例**，仅用于展示数据格式和引擎运行流程。请替换为你自己的原创内容。

---

## 如何用这个引擎做你自己的测试

### 1. 定义维度

在 `index.html` 的 `dimensionMeta` 中定义你的维度：

```javascript
const dimensionMeta = {
  D1: { name: '维度一 自信心', model: '自我模型' },
  D2: { name: '维度二 共情力', model: '情感模型' },
  // ... 最多 15 个维度
};
```

### 2. 编写题库

每道题关联一个维度，选项值为 1-3 分：

```javascript
const questions = [
  {
    id: 'q1', dim: 'D1',
    text: '你的题目文本',
    options: [
      { label: '选项 A', value: 1 },
      { label: '选项 B', value: 2 },
      { label: '选项 C', value: 3 }
    ]
  },
  // ...
];
```

### 3. 定义人格类型

每个类型有一个 15 维的 L/M/H 模式串：

```javascript
const TYPE_LIBRARY = {
  "YOUR_TYPE": {
    code: "YOUR_TYPE",
    cn: "你的类型名",
    intro: "一句话介绍",
    desc: "详细描述..."
  }
};

const NORMAL_TYPES = [
  { code: "YOUR_TYPE", pattern: "HHH-HMH-MHH-HHH-MHM" }
];
```

### 4. 构建 & 运行

```bash
# 生成小程序数据
node scripts/build-sbti-data.js

# 同步图片到小程序分包
./scripts/sync-mp-images.sh

# 冒烟测试
node scripts/verify-sbti-engine.js

# 本地预览网页
chmod +x ./start-local.sh && ./start-local.sh
```

---

## 流行测试大横评

玩了这么多年人格测试，你知道它们之间有什么区别吗？

| 测试类型 | 标签风格 | 核心情绪价值 | 适用场景 | 流行周期 | 科学依据 |
|----------|----------|--------------|----------|----------|----------|
| 星座测试 | 浪漫神秘 | 找到同类，命运指引 | 早年社交破冰 | 2010 年前 | 无 |
| 塔罗牌 | 神秘解惑 | 迷茫时的情绪寄托 | 遇事求个心安 | 长期流行 | 无 |
| MBTI | 积极专业 | 自我探索，职场定位 | 社交 / 职场 | 2022-2024 | 半科学，争议大 |
| 大五人格 | 学术严谨 | 科学自我认知 | 心理学研究 | 持续 | 主流心理学认可 |
| 九型人格 | 灵性深邃 | 深层动机探索 | 自我成长 / 团队 | 持续 | 弱，缺乏实证 |
| DISC | 职场实用 | 沟通风格定位 | 企业培训 | 持续 | 中等，应用广泛 |
| 霍兰德 | 职业导向 | 找到适合的职业方向 | 职业规划 | 持续 | 较强，有实证支持 |
| 盖洛普优势 | 正向赋能 | 发现天赋优势 | 职场发展 | 持续 | 中等，商业驱动 |
| 16PF | 学术量化 | 多因素人格画像 | 临床 / 研究 | 持续 | 较强 |
| 色彩性格 | 通俗易懂 | 快速分类 | 大众娱乐 / 培训 | 2010s | 弱 |
| PDP 动物性格 | 形象生动 | 直觉式自我认知 | 企业团建 | 持续 | 弱，商业工具 |
| 趣味梗测试 | 自嘲扎心 | 情绪宣泄，对抗规训 | 玩梗 / 社交 | 当下 | 无，纯娱乐 |

**每种测试的详细原理、实现机制与科学边界** → 见 [附录：流行测试类型原理](docs/appendix-popular-tests.md)

---

## 引擎核心算法说明

### 计分：按维度累加

每道题关联一个维度，用户选择的 `value`（1/2/3）累加到对应维度的原始分。

### 分档：L / M / H

```
score <= 3  →  L (Low)
score == 4  →  M (Medium)
score >= 5  →  H (High)
```

阈值可根据你的题目数量和分值范围自行调整。

### 匹配：曼哈顿距离

将 L/M/H 映射为数值 1/2/3，计算用户向量与每个类型原型向量的曼哈顿距离：

```
distance = Σ |user[i] - type[i]|    (i = 1..15)
similarity = max(0, round((1 - distance/30) * 100))
```

排序规则：距离最小 → 精确命中维度最多 → 相似度最高。

### 特殊分支

- **隐藏类型**：当特定条件题的答案触发时，直接覆盖常规匹配结果
- **兜底类型**：当最佳匹配的相似度低于 60% 时，分配 fallback 类型

---

## 项目结构

```
personality-test-engine/
├── README.md
├── index.html                          # 网页 Demo（单一事实来源）
├── image/                              # 海报图（当前为 placeholder）
├── start-local.sh                      # 本地 HTTP 服务
├── project.config.json                 # 微信开发者工具配置
├── miniprogram/
│   ├── app.*
│   ├── pages/index|test|result/        # 三个页面
│   ├── utils/sbti-data.js              # 【生成】勿手改
│   ├── utils/sbti-engine.js            # 引擎核心
│   └── packageImages/                  # 分包图片 + 占位页
├── scripts/
│   ├── build-sbti-data.js              # HTML → JS 数据模块
│   ├── sync-mp-images.sh               # 图片同步
│   └── verify-sbti-engine.js           # 冒烟测试
├── docs/
│   └── appendix-popular-tests.md       # 12 种测试横评附录
└── .cursor/skills/sbti-ti-stack/
    ├── SKILL.md                        # Agent 工作指南
    └── reference.md                    # 结构与测试参考
```

---

## 如何测试

```bash
git clone https://github.com/Chiody/SBTI-skill.git
cd SBTI-skill

# 冒烟测试（Node）
node scripts/verify-sbti-engine.js

# 本地网页预览
chmod +x ./start-local.sh && ./start-local.sh

# 改题后重新生成小程序数据
node scripts/build-sbti-data.js
./scripts/sync-mp-images.sh
```

- **网页**：浏览器打开 `http://127.0.0.1:8765/`，完整走一遍答题流程
- **小程序**：微信开发者工具导入仓库根目录，编译预览

---

## 注意事项

- 本仓库**不包含**任何特定测试的完整题库、原创文案或美术资产，仅提供通用引擎框架与机制分析
- 当前内置的题目和类型描述为**占位示例**，请替换为你自己的原创内容
- 本项目仅供学习与娱乐，请勿将任何人格测试结果当作心理诊断、招聘或人身评价依据
- 小程序上架请自行遵守[微信小程序运营规范](https://developers.weixin.qq.com/miniprogram/product/)
- **勿将 AppSecret 等密钥写入仓库**

---

## 贡献

欢迎提 Issue 和 PR：

- 新增测试类型横评
- 引擎功能扩展（加权维度、多轮测试、结果对比等）
- 小程序 UI 优化
- 文档翻译

---

## Star History

如果这个仓库帮你搞懂了人格测试的底层逻辑，或者你用引擎做出了自己的测试——欢迎 **Star**。

---

## License

MIT License

---

<div align="center">

**变的是标签的形式——星象、牌面、字母、颜色、动物、梗。**

**不变的是我们想要被理解、被归类、被允许表达真实自己的渴望。**

**拆开它，看懂它，然后做一个属于你自己的。**

</div>
