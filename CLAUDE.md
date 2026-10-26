# DailyTen

@AGENTS.md

## 架构

- **线上产品 = `web-prototype/`**：纯静态页，`index.html` + `app.js` + `styles.css`，无构建步骤。本地预览：在 `web-prototype/` 里跑 `python -m http.server 8101`。
- **每日生成**：`.github/workflows/dailyten-generate.yml` 每天 21:00 UTC（北京时间 05:00）运行 `node web-prototype/scripts/generate-dailyten.mjs`，生成两版（综合 daily + AI 专版）各 10 条新闻，提交到 `web-prototype/data/`，再部署到 GitHub Pages。
- **`web-prototype/data/` 是自动生成的，不要读，也不要改。** 数据结构看 `web-prototype/schema/`。
- **`src/`** 是 Expo App，用 `src/data/mockNews.ts` 假数据，暂不维护，除非明确要求。

## 设计规范（web-prototype）

- 定位：编辑型信息产品。卡片负责筛选，详情负责讲懂，图形负责降理解成本。手机端纵向单列，不用表格。
- 视觉：奶油底 + 大圆角卡片。深橄榄绿 = 标题/主色，鼠尾草绿 = 浅底，金棕 = 分类标签/强调，雾蓝 = 次要数据。
- 折叠态（3 秒决定点不点开）：顶部"今日 10 条 · 约 8 分钟"+ 圆点进度；每张卡只放 分类+时间、一句人话标题、一句话结论、"N 个来源"。
- 展开态顺序：一句话结论 → 三个关键事实（短标签 + 一句短语的块，不是段落）→ 核心可视化（因果链/对比/时间线/数字，按内容选，没数据就不画）→ 对你有什么影响（带图标的结果卡）→ 接下来只看两个信号 → 来源（最底部，做轻）。
- 不显示数据库字段名；措辞用"N 个独立来源"，不用"已交叉验证"。
