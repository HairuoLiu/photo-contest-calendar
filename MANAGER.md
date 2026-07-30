# 维护与 Agent 协作手册 · Manager Doc

**给未来接管的 AI Agent（或维护者）**：本文件说明「这个项目是怎么被一堆 Agent 协作建起来的、任务怎么分配、每种语言 Agent 具体干什么、以及你该如何无缝接手继续维护」。

配套阅读：`README.md`（产品/用户视角）、`README.dev.md`（系统事实来源）。读完这三份 + 源码，你应能**完整复刻前任 Agent 的记忆**，并按既有设计逻辑继续更新、随时交接。

---

## 0. 项目一句话
开源、无后端、免登录的**摄影比赛截止日历**（年/月/周视图 + 本周/本月截止提醒 + 68 场赛事，16 种语言）。线上：[摄影比赛截止日历](https://hairuoliu.github.io/photo-contest-calendar/)。推 `main` 即部署。

---

## 1. 一共用了多少个 Agent、怎么分配的

| 阶段 | Agent 数量 | 类型 / 角色 | 各自做了什么 |
| --- | --- | --- | --- |
| A. 初始搭建 | 1（主导 Agent） | modern-webapp 专家 | 从零搭好整个 Vite+React+TS+Tailwind 应用、所有组件、i18n 框架、部署。 |
| B. 15 语言内容翻译 | **15** | general-purpose，每语言 1 个 | 每个 Agent 独立写出 `src/data/i18n/<lang>.ts`（68 条 `{name?,desc,entry}`）。并行、写不同文件，互不冲突。 |
| C. 移动端重构 + UX 打磨 | 1（主导）+ 1（评审） | 主导实现；1 个红点 UX 评审 Agent | 主导落实无边框正方形顶栏簇、悬浮主题按钮、日期融入「今天」、footer 提示；1 个红点评审 Agent 给易用性清单，主导落地。 |
| D. 溢出修复 + 语言重叠审计 + 红点评审#2 | 1（主导）+ **15** + **3** | 主导修复；15 个语言重叠审计 Agent；3 个红点评审 Agent | 主导修复 WatchlistPanel 横向溢出（`min-w-0`）；**15 个语言 Agent 各审一种语言的文字重叠/溢出**；3 个红点 Agent 分维度评审（风格化 / 红点标准 / 跨设备兼容）。 |
| **合计** | **约 36 次 Agent 调用** | | 翻译 15 + 重叠审计 15 + 红点评审 1+3=4 + 主导若干。 |

**分配原则（核心逻辑）**：
1. **语言相关、可并行、写独立文件** → **每种语言一个 Agent**（绝不丢给一个巨型 Agent）。好处：每个 Agent 上下文小、产出可逐文件校验、写不同文件零冲突。
2. **跨切面评审按「维度」拆** → **少数几个 Agent，每个负责一个评审视角**（风格 / 标准 / 兼容）。避免多个 Agent 审查同一片导致结论重叠。
3. **主导 Agent 保留**：架构决策、多人会碰的共享文件（`content.ts`、`translations.ts`、`App.tsx`、`Header.tsx`）、`typecheck`/`build`/`deploy`、以及所有**面向用户的决策**（拿不准就问用户，不替用户拍板产品/UX 板）。
4. **审计类 Agent 一律 research-only（不改文件）**；具体实现由主导（或专职实现 Agent）统一落地，保证单一事实来源、避免互相冲突的编辑。
5. **让 Agent 的最终回复尽量短（一行）**，规避早前出现过的「消息过长导致管线 400 错误」。

---

## 2. 「每种语言的 Agent」具体要做什么（标准契约）

无论是翻译阶段还是重叠审计阶段，每个语言 Agent 都遵循同一份契约：

**输入**：`src/data/i18n/<lang>.ts` + `translations.ts` 中该语言的 UI 文案块 + 渲染组件（`CompetitionCard`、`WatchlistPanel`、`UpcomingPanel`、`Header`、`CalendarControls`、`DaySheet`、`LanguageSwitcher`、`ShareButton`、`InstallBanner`、`App.tsx` footer）。

**检查项（无需浏览器，静态分析「译文长度 vs 容器约束」即可）**：
- 小号 `text-[11px]` chip（分类/地区/费用/等级）里的长单词是否撑破或丑陋换行；
- 分段控件「年/月/周」在该语言下是否塞得下、不拥挤/不重叠；
- 带图标的按钮（官网/投稿）标签是否换行难看；
- 卡片标题 `truncate`（省略号可接受，仅当关键专名被截断才记一笔）；
- `CalendarControls` 的「今天 + 日期」在桌面与 390px 移动端是否单行不溢出、不把箭头挤出屏；
- `LanguageSwitcher` 下拉里语言名是否被正确显示（不被截断）；
- footer 提示是否干净换行；
- `DaySheet` 行内文字是否溢出。

**交付格式**：列出 `{位置, 该语言字符串, 为何重叠/溢出, 严重度, 建议：缩减(reduce) | 重构(restructure)}`，并给一句结论 `OVERLAP RISK: none | low | high`。

**决策路径（关键）**：若发现重叠 → **先向用户汇报** → 用 `AskUserQuestion` **逐语言询问「缩减（缩短译文）」还是「后移/重构（改 CSS/布局）」** → **不要擅自缩短**（机器译文本就是待母语者校对的占位，擅自缩会丢失信息）。用户拍板后再由主导落地。

---

## 3. 继续维护时必须保留的设计逻辑（别破坏）

1. **回退链** `具体语言 → 英文 en → 原始中文 zh-CN`（`content.ts` 的三个解析器）。新增语言时**不要破坏**这条链。
2. **CJK 语言带 `name` 字段**；非 CJK 直接用英文品牌名（国际惯例）。
3. **Grid 子项保留 `min-w-0`**；卡片 `overflow-hidden`；标题 `truncate`、描述 `line-clamp`、chip 行 `flex flex-wrap`。这套组合是**跨所有语言防整页横向滚动的底线**，移除会在某些语言复发溢出（已踩过坑）。
4. **数据即代码**：单一数据源 `competitions.ts`；TBD 赛事带 `confidence`。
5. **i18n 是 URL 驱动**（`/<lang>`）+ `404.html` SPA 回退；推 `main` 即部署。
6. **自动化只开 PR、绝不自动合并**（正确性 > 新鲜度）。
7. **主题/布局约定**：悬浮 `ThemeFab`（DaySheet 打开时隐藏）、无边框正方形右上簇、footer 用真实 `<a>`（禁止 `dangerouslySetInnerHTML`）。

---

## 4. 开放事项 / 待用户决策（诚实清单）

- **15 种机器翻译需母语者校对**（质量参差，已知、用户已认可的状态）。
- **每种语言的重叠审计结果** → 等用户逐项决策（缩减 or 后移/重构）。
- **红点「艺术豪赌」项未定**：胶片颗粒已在 `index.css`（`feTurbulence`）；自定义光标、真实摄影 hero、视图间共享元素过渡 —— 等用户拍板。
- **红点评审 #2 的进一步美化建议**待分类执行。

---

## 5. 接手 / 继续维护检查清单（给下一个 Agent）

1. 先读 `README.md` → `README.dev.md` → 本文件 → 源码。
2. `npm install` → `npm run typecheck`（**必须 0 错误**）→ `npm run build`（`dist/` + `404.html` 再生）。
3. **改内容**：编辑 `competitions.ts`；**加语言**：扩 `LANGS`+`DICT` + 新建 `src/data/i18n/<code>.ts`（68 条）+ `content.ts` 的 import 与 `TABLES`。
4. **部署**：推 `main` → GitHub Actions 构建并发布；随后验证线上 URL。
5. **产品/UX 拿不准时**：给出 2–3 个方案让用户选，**不要替用户猜**。
6. 提交用约定式 commit；`main` 即部署分支。

> 记忆复刻目标：任一个新 Agent 读完这三份文档 + 源码，应获得与前任一致的项目记忆，可直接继续，不依赖任何未文档化的口口相传。
