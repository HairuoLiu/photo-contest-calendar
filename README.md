# 📸 Photo Contest Calendar · 全球摄影赛事日历

一个**开源、无后端、免登录**的摄影比赛截止提醒工具。用年 / 月 / 周三种视图，把全球知名摄影比赛的投稿截止日直观地呈现出来，并像「闪卡」一样提示本周 / 本月有哪些投稿即将截止。

> 目的：让所有喜欢摄影的人把这个站点 / 仓库当成**摄影比赛的提醒工具**——无论你是从官网进来，还是直接在 GitHub 上翻看这份清单。

线上地址（GitHub Pages 子页面）：`https://hairuoliu.github.io/photo-contest-calendar/`

---

## ✨ 特性

- **三种视图**：年视图（12 个迷你月历，带截止日圆点）、月视图（完整日历 + 截止日圆点 + 切换动画 + 桌面悬停预览气泡）、周视图（本周投稿截止一览）。视图切换与「今天 / 上 / 下」导航**紧贴在日历上方**，不再和「本周 / 本月截止」面板混在一起。
- **本周 / 本月截止面板**：首屏最顶端常驻，点一下即跳到对应周视图，一眼看清近期要截稿的比赛。
- **手机端日格底部弹层**：在月视图点任意一天，会从底部滑出抽屉（bottom sheet），就地列出那天的赛事，**无需离开月历上下文**；支持遮罩点击关闭、下滑关闭、安全区适配。这是桌面悬停气泡在触控端的等价交互。
- **桌面悬停预览气泡**：鼠标移到某天，浮动气泡跟随展示当天赛事，并就地高亮该日格。
- **含金量等级体系**：殿堂级（★，如哈苏大师赛、POYi、年度天文/水下摄影）/ 重要级（◉）由 `src/data/tiers.ts` 集中维护，卡片显示等级徽章 + 预估可信度标签。
- **待官宣赛事看板**：官方截稿日尚未公布的赛事统一收在日历下方，明确标注「官方截稿日尚未公布」，绝不在首屏抢占视线。
- **流畅动画**：视图切换、月份滑动、卡片入场均使用 [Framer Motion](https://www.framer.com/motion/) 过渡；按钮带按压反馈；全局动画时长 / 缓动由 CSS 变量统一管控。
- **深浅色主题**：内置 light / dark，偏好记忆在 `localStorage`。
- **移动端优先**：mobile-first 响应式，手机 / 平板 / 桌面都好用。
- **零后端**：所有数据就在仓库本地文件里，无需数据库、无需登录。
- **轻量 PWA**：可「添加到主屏幕」当 App 用，站点顶部对手机访客弹出引导横幅。
- **一键部署**：通过 GitHub Pages 自动部署（见下文）。

## 📋 收录的摄影比赛与活动

下面是从 `src/data/competitions.ts` 直接生成的清单，**共 59 场**（其中 43 场已有明确截稿日、16 场待官宣）。按截止日排序，方便检索。部分 2026 年赛事的截稿日已经过期——网站会自动用灰 / 红标记「已截止」，而清单本身保留完整历史，便于回溯。所有日期均尽力以官方公布为准。

> 说明：标「免费」指投稿本身免费；标金额指需缴纳报名费。等级一栏：★ 殿堂级 / ◉ 重要级（留空为普通赛事）。链接指向各赛事官网。

| 比赛 | 英文名 | 截止日 | 类别 | 地区 | 费用 | 等级 | 官网 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2026 Aesthetica 艺术奖 | Aesthetica Art Prize 2026 | 2026-10-31 | Abstract | UK | £18 |  | [链接](https://aestheticamagazine.com/) |
| 2026 All About Photo 摄影奖 | All About Photo Awards 2026 | 2026-01-27 | Open | Global | $30 |  | [链接](https://www.all-about-photo.com/) |
| 2026 Aperture 画册奖 | Aperture Portfolio Prize 2026 | 2026-12-15 | Open | USA | $25 |  | [链接](https://aperture.org/) |
| 2026 BigPicture 自然世界摄影大赛 | BigPicture Natural World Photography Competition 2026 | 2026-03-01 | Nature | Global | $25 |  | [链接](https://www.bigpicturecompetition.org/) |
| 2026 Der Greif 摄影杂志公开征集 | Der Greif Open Call 2026 | 2026-09-30 | Open | Germany | 免费 |  | [链接](https://www.dergreif.org/) |
| 2026 Fisheye 摄影杂志公开征集 | Fisheye Magazine Open Call 2026 | 2026-10-15 | Open | France | €15 |  | [链接](https://www.fisheyemagazine.fr/) |
| 2026 Foam 新锐摄影展 | Foam Talent 2026 | 2026-09-01 | Open | Netherlands | 免费 |  | [链接](https://www.foam.org/) |
| 2026 LensCulture 肖像摄影奖 | LensCulture Portrait Awards 2026 | 2026-02-24 | Portrait | Global | 免费 |  | [链接](https://www.lensculture.com/photo-competitions/portrait-awards) |
| 2026 LensCulture 街头摄影奖 | LensCulture Street Photography Awards 2026 | 2026-06-17 | Street | Global | 免费 |  | [链接](https://www.lensculture.com/photo-competitions/street-photography-awards) |
| 2026 LensCulture 评论家之选 | LensCulture Critics’ Choice 2026 | 2026-04-22 | Open | Global | 免费 |  | [链接](https://www.lensculture.com/photo-competitions/critics-choice) |
| 2026 MonoVisions 黑白摄影奖 | MonoVisions Photography Awards 2026 | 2026-05-17 | Abstract | Global | $20 |  | [链接](https://monovisionsawards.com/) |
| 2026 iPhone 摄影奖 | iPhone Photography Awards 2026 | 2026-03-31 | Mobile | Global | $25 |  | [链接](https://www.ippawards.com) |
| 2026 世界新闻摄影比赛 | World Press Photo Contest 2026 | 2026-01-17 | Documentary | Global | 免费 |  | [链接](https://www.worldpressphoto.org/contest/2026) |
| 2026 世界自然摄影奖 | World Nature Photography Awards 2026 | 2026-06-30 | Nature | Global | $30 |  | [链接](https://www.worldnaturephotographyawards.com/) |
| 2026 中性密度摄影奖 | ND Awards 2026 | 2026-09-20 | Open | Global | $20 |  | [链接](https://www.ndawards.net/) |
| 2026 佳能国际摄影大赛 | Canon Photo Contest 2026 | 2026-09-30 | Open | Japan | 免费 |  | [链接](https://global.canon/en/photocontest/) |
| 2026 单色摄影奖 | Monochrome Awards 2026 | 2026-11-15 | Abstract | Global | $25 |  | [链接](https://monoawards.com/) |
| 2026 史密森尼摄影大赛 | Smithsonian Magazine Photo Contest 2026 | 2026-12-01 | Open | Global | 免费 |  | [链接](https://photocontest.smithsonianmag.com/photocontest/) |
| 2026 哈姆丹国际摄影奖 | HIPA 15th Season (Family) 2026 | 2026-05-31 | Open | Global | 免费 |  | [链接](https://www.hipa.ae) |
| 2026 国际摄影奖 | International Photography Awards (IPA) 2026 | 2026-06-30 | Open | Global | $35 |  | [链接](https://www.photoawards.com) |
| 2026 奥杜邦鸟类摄影奖 | Audubon Photography Awards 2026 | 2026-03-04 | Wildlife | Global | $15 |  | [链接](https://www.audubon.org/photography/awards) |
| 2026 富士 X 系列摄影大赛 | FUJIFILM X Series Photo Contest 2026 | 2026-11-30 | Open | Japan | 免费 |  | [链接](https://fujifilm-x.com/) |
| 2026 尼康微观世界摄影大赛 | Nikon Small World 2026 | 2026-04-30 | Nature | Global | 免费 |  | [链接](https://www.nikonsmallworld.com/) |
| 2026 巴黎摄影奖 | Prix de la Photographie Paris (Px3) 2026 | 2026-07-22 | Open | Global | €30 |  | [链接](https://px3.fr/) |
| 2026 年度旅行摄影师大赛 | Travel Photographer of the Year 2026 | 2026-10-12 | Travel | Global | £10 |  | [链接](https://www.tpoty.com/tpoty-2026-awards/) |
| 2026 年度野生动物摄影师大赛 | Wildlife Photographer of the Year 2026 | 2026-12-04 | Wildlife | Global | £5 |  | [链接](https://www.nhm.ac.uk/wpy) |
| 2026 搞笑野生动物摄影奖 | Nikon Comedy Wildlife Photography Awards 2026 | 2026-06-30 | Wildlife | Global | 免费 |  | [链接](https://www.comedywildlifephoto.com/) |
| 2026 泰勒·韦森肖像摄影奖 | Taylor Wessing Photo Portrait Prize 2026 | 2026-04-21 | Portrait | Global | £12 |  | [链接](https://www.npg.org.uk/whatson/exhibitions/2026/taylor-wessing-photo-portrait-prize-2026) |
| 2026 海洋艺术水下摄影大赛 | Ocean Art Underwater Photo Contest 2026–2027 | 2026-12-12 | Underwater | Global | $15 |  | [链接](https://www.uwphotographyguide.com/ocean-art-competition) |
| 2026 特写摄影师大赛 | Close-up Photographer of the Year 2026 | 2026-07-12 | Nature | Global | £9 |  | [链接](https://www.cupoty.com/) |
| 2026 皮克泰摄影奖 | Prix Pictet 2026 | 2026-11-15 | Documentary | Switzerland | 免费 |  | [链接](https://www.prixpictet.com/) |
| 2026 索尼世界摄影大赛 | Sony World Photography Awards 2026 | 2026-01-06 | Open | Global | 免费 |  | [链接](https://www.worldphoto.org/sony-world-photography-awards) |
| 2026 艺术摄影奖 | Fine Art Photography Awards (FAPA) 2026 | 2026-02-15 | Abstract | Global | $18 |  | [链接](https://fineartphotoawards.com/) |
| 2026 英国野生动物摄影奖 | British Wildlife Photography Awards 2026 | 2026-06-07 | Wildlife | Global | £10 |  | [链接](http://bwpawards.org) |
| 2026 锡耶纳国际摄影奖 | Siena International Photo Awards 2026 | 2026-01-16 | Open | Global | 免费 |  | [链接](https://sienawards.com) |
| 2026《英国摄影杂志》肖像之英国 | BJP Portrait of Britain 2026 | 2026-09-30 | Portrait | UK | £10 |  | [链接](https://www.1854.photography/) |
| 索尼 α Café 月度挑战赛 | Sony α Café Monthly Challenge | 2026-08-31 | Open | Japan | 免费 |  | [链接](https://alphauniverse.com/) |
| 英国摄影奖 | British Photography Awards | 2026-08-16 | Open | UK | £5/幅 | ◉重要级 | [链接](http://www.britishphotographyawards.org/) |
| 2026 35Awards 国际摄影奖 | 35Awards 2026 (100 Best Photos of 2026) | 2027-02-25 | Open | Global | 免费 |  | [链接](https://35awards.com) |
| 2026 CEWE 摄影奖 | CEWE Photo Award 2026–2027 | 2027-05-31 | Open | Global | 免费 |  | [链接](https://www.cewe.com/fotowettbewerbe.html) |
| 2026–2027 尼康国际摄影大赛 | Nikon Photo Contest 2026–2027 | 2027-01-31 | Open | Japan | 免费 |  | [链接](https://www.nikon-photocontest.com/) |
| 2027 徕卡奥斯卡·巴纳克摄影奖 | Leica Oskar Barnack Award 2027 | 2027-03-15 | Documentary | Germany | 免费 |  | [链接](https://www.leica-oskar-barnack-award.com/) |
| 2027 索尼世界摄影大赛 | Sony World Photography Awards 2027 | 2027-01-05 | Open | Global | 免费 |  | [链接](https://www.worldphoto.org/sony-world-photography-awards) |
| B&W 儿童黑白摄影大赛 | B&W Child Photo Competition | 待官宣 | Portrait | Global | 约 €10 起 | ◉重要级 | [链接](https://blackandwhite.childphotocompetition.com/) |
| Communication Arts 摄影年赛 | Communication Arts Photography Competition | 待官宣 | Open | USA | $40 起 | ◉重要级 | [链接](https://www.commarts.com/competition/photography) |
| GDT 欧洲野生动物摄影师大赛 | GDT European Wildlife Photographer of the Year | 待官宣 | Wildlife | Europe | €35（青年免费） | ◉重要级 | [链接](https://www.gdtfoto.de/seiten/european-wildlife-photographer-of-the-year-competition.html) |
| Nature TTL 年度自然摄影师大赛 | Nature TTL Photographer of the Year | 待官宣 | Nature | Global | £10 起 | ◉重要级 | [链接](https://www.naturettl.com/poty) |
| URBAN 城市摄影奖 | URBAN Photo Awards | 待官宣 | Street | Italy | Free（首张免费，系列 €40） | ◉重要级 | [链接](https://www.urbanphotoawards.com/) |
| 世界美食摄影奖（原 Pink Lady 年度美食摄影师） | World Food Photography Awards (formerly Pink Lady Food Photographer of the Year) | 待官宣 | Open | UK | £35（青少年免费） | ◉重要级 | [链接](https://www.worldfoodphotographyawards.com/) |
| 人性肖像奖 | Portrait of Humanity | 待官宣 | Portrait | Global | $15 起 | ◉重要级 | [链接](https://www.1854.photography/awards/) |
| 哈苏大师赛 | Hasselblad Masters | 待官宣 | Open | Global | 免费 | ★殿堂级 | [链接](https://www.hasselblad.com/inspiration/masters/) |
| 国际年度图片奖（POYi） | Pictures of the Year International (POYi) | 待官宣 | Documentary | Global | $50–$60 | ★殿堂级 | [链接](https://www.poy.org) |
| 国际年度风景摄影师大赛 | International Landscape Photographer of the Year | 待官宣 | Landscape | Global | $25（每第 5 张免费） | ◉重要级 | [链接](https://www.internationallandscapephotographer.com/) |
| 安德烈·斯捷宁国际新闻摄影大赛 | Andrei Stenin International Press Photo Contest | 待官宣 | Documentary | Russia | 免费 | ◉重要级 | [链接](https://stenincontest.com/) |
| 年度天文摄影师大赛 | Astronomy Photographer of the Year | 待官宣 | Open | UK | £10（青少年免费） | ★殿堂级 | [链接](https://www.rmg.co.uk/whats-on/astronomy-photographer-year/competition) |
| 年度水下摄影师大赛（UPY） | Underwater Photographer of the Year (UPY) | 待官宣 | Underwater | UK | £20–£45（部分类别免费） | ★殿堂级 | [链接](https://underwaterphotographeroftheyear.com/) |
| 年度自然摄影师大赛（NPOTY，荷兰 Nature Talks） | Nature Photographer of the Year (NPOTY) | 待官宣 | Nature | Global | €35（作品集 €17.50，青年免费） | ◉重要级 | [链接](https://www.naturephotography.com/) |
| 玛格南摄影奖 | Magnum Photography Awards | 待官宣 | Open | Global | 按组别收费（约 $40 起） | ◉重要级 | [链接](https://www.lensculture.com/magnum-photography-awards) |
| 英国皇家摄影学会国际摄影展（IPE） | RPS International Photography Exhibition | 待官宣 | Open | UK | Free（首张免费，额外 £20–£35） | ★殿堂级 | [链接](https://rps.org/) |

---

## 🏆 含金量等级（殿堂级 / 重要级）

摄影圈内公认最有分量的赛事被标注了等级，方便你优先规划投稿：

- **★ 殿堂级（elite）**：哈苏大师赛、POYi（年度新闻/体育摄影）、年度水下摄影、年度天文摄影、RPS 国际摄影展等——行业标杆，获奖即履历背书。
- **◉ 重要级（major）**：Andrei Stenin、GDT 欧洲野生动物、Magnum 摄影奖、世界食物摄影、国际风景摄影、Nature TTL、Urban Photo Awards、英国摄影奖、Communication Arts、Portrait of Humanity、NPOTY、B&W Child 等。

等级由 `src/data/tiers.ts` 的 `TIER_MAP` 集中映射维护（`Competition` 本身也可带 `tier` 字段覆盖）。待官宣（TBD）赛事附 `confidence` 字段标注预估可信度（高 / 中 / 低）。

## 🛠 如何更新比赛数据

所有比赛数据都保存在 **`src/data/competitions.ts`** 这一个文件里。要更新明年的日历，只需编辑这个文件，然后重新构建 / 推送即可——**不需要任何后端改动**。

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

export const competitions: Competition[] = [ /* 按 deadline 升序排列 */ ]
```

提交 PR 即可为社区补充比赛。数据越全，这个提醒工具越有用 💡

## 🤖 自动化更新（每月回填 + 每年核对）

仓库内置一套**自动核对**机制，保证截止日尽量及时、准确：

- `scripts/check_updates.py`：用 Playwright（失败则回退 requests + BeautifulSoup）抓取各赛事官网，正则抽取最新一届的截止日，原地更新 `competitions.ts` 的 `deadline` 字段。
- `.github/workflows/check-updates.yml`：
  - **每月 1 日 03:00 UTC**：轻量只查「待官宣（TBD）」条目，官方一公布新一届征稿日即自动回填为真实日期，并移除 `confidence` 预估标记。
  - **每年 1 月 2 日**：全量核对所有日期。
  - 也支持在 Actions 页面**手动触发**（可选 full / tbd-only 模式）。
- 检测到变化 → 自动开 **PR 供人审阅**——**不会自动合并**，正确优先。合并后站点自动重新部署，对应赛事即从「待官宣」看板消失、进入日历。

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

## 📲 手机端交互：日格底部弹层

桌面端用「悬停预览气泡」一目了然地看某天赛事；但在手机上没有悬停。为此我们为月视图的每一天加了**底部弹层（bottom sheet）**：

- 在月视图**点任意一天** → 从屏幕底部滑出抽屉，就地列出当天所有截稿赛事（复用赛事卡片），背景变暗、可点击遮罩或**下滑**关闭。
- 这样你**无需离开月历**就能看到内容，解决了「只能看到小圆点、点进去才看得到、且会跳走」的痛点。
- 弹层带 `安全区（safe-area）`适配，关闭按钮与卡片操作区都满足拇指热区（≥ 44px）。

> 日格上的彩色圆点表示「当天有该类别的截稿」；点进去即可在弹层看到完整列表。周视图仍可通过顶部的「周」切换进入。

## 🎨 设计与质感（如何实现）

为了摆脱「量产模板感」、更有画廊 / 画册般的艺术气息，做了以下处理：

- **字体系统**：真正加载 **Inter**（界面）+ **Fraunces**（西文展示标题）+ **思源宋体 / Source Han Serif**（中文展示标题），关键标题用衬线体，呈现画册气质。
- **胶片颗粒 + 暖调**：全站叠加一层极淡的 `feTurbulence` 噪点（暗房 / 画册肌理），配「暖纸 / 暖墨」底色替代冷冰冰的 slate；四角轻微暗角把视线引向中央日历。
- **收橙（quiet luxury）**：品牌橙 `#f97316` 只保留给「今天 / 品牌标识 / 激活视图」，其余强调改用中性墨与靛蓝，避免满屏橙色。
- **分类去噪**：12 色「彩虹仪表盘」改为中性 chip + 低饱和圆点，降低信息噪音。
- **图标化**：emoji（📸 / 🎉 / 📭 / 国旗）全部换成 [Lucide](https://lucide.dev/) 线性图标，跨平台一致。
- **动画令牌**：全局缓动 / 时长集中在 `src/index.css` 的 CSS 变量（`--dur-fast/mid/slow`、`--ease-out/in-out`），数字用 `tabular-nums` 对齐。

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

## 💡 是否需要封装成真正的 App？（评估）

**结论：没必要上架应用商店。轻量 PWA + 主屏幕书签，就是目前最省事、对用户最方便的路径。**

| 维度 | 上架 App Store / Google Play | 轻量 PWA + 书签 |
| --- | --- | --- |
| 开发 / 维护成本 | 高（审核、签名、版本、商店账号） | 极低（已是静态站，加几个文件即可） |
| 用户获取门槛 | 需搜索 / 扫码进商店下载安装 | 打开网页 → 一键 / 几步存到主屏 |
| 更新方式 | 每次发版都要过审 | 推一次代码即生效，用户无感 |
| 离线 / 全屏体验 | 原生 | PWA 已支持（manifest + 缓存） |
| 多端适配 | 各平台各自适配 | 同一套响应式网页 |

**原则：越方便越好。** 这个工具最高频的动作就是「打开 → 看本周有哪些比赛截止」。PWA 书签零安装、零更新摩擦，而本站点本来就是无后端静态页，天然契合。

## 📄 许可证

以 [MIT](./LICENSE) 协议开源。
