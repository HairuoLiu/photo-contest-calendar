# 技术文档 · Tech Doc

面向贡献者 / 维护者。普通用户请看根目录 [`README.md`](../README.md)；设计思路见 [`DESIGN.md`](./DESIGN.md)。

## 技术栈
- Vite 5 + React 19 + TypeScript（strict 模式）
- Tailwind CSS 3（darkMode: `'class'`）
- Framer Motion 11（视图切换、悬停气泡、底部弹层动画）
- date-fns 3（日期计算）
- lucide-react（图标）
- 无后端、无数据库，纯静态站点，可直接挂 GitHub Pages。

## 架构与目录
```
src/
  App.tsx                 布局与全局状态（视图、悬停、日格弹层）
  main.tsx                入口
  index.css               全局样式 / 动画令牌 / 胶片颗粒 / 暖调变量
  lib/
    config.ts             站点配置
    utils.ts              分类圆点、日期格式化等工具
    useInstallBanner.ts   PWA 安装横幅状态
    types.ts              Competition 类型
  data/
    competitions.ts       单一数据源（赛事清单）
    tiers.ts              含金量等级映射 TIER_MAP
  components/
    Header.tsx            品牌行（标题 / GitHub / 主题切换）
    CalendarControls.tsx  视图切换 + 今天/上/下
    UpcomingPanel.tsx     本周/本月截止面板
    WatchlistPanel.tsx    待官宣赛事看板
    MonthView.tsx / WeekView.tsx / YearView.tsx
    DaySheet.tsx          手机端日格底部弹层
    HoverBubble.tsx       桌面悬停预览气泡
    CompetitionCard.tsx   赛事卡片
    InstallBanner.tsx     PWA 安装引导
public/                   manifest / 图标 / apple-touch-icon
.github/workflows/         deploy.yml / check-updates.yml
scripts/                   check_updates.py
```

数据即代码（data-as-code）：所有赛事写在 `src/data/competitions.ts`，无需任何后端改动。

## 数据模型
```ts
export interface Competition {
  id: string          // url 友好的 slug，例如 'sony-world-photography-awards'
  name: string        // 英文名称
  nameZh: string      // 中文名称
  deadline: string    // 截止日，ISO 格式 YYYY-MM-DD；未公布写作 'TBD'
  category: string    // Nature / Wildlife / Portrait / Street / Documentary / Landscape / Mobile / Underwater / Architecture / Open / Abstract / Travel
  region: string      // 通常 Global / International
  fee: string        // 'Free'（免费）或一个金额字符串，如 '$30' / '€25' / '£12'
  description: string // 1–2 句中文简介（从官网翻译 / 摘录）
  officialUrl: string // 比赛官网
  submitUrl: string   // 投稿 / 报名页面（可等同于官网）
  entryType: string   // 参赛资格，例如「专业人士与业余爱好者均可」
  tier?: 'elite' | 'major'       // 可选：含金量等级（也可由 TIER_MAP 统一映射）
  prestigeNote?: string          // 可选：为何有分量的一句说明
  confidence?: 'high' | 'medium' | 'low'  // 可选：仅 TBD 赛事用，标注预估可信度
}
```
等级由 `src/data/tiers.ts` 的 `TIER_MAP` 集中映射维护（`tier` 字段也可覆盖）。待官宣（TBD）赛事附 `confidence` 字段标注预估可信度（高 / 中 / 低）。

## 如何更新比赛数据
编辑 `src/data/competitions.ts`，按 `deadline` 升序排列，提交 PR 即可。合并后站点自动重新部署，对应赛事即从「待官宣」看板消失、进入日历。

## 自动化更新（每月回填 + 每年核对）
仓库内置一套自动核对机制，保证截止日尽量及时、准确：
- `scripts/check_updates.py`：用 Playwright（失败则回退 requests + BeautifulSoup）抓取官网，正则抽取最新一届的截止日，原地更新 `competitions.ts` 的 `deadline` 字段。
- `.github/workflows/check-updates.yml`：
  - **每月 1 日 03:00 UTC**：轻量只查「待官宣（TBD）」条目，官方一公布新一届征稿日即自动回填为真实日期，并移除 `confidence` 预估标记。
  - **每年 1 月 2 日**：全量核对所有日期。
  - 也支持在 Actions 页面**手动触发**（可选 full / tbd-only 模式）。
- 检测到变化 → 自动开 **PR 供人审阅**——**不会自动合并**，正确优先。

## 本地运行
```bash
npm install
npm run dev        # 本地开发，默认 http://localhost:5173
npm run build      # 产物输出到 dist/
npm run preview    # 预览构建产物
npm run typecheck  # tsc --noEmit
```

## 部署（GitHub Pages 子页面）
- 站点使用相对路径（`vite.config.ts` 中 `base: './'`），因此可以直接挂在 `https://<用户名>.github.io/<仓库名>/` 下，无需额外配置。
- 推送到 `main` 即由 `.github/workflows/deploy.yml` 自动构建并发布（仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**）。

## PWA 实现
- `public/manifest.webmanifest` + 图标（192 / 512 / apple-touch-icon）。
- `useInstallBanner` 监听 `beforeinstallprompt`：Android 支持一键安装，iOS 仅手动「添加到主屏幕」（见 README）。
- 以独立窗口（standalone）运行时自动隐藏顶部安装横幅。

## 是否封装成真正的 App（评估）
**结论：没必要上架应用商店。轻量 PWA + 主屏幕书签，就是目前最省事、对用户最方便的路径。**

| 维度 | 上架 App Store / Google Play | 轻量 PWA + 书签 |
| --- | --- | --- |
| 开发 / 维护成本 | 高（审核、签名、版本、商店账号） | 极低（已是静态站，加几个文件即可） |
| 用户获取门槛 | 需搜索 / 扫码进商店下载安装 | 打开网页 → 一键 / 几步存到主屏 |
| 更新方式 | 每次发版都要过审 | 推一次代码即生效，用户无感 |
| 离线 / 全屏体验 | 原生 | PWA 已支持（manifest + 缓存） |
| 多端适配 | 各平台各自适配 | 同一套响应式网页 |

**原则：越方便越好。** 这个工具最高频的动作就是「打开 → 看本周有哪些比赛截止」。PWA 书签零安装、零更新摩擦，而本站点本来就是无后端静态页，天然契合。

## 路线图
- **多语言（i18n）**：计划以最小化方案接入——UI 文案走字典 + React Context，赛事名称作为专有名词保留原文；触发控件做最小化（见 `DESIGN.md`）。
- **设计「艺术豪赌」项**：自定义光标、真实摄影 hero / 封面、视图间共享元素（shared-element）过渡，待评估。
- **CI 小修**：`deploy.yml` 的 `node-version: 20` 已弃用告警，建议升到 22。
