---
name: sbti-ti-stack
description: >-
  Maintains the personality test engine monorepo: static web demo (index.html),
  WeChat mini program framework (miniprogram/), generated data (sbti-data.js),
  and build/sync scripts. Use when editing example questions, extending the
  engine, porting logic between web and MP, debugging scoring, publishing to
  GitHub, or running local/CI verification.
---

# Personality Test Engine — Skill 工作方式

## 仓库是什么

通用趣味人格测试引擎框架，双端同一数据与同一计分算法：

1. **网页端**：根目录 `index.html`（内联 CSS/JS），配套 `image/` 占位图。
2. **微信小程序**：`miniprogram/`（原生页面 + `utils` 逻辑），图片在分包 `packageImages/images/`。
3. **生成链**：修改网页内嵌脚本里的数据后，用 `node scripts/build-sbti-data.js` 生成 `miniprogram/utils/sbti-data.js`；图片用 `scripts/sync-mp-images.sh` 同步到分包。

> 当前题库和类型描述为**占位示例**，仅展示数据格式和引擎运行流程。用户应替换为自己的原创内容。

## 必须遵守的约定

- **单一事实来源**：题目、`TYPE_LIBRARY`、`NORMAL_TYPES`、`DIM_EXPLANATIONS` 等以 **`index.html` 内 `<script>`** 为准；小程序侧 **`sbti-data.js` 勿手改**，只通过构建脚本再生。
- **外链策略**：网页为零外链版本（无统计、无图床回退）；小程序仅本地/分包资源路径。
- **小程序主包体积**：主包尽量只含页面与 `utils`；大图必须在 **`packageImages` 分包**。
- **合规**：仓库不包含任何特定测试的完整题库或美术资产，仅提供通用引擎框架。

## 修改流程（Agent 执行顺序）

1. 编辑 `index.html` 中对应数据结构。
2. 运行：`node scripts/build-sbti-data.js`。
3. 若更新了 `image/`：运行 `./scripts/sync-mp-images.sh`。
4. 运行：`node scripts/verify-sbti-engine.js`（冒烟：数据可加载、计分函数可跑通）。
5. 网页：本地 HTTP 服务手点一遍；小程序：微信开发者工具编译真机预览。

## 测试要点

详见同目录 `reference.md` 的「测试清单」。

## GitHub 发布建议

- 仓库根保留 `README.md`（给人看的机制拆解与使用步骤）。
- **不要提交**含密钥或本机路径的私有配置；`project.private.config.json` 已在 `.gitignore`。
- `project.config.json` 内的 `appid` 为公开标识；**AppSecret 永远不要进仓库**。
