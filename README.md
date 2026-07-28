# 📸 Photo Contest Calendar · 全球摄影赛事日历

一个**开源、无后端、免登录**的摄影比赛截止提醒工具。用年 / 月 / 日三种视图，把全球知名摄影比赛的投稿截止日直观地呈现出来，并像「闪卡」一样提示本周 / 本月有哪些投稿即将截止。

> 目的：让所有喜欢摄影的人把这个站点 / 仓库当成**摄影比赛的提醒工具**——无论你是从官网进来，还是直接在 GitHub 上翻看这份清单。

线上地址（GitHub Pages 子页面）：`https://hairuoliu.github.io/photo-contest-calendar/`

---

## ✨ 特性

- **三种视图**：年视图（12 个迷你月历，带截止日圆点）、月视图（完整日历 + 截止日标签 + 切换动画 + 悬停预览气泡）、周视图（本周投稿截止一览，点日期即进入）。
- **流畅动画**：视图切换、月份滑动、闪卡入场均使用 [Framer Motion](https://www.framer.com/motion/) 过渡；卡片、按钮带有细腻的按压反馈。
- **闪卡式截止提醒**：右侧常驻「本周截止 / 本月截止」面板，点一下即跳到对应日期。
- **深浅色主题**：内置 light / dark，偏好记忆在 `localStorage`。
- **移动端优先**：mobile-first 响应式，手机 / 平板 / 桌面都好用。
- **零后端**：所有数据就在仓库本地文件里，无需数据库、无需登录。
- **一键部署**：通过 GitHub Pages 自动部署（见下文）。

## 📋 收录的摄影比赛与活动

下面是从 `src/data/competitions.ts` 直接生成的清单，**共 30 场**，覆盖 2026-01 至 2027-05。按截止日排序，方便检索。部分 2026 年赛事的截稿日已经过期——网站会自动用灰 / 红标记「已截止」，而清单本身保留完整历史，便于回溯。所有日期均尽力以官方公布为准。

> 说明：标「免费」指投稿本身免费；标「付费」指需缴纳报名费。链接指向各赛事官网。

### 2026 年（共 27 场）

| 比赛 | 英文名 | 截止日 | 类别 | 地区 | 费用 | 官网 |
| --- | --- | --- | --- | --- | --- | --- |
| 2026 索尼世界摄影大赛 | Sony World Photography Awards 2026 | 2026-01-06 | Open | Global | 免费 | [链接](https://www.worldphoto.org/sony-world-photography-awards) |
| 2026 锡耶纳国际摄影奖 | Siena International Photo Awards 2026 | 2026-01-16 | Open | Global | 免费 | [链接](https://sienawards.com) |
| 2026 世界新闻摄影比赛 | World Press Photo Contest 2026 | 2026-01-17 | Documentary | Global | 免费 | [链接](https://www.worldpressphoto.org/contest/2026) |
| 2026 All About Photo 摄影奖 | All About Photo Awards 2026 | 2026-01-27 | Open | Global | 付费 | [链接](https://www.all-about-photo.com/) |
| 2026 艺术摄影奖 | Fine Art Photography Awards (FAPA) 2026 | 2026-02-15 | Abstract | Global | 付费 | [链接](https://fineartphotoawards.com/) |
| 2026 LensCulture 肖像摄影奖 | LensCulture Portrait Awards 2026 | 2026-02-24 | Portrait | Global | 免费 | [链接](https://www.lensculture.com/photo-competitions/portrait-awards) |
| 2026 BigPicture 自然世界摄影大赛 | BigPicture Natural World Photography Competition 2026 | 2026-03-01 | Nature | Global | 付费 | [链接](https://www.bigpicturecompetition.org/) |
| 2026 奥杜邦鸟类摄影奖 | Audubon Photography Awards 2026 | 2026-03-04 | Wildlife | Global | 付费 | [链接](https://www.audubon.org/photography/awards) |
| 2026 iPhone 摄影奖 | iPhone Photography Awards 2026 | 2026-03-31 | Mobile | Global | 付费 | [链接](https://www.ippawards.com) |
| 2026 泰勒·韦森肖像摄影奖 | Taylor Wessing Photo Portrait Prize 2026 | 2026-04-21 | Portrait | Global | 付费 | [链接](https://www.npg.org.uk/whatson/exhibitions/2026/taylor-wessing-photo-portrait-prize-2026) |
| 2026 LensCulture 评论家之选 | LensCulture Critics’ Choice 2026 | 2026-04-22 | Open | Global | 免费 | [链接](https://www.lensculture.com/photo-competitions/critics-choice) |
| 2026 尼康微观世界摄影大赛 | Nikon Small World 2026 | 2026-04-30 | Nature | Global | 免费 | [链接](https://www.nikonsmallworld.com/) |
| 2026 MonoVisions 黑白摄影奖 | MonoVisions Photography Awards 2026 | 2026-05-17 | Abstract | Global | 付费 | [链接](https://monovisionsawards.com/) |
| 2026 哈姆丹国际摄影奖 | HIPA 15th Season (Family) 2026 | 2026-05-31 | Open | Global | 免费 | [链接](https://www.hipa.ae) |
| 2026 英国野生动物摄影奖 | British Wildlife Photography Awards 2026 | 2026-06-07 | Wildlife | Global | 付费 | [链接](http://bwpawards.org) |
| 2026 LensCulture 街头摄影奖 | LensCulture Street Photography Awards 2026 | 2026-06-17 | Street | Global | 免费 | [链接](https://www.lensculture.com/photo-competitions/street-photography-awards) |
| 2026 世界自然摄影奖 | World Nature Photography Awards 2026 | 2026-06-30 | Nature | Global | 付费 | [链接](https://www.worldnaturephotographyawards.com/) |
| 2026 搞笑野生动物摄影奖 | Nikon Comedy Wildlife Photography Awards 2026 | 2026-06-30 | Wildlife | Global | 免费 | [链接](https://www.comedywildlifephoto.com/) |
| 2026 国际摄影奖 | International Photography Awards (IPA) 2026 | 2026-06-30 | Open | Global | 付费 | [链接](https://www.photoawards.com) |
| 2026 特写摄影师大赛 | Close-up Photographer of the Year 2026 | 2026-07-12 | Nature | Global | 付费 | [链接](https://www.cupoty.com/) |
| 2026 巴黎摄影奖 | Prix de la Photographie Paris (Px3) 2026 | 2026-07-22 | Open | Global | 付费 | [链接](https://px3.fr/) |
| 2026 中性密度摄影奖 | ND Awards 2026 | 2026-09-20 | Open | Global | 付费 | [链接](https://www.ndawards.net/) |
| 2026 年度旅行摄影师大赛 | Travel Photographer of the Year 2026 | 2026-10-12 | Travel | Global | 付费 | [链接](https://www.tpoty.com/tpoty-2026-awards/) |
| 2026 单色摄影奖 | Monochrome Awards 2026 | 2026-11-15 | Abstract | Global | 付费 | [链接](https://monoawards.com/) |
| 2026 史密森尼摄影大赛 | Smithsonian Magazine Photo Contest 2026 | 2026-12-01 | Open | Global | 免费 | [链接](https://photocontest.smithsonianmag.com/photocontest/) |
| 2026 年度野生动物摄影师大赛 | Wildlife Photographer of the Year 2026 | 2026-12-04 | Wildlife | Global | 付费 | [链接](https://www.nhm.ac.uk/wpy) |
| 2026 海洋艺术水下摄影大赛 | Ocean Art Underwater Photo Contest 2026–2027 | 2026-12-12 | Underwater | Global | 付费 | [链接](https://www.uwphotographyguide.com/ocean-art-competition) |

### 2027 年（共 3 场）

| 比赛 | 英文名 | 截止日 | 类别 | 地区 | 费用 | 官网 |
| --- | --- | --- | --- | --- | --- | --- |
| 2027 索尼世界摄影大赛 | Sony World Photography Awards 2027 | 2027-01-05 | Open | Global | 免费 | [链接](https://www.worldphoto.org/sony-world-photography-awards) |
| 2026 35Awards 国际摄影奖 | 35Awards 2026 (100 Best Photos of 2026) | 2027-02-25 | Open | Global | 免费 | [链接](https://35awards.com) |
| 2026 CEWE 摄影奖 | CEWE Photo Award 2026–2027 | 2027-05-31 | Open | Global | 免费 | [链接](https://www.cewe.com/fotowettbewerbe.html) |

---

## 🛠 如何更新比赛数据

所有比赛数据都保存在 **`src/data/competitions.ts`** 这一个文件里。要更新明年的日历，只需编辑这个文件，然后重新构建 / 推送即可——**不需要任何后端改动**。

```ts
export interface Competition {
  id: string          // url 友好的 slug，例如 'sony-world-photography-awards'
  name: string        // 英文名称
  nameZh: string      // 中文名称
  deadline: string    // 截止日，ISO 格式 YYYY-MM-DD
  category: string    // Nature / Wildlife / Portrait / Street / Documentary / Landscape / Mobile / Underwater / Architecture / Open / Abstract / Travel
  region: string      // 通常 Global / International
  fee: string        // 'Free'（免费）或一个金额字符串，如 '$30' / '€25' / '£12'
  description: string // 1–2 句中文简介（从官网翻译 / 摘录）
  officialUrl: string // 比赛官网
  submitUrl: string   // 投稿 / 报名页面（可等同于官网）
  entryType: string   // 参赛资格，例如「专业人士与业余爱好者均可」
}

export const competitions: Competition[] = [ /* 按 deadline 升序排列 */ ]
```

提交 PR 即可为社区补充比赛。数据越全，这个提醒工具越有用 💡

## 🤖 自动化更新（每年核对）

仓库内置一个**每年自动核对**的机制，保证截止日尽量及时、准确：

- `scripts/check_updates.py`：用 Playwright（失败则回退 requests + BeautifulSoup）抓取各赛事官网，正则抽取最新截止日，原地更新 `competitions.ts` 的 `deadline` 字段，并输出 `scripts/report.md` 说明改动。
- `.github/workflows/check-updates.yml`：每年 1 月 2 日（及手动触发）运行一次，跑完由 `peter-evans/create-pull-request` 开一个 PR 供人审阅——**不会自动合并**，正确优先。

## 🚀 本地运行

```bash
npm install
npm run dev        # 本地开发，默认 http://localhost:5173
npm run build      # 产物输出到 dist/
npm run preview    # 预览构建产物
```

## 🌐 部署到 GitHub Pages（子页面）

本仓库即一个独立的 GitHub Pages 项目站点，线上地址为：

```
https://hairuoliu.github.io/photo-contest-calendar/
```

它就是你 GitHub Pages 域名下的一个**子页面**。因为站点完全是静态的、没有后端，部署只需：

1. 把代码推到 `main` 分支（`.github/workflows/deploy.yml` 会在 push 时自动构建）。
2. 在仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。
3. 每次 push 到 `main` 会自动构建并发布。

站点使用相对路径（`vite.config.ts` 中 `base: './'`），因此可以直接挂在 `https://<用户名>.github.io/<仓库名>/` 下，无需额外配置。

## 📱 在手机上当作 App 使用（添加到主屏幕）

本站点是一个**轻量 PWA（渐进式 Web 应用）**：无需去应用商店下载，把它「存到主屏幕」后，就能像原生 App 一样全屏打开、带图标、有缓存，直达今天 / 本周的比赛。站点顶部也会对手机访客弹出引导横幅。

### iPhone / iPad（Safari）
1. 打开 `https://hairuoliu.github.io/photo-contest-calendar/`。
2. 点底部工具栏的 **分享按钮**（⬆️ 方框箭头图标）。
3. 在弹出的菜单里向上滑，找到并点 **「添加到主屏幕」**。
4. 可改名（默认「摄影赛事日历」），点 **添加**。
5. 主屏上就多了一个图标，点它即全屏打开，和 App 没两样。

### Android（Chrome / Edge）
- **一键安装**：打开页面后，若浏览器底部弹出「安装应用」提示，直接点 **安装**；或点地址栏右侧的 **⋮ → 安装应用 / 添加到主屏幕**。
- 之后主屏幕出现图标，点开即是全屏的「App」。

> 一旦以「已安装」模式运行（独立窗口），站点会自动识别，顶部引导横幅也不再出现。

## 💡 是否需要封装成真正的 App？（评估）

**结论：没必要上架应用商店。轻量 PWA + 主屏幕书签，就是目前最省事、对用户最方便的路径。**

| 维度 | 上架 App Store / Google Play | 轻量 PWA + 书签 |
| --- | --- | --- |
| 开发 / 维护成本 | 高（审核、签名、版本、商店账号） | 极低（已是静态站，加几个文件即可） |
| 用户获取门槛 | 需搜索 / 扫码进商店下载安装 | 打开网页 → 一键 / 几步存到主屏 |
| 更新方式 | 每次发版都要过审 | 推一次代码即生效，用户无感 |
| 离线 / 全屏体验 | 原生 | PWA 已支持（manifest + 缓存） |
| 多端适配 | 各平台各自适配 | 同一套响应式网页 |

**原则：越方便越好。** 这个工具最高频的动作就是「打开 → 看本周有哪些比赛截止」。PWA 书签零安装、零更新摩擦，而本站点本来就是无后端静态页，天然契合。若以后想加**投稿提醒推送**（如「本周 X 场即将截止」），可在 PWA 基础上加 Web Push，依然无需商店上架。

**所以**：把精力放在「让访客一眼就会存到主屏」上（站点已内置顶部横幅引导），而不是去折腾应用商店。

## 📄 许可证

以 [MIT](./LICENSE) 协议开源。
