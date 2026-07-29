# 开发文档 · Developer README

面向**贡献者 / 维护者 / 接管的 AI Agent**。普通用户请看根目录 [`README.md`](./README.md)；任务分配与交接逻辑请看 [`MANAGER.md`](./MANAGER.md)。

> 本文件是系统的「事实来源」。任何接管本项目的 Agent 都应先读 `README.md` → 本文件 → `MANAGER.md` → 源码，即可复刻上下文并继续维护。

---

## 1. 技术栈

- Vite 5 + React 19 + TypeScript（`strict` 严格模式）
- Tailwind CSS 3（`darkMode: 'class'`）
- Framer Motion 11（视图切换、悬停气泡、底部弹层动画）
- date-fns 3（日期计算 + 各语言 `Locale`）
- lucide-react（图标）
- clsx + tailwind-merge（`cn()` 工具）
- **无后端、无数据库**，纯静态站点，直接挂 GitHub Pages。

依赖与脚本见 `package.json`：

```bash
npm install
npm run dev        # 本地开发，默认 http://localhost:5173
npm run build      # 产物输出到 dist/（含复制 404.html）
npm run preview    # 预览构建产物
npm run typecheck  # tsc --noEmit，必须 0 错误
```

---

## 2. 架构与目录

```
src/
  App.tsx                   布局与全局状态（视图、悬停、日格弹层、主题）
  main.tsx                  入口
  index.css                 全局样式 / 动画令牌 / 胶片颗粒(feTurbulence) / 暖调变量
  i18n/
    translations.ts         UI 文案字典 DICT（按语言分块）+ LANGS + DATE_LOCALE + detectLang
    index.tsx               I18nProvider / useT（URL>localStorage>浏览器检测 的取语逻辑）
  lib/
    config.ts               站点配置（REPO_URL 等）
    utils.ts                cn()、分类圆点、日期格式化、等级徽标
    useInstallBanner.ts     PWA 安装横幅状态
    types.ts                Competition 类型
  data/
    competitions.ts         单一数据源（赛事清单，data-as-code）
    tiers.ts                含金量等级映射 TIER_MAP
    i18n/
      content.ts            赛事「内容」本地化层（回退链 + localizedName/Desc/Entry）
      en.ts … ms.ts         15 个语言文件，每文件 59 条 {name?, desc, entry}
  components/
    Header.tsx              品牌行（标题 / 右上正方形簇：GitHub 横条 + 语言 + 分享）
    CalendarControls.tsx    视图切换(年/月/周) + 今天/上/下（日期融入「今天」按钮）
    UpcomingPanel.tsx       本周/本月截止面板
    WatchlistPanel.tsx      待官宣(TBD)赛事看板
    MonthView / WeekView / YearView.tsx
    DaySheet.tsx            手机端日格底部弹层
    HoverBubble.tsx         桌面悬停预览气泡
    CompetitionCard.tsx     赛事卡片（标题截断 / 描述行数限制 / chip / 按钮）
    ThemeFab.tsx            右下角悬浮主题切换（DaySheet 打开时隐藏）
    InstallBanner.tsx       PWA 安装引导
    LanguageSwitcher.tsx / ShareButton.tsx
public/                     manifest / 图标 / apple-touch-icon
.github/workflows/          deploy.yml / check-updates.yml
scripts/                    check_updates.py + requirements.txt
```

**核心原则：数据即代码（data-as-code）。** 所有赛事写在 `src/data/competitions.ts`，无需任何后端改动。

---

## 3. 数据模型

```ts
export interface Competition {
  id: string          // url 友好的 slug，例如 'sony-world-photography-awards'
  name: string        // 英文名称（专有名词，非 CJK 语言直接用作显示名）
  nameZh: string      // 简体中文名称（zh-CN 的显示名 / 其他语言的回退源）
  deadline: string    // 截止日，ISO 格式 YYYY-MM-DD；未公布写作 'TBD'
  category: string    // Nature / Wildlife / Portrait / Street / Documentary / Landscape / Mobile / Underwater / Architecture / Open / Abstract / Travel
  region: string      // 通常 Global / International
  fee: string         // 'Free'（免费）或一个金额字符串，如 '$30' / '€25' / '£12'
  description: string // 1–2 句中文简介
  officialUrl: string // 比赛官网
  submitUrl: string   // 投稿 / 报名页面
  entryType: string   // 参赛资格，例如「专业人士与业余爱好者均可」
  tier?: 'elite' | 'major'       // 可选：含金量等级
  prestigeNote?: string          // 可选：为何有分量
  confidence?: 'high' | 'medium' | 'low'  // 可选：仅 TBD 赛事，标注预估可信度
}
```

等级由 `src/data/tiers.ts` 的 `TIER_MAP` 集中映射维护（`tier` 字段可覆盖）。**待官宣(TBD) 赛事附 `confidence` 字段**标注预估可信度；一旦官方公布真实日期，`confidence` 应被移除。

**更新比赛数据**：编辑 `src/data/competitions.ts`，按 `deadline` 升序排列，提交即触发重新部署，对应赛事从「待官宣」看板进入日历。

---

## 4. 国际化（i18n）—— 双层结构

本项目有 **16 种语言**：`en / zh-CN / zh-TW / ja / ko / es / fr / de / pt / ru / it / nl / th / vi / id / ms`。
`zh-CN` 是**源语言**（原始中文），其余 **15 种为机器翻译**，需母语者校对（见 `MANAGER.md` 开放事项）。

本地化分两层，二者都切换：

### 4.1 UI 外壳层（`src/i18n/`）
- `translations.ts`：`DICT` 按语言分块存放所有 UI 文案键；`LANGS`（含 `code/label/short`）、`DATE_LOCALE`（date-fns 各语言 Locale）、`detectLang()`。
- `index.tsx`：`I18nProvider` / `useT()`。取语优先级：**URL 路径段 > localStorage > 浏览器语言检测**。
  - URL 驱动子页：`/en`、`/zh-CN`、`/zh-TW` … 直接渲染对应语言，可分享、刷新不丢。
  - `pushState` 写入语言到 URL；`popstate` 监听浏览器前进/后退。
  - 同步 `<html lang>` 与浏览器标签页标题。
- GitHub Pages 无服务端路由：构建时 `vite.config.ts` 的 `copy404` 插件把 `index.html` 复制为 `404.html`，使任意未知路径都回退到 SPA 壳，再由前端按 URL 取语渲染。

### 4.2 赛事内容层（`src/data/i18n/`）
- `content.ts` 是关键：提供 `localizedName / localizedDesc / localizedEntry` 三个解析器，让**切换语言时连比赛卡片的内容也切换**，而非只剩外壳。
- 回退链（必须保持，新增语言时不要破坏）：
  - `localizedName`：具体语言有 `name` → 用；`zh-CN` → 用 `nameZh`；否则 → 英文品牌名 `name`。
  - `localizedDesc / localizedEntry`：具体语言 → 英文 `en` → 原始中文（`description` / `entryType`）。
- 每个语言文件（`en.ts`、`zhTW.ts` … `ms.ts`）是扁平 `Record<contestId, CompLocalized>`，**每条含 `desc`、`entry`；CJK 语言额外含 `name`**（非 CJK 用英文名作专有名词，符合国际惯例）。当前每个文件 **59 条**，与 `competitions.ts` 的 id 一一对应。
- `CompetitionCard` 通过 `useT().lang` 调用这三个解析器来渲染。

### 4.3 如何新增一种语言
1. `translations.ts`：在 `LANGS` 加一项；在 `DICT` 加该语言的全套 UI 文案块；在 `DATE_LOCALE` 加对应 date-fns Locale。
2. `src/data/i18n/<code>.ts`：新建文件，`Record<id, {name?, desc, entry}>`，**59 条**（CJK 加 `name`）。
3. `content.ts`：import 该文件并加入 `TABLES`。
4. `typecheck` 必须 0 错误（缺 id 会编译失败）。

---

## 5. 布局与防溢出约束（重要，勿破坏）

- **Grid 子项必须保留 `min-w-0`**（`WatchlistPanel`、`UpcomingPanel` 的 grid item）。原因：某语言若含超长不可断词，Grid 默认 `min-width:auto` 会把整列撑宽，导致**整页出现横向滚动**。卡片本身用 `overflow-hidden`，配合 `min-w-0` 才能正确裁切。
- 卡片标题用 `truncate`（溢出省略号）、描述用 `line-clamp-1/2`、`flex flex-wrap` 的 chip 行——这些都保证单一语言再长也不会撑破布局。
- **右上正方形簇**（`Header.tsx`）：顶部 GitHub 横条宽度 = 底部「语言 + 分享」两个等大按钮宽度之和，整体成正方形，无边框、融入背景。
- **悬浮主题按钮**（`ThemeFab.tsx`）：固定在右下角，含 iOS 安全区偏移；**DaySheet 打开时 `hidden`**，避免遮挡。
- **Footer 提示**：用「拆分 `{github}` 占位符 + 真实 `<a>` 链接」渲染，**禁止 `dangerouslySetInnerHTML`**。

---

## 6. 自动化与部署

### 自动核对（`scripts/check_updates.py` + `.github/workflows/check-updates.yml`）
- **每月 1 日 03:00 UTC**：轻量模式只查「待官宣(TBD)」条目，官方一公布新一届征稿日即自动回填为真实 `YYYY-MM-DD`，并移除 `confidence` 预估标记。
- **每年 1 月 2 日 02:00 UTC**：全量核对所有日期。
- 用 Playwright（失败回落 requests + BeautifulSoup）抓取官网、正则抽取截止日，原地更新 `competitions.ts`。
- 检测到变化 → 自动开 **PR 供人审阅**，**不自动合并**（正确性优先）。

### 部署（`deploy.yml`）
- 站点使用相对路径（`vite.config.ts` 中 `base: './'`），可直接挂在 `https://<用户>.github.io/<仓库>/`。
- **推送到 `main`** 即由 `deploy.yml` 自动 `npm ci` → `npm run build`（Node 22）→ 发布到 GitHub Pages。
- 仓库 **Settings → Pages → Source** 选择 **GitHub Actions**。

---

## 7. PWA 实现
- `public/manifest.webmanifest` + 图标（192 / 512 / apple-touch-icon）。
- `useInstallBanner` 监听 `beforeinstallprompt`：Android 支持一键安装，iOS 仅手动「添加到主屏幕」。
- 以独立窗口（standalone）运行时自动隐藏顶部安装横幅。

> 评估结论：无需上架应用商店。轻量 PWA + 主屏幕书签，是最高频动作「打开→看本周截止」的最优路径（零安装、零更新摩擦、天然契合无后端静态站）。

---

## 8. 设计系统（视觉与交互）

> 详见 `MANAGER.md` 的「需保留的设计逻辑」以及下方红点评审结论。

- **字体**：Inter（界面）+ Fraunces（西文展示标题，衬线画册气质）+ 思源宋体 / Source Han Serif（中文展示标题）。
- **胶片颗粒 + 暖调**：全站叠加极淡 `feTurbulence` 噪点（暗房/画册肌理），「暖纸/暖墨」底色替代冷 slate；四角轻微暗角。
- **克制的品牌橙 `#f97316`**：仅用于「今天 / 品牌标识 / 激活视图」，其余强调用中性墨与靛蓝。
- **分类去噪**：12 色彩虹仪表盘改为中性 chip + 低饱和圆点。
- **图标化**：emoji 全部换成 Lucide 线性图标，跨平台一致。
- **动画令牌**：全局缓动/时长集中在 `src/index.css` 的 CSS 变量；数字用 `tabular-nums` 对齐。

**交互统一原则**：桌面「悬停预览气泡」与触控「底部弹层(DaySheet)」是**同一意图的两种形态**——信息密度优先保证「一眼看见当天有几场」，再谈细节。语言切换等辅助控件须「小但可发现」（极小触发 + 明确反馈），不靠面积博存在感。

---

## 9. 红点评审结论（已落地的方向）
- 倒计时红点文字加深到 WCAG AA 对比度。
- 导航箭头触控区提到 40px；窄屏控制行允许安全横向滚动兜底，防 320px 溢出。
- 悬浮主题按钮加安全区偏移，不再遮挡页脚。
- 待评估的「艺术豪赌」项（**尚未实现**，等用户拍板）：自定义光标、真实摄影 hero/封面、视图间共享元素（shared-element）过渡、进一步强化胶片化/颗粒感。

---

## 10. 路线图 / 开放事项
- 15 种机器翻译语言需**母语者校对**（质量参差，已知状态）。
- 每种语言的「文字重叠/溢出」审计结果待用户逐项决策（缩减 or 后移/重构）。
- 红点评审的进一步美化建议待分类执行。
- `deploy.yml` 已用 Node 22；`check-updates.yml` 用 Python 3.12 + Playwright。
