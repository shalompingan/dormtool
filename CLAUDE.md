# Project: dormtool.com

## 绝对规则（违反即错误）
- 严禁主动修改任何代码，除非用户用明确的文字要求修改
- "检查一下"、"看看"、"排版有问题"等都属于只看看，不能改
- 必须等到用户说出"改"、"修复"、"改成"等明确指令才能动手

网站根目录：`C:\Users\shalom\Desktop\dormtool`

## Build System

所有 HTML 文件已 **minify in-place**（删注释、压缩空格），无需 build 步骤即可部署。Cloudflare Pages 直接从根目录发布。

如需重新 minify（例如编辑后恢复了格式），运行：
```
cd C:\Users\shalom\Desktop\dormtool && node build.js --inplace
```

build.js 会备份原始文件为 *.orig，然后覆盖源文件。记得定期清理 *.orig 文件：
```
find "C:\Users\shalom\Desktop\dormtool" -name "*.orig" -type f -delete
```

## 页面结构

- `/index.html` — 首页（Dorm Essentials Checklist + 工具矩阵）
- `/tools/index.html` — 工具中心页（全量工具分类展示）
- `/dorm-checklist/index.html` — Dorm Essentials Checklist
- `/dorm-laundry-hub/index.html` — Dorm Laundry Hub
- `/move-out-checklist/index.html` — Dorm Move-Out Checklist
- `/moving-cost-calculator/index.html` — Moving Cost Calculator
- `/first-apartment-checklist/index.html` — First Apartment Checklist
- `/rent-affordability/index.html` — Rent Affordability Calculator（含4个tab：Calculator / What-If / City Guide / Tips&Resources）
- `/bill-splitter/index.html` — Roommate Bill Splitter
- `/dorm-budget-calculator/index.html` — Dorm Budget Calculator
- `/student-loan-calculator/index.html` — Student Loan Calculator
- `/gpa-calculator/index.html` — GPA Calculator
- `/final-grade-calculator/index.html` — Final Grade Calculator
- `/college-acceptance-calculator/index.html` — College Acceptance Calculator
- `/roommate-agreement/index.html` — Dorm Roommate Agreement Generator（交互式勾选 → 生成可打印协议，8个分类32个条款）
- `/about/index.html`、`/contact/index.html`、`/privacy/index.html`、`/terms/index.html` — 关于/联系/隐私/条款
- `/blog/index.html` — Blog hub（全量文章列表自动渲染，`ARTICLES` 数组）
- `/blog/*/index.html` — 单篇博客文章（目前 23 篇）

## 设计系统

- 所有页面为单文件 HTML（inline CSS + JS），无框架
- 字体：Inter（全部页面统一）
- 配色：海军蓝 #1E3A5F header + 暖灰 #F8F6F3 背景 + 琥珀色 #D97706 强调色
- 导航栏统一：SVG logo（40×40，白色 + #D97706 琥珀色） + 白字 "DormTool" + 工具下拉菜单
- 侧边面板（移动端）：`hub-side-overlay` + `hub-side-panel`，logo 为 SVG（30×30，白色 + #D97706 琥珀色）
- 工具导航数据：`TOOL_NAV_DATA` 对象（全量工具 + emoji + url）
- 博客文章数据：`ARTICLES` 数组

## 关键约定

- **Emoji**: 仅保留导航栏 logo 🛠、侧边栏图标、TOOL_NAV_DATA 中的 emoji 值。页面内容区域（标题、标签、按钮等）不使用 emoji。文章内的装饰性 emoji 图标（如推荐卡片、网格图标等）一律不加
- **跨工具链接**：统一用 `.next-card` 样式卡片放在页面底部
- **跨站链接**：指向 koalasave.com 的链接用 "Your Next Step: ..." 标题
- **PWA**：所有页面引用 `/manifest.json`，favicon 为 `/favicon.svg`，sw 为 `/sw.js`
- **GA4**：`G-C7V3YR4WTZ`
- **隐私**：所有数据 localStorage 存储，无服务器端收集
- **Disclaimer 规则**：每篇博客文章的免责声明根据内容风险类型定制，不统一复制
  - **财务类**（贷款、房租、预算）：加 financial advice disclaimer
  - **学术/申请类**（GPA、大学申请、ED/EA）：加 admissions/academic advice disclaimer
  - **法律/合约类**（roommate agreement）：加 legal advice disclaimer
  - **纯信息类**（清单、指南）：简短 disclaimer 或无特殊声明
- **SEO 内链**：每篇新博客文章必须内链到至少 2-3 个已有工具 + 1-2 篇相关文章，底部加 `.blog-next-moves` 推荐卡片，帮助 Google 爬取更深。**内链必须自然分布在正文段落中**，不能只靠底部 blog-next-moves 卡片凑数
- **博客文章排序**：新文章添加到 `blog/index.html` 的 `ARTICLES` 数组时，放在数组**最前面**（即第一个位置），确保博客页最新文章排在最上方
- **Tab 系统**（rent-affordability 等页面）：tab 内容通过 JS 动态渲染到 `#categoryPanel`，切换 tab 时替换 innerHTML
- **打印**：每个工具页面有 `@media print` 样式，隐藏导航/广告/按钮等
- **首页 JSON-LD**：新增工具后同步更新 `index.html` 中 `<script type="application/ld+json">` 的 `mentions` 数组和 `<meta name="description">`
- **博客作者统一**：所有博客文章（目前 23 篇）的 byline（`.bauthor`）统一为 `"By DormTool"`，JSON-LD Article author 为 `"@type":"Person","name":"DormTool"`。新增文章时必须遵循此格式
- **Footer tagline**：所有页面的 `.fbar` 第二行统一为 `"Built by one student who got tired of guessing. Refined with AI."`

## 工具页面通用模式

所有工具页面遵循相同结构：
1. `<header class="hub-header">` — 粘性导航栏
2. `<main class="container">` — 页面标题 + 工具内容
3. `.next-card` — 跨工具推荐链接
4. `<footer class="site-footer">` — 页脚（含 affiliate disclaimer）
5. Modal 弹窗 — Privacy / Terms / About / Contact

## 修改 minified 文件注意事项

minified HTML 是单行无格式代码，用 sed/perl 做字符串替换时极易误删相邻代码。

- 追加内容时，优先插入到结束标记前（如 `];` / `}};`），而非替换已有条目
- 如果必须替换，确保替换内容包含被匹配的原文，不要丢弃
- **每次修改后立即验证，不要批量改完再验证**，三样都要做：
  1. grep/python 检查被改的关键变量/条目是否仍完整存在
  2. 如果改动涉及 JSON-LD（`<script type="application/ld+json">`），用 `python3 -c "import json;json.loads(...)"` 或 `node -e` 确认还是合法 JSON——**不要用 `node build.js` 校验**，它的 JS/HTML minifier 是纯正则处理、没有语法解析，代码写坏了也会"压缩成功"不报错；唯一有 try/catch 的地方是 JSON-LD，但解析失败会静默跳过、不会报错，起不到校验作用
  3. 本地打开改动的页面，看浏览器控制台有没有报错

## 品牌名称

- 品牌名统一为 **DormTool**，禁止使用 "SettleList Labs"
- 所有新建页面/文章的 footer、JSON-LD publisher/author、disclaimer、copyright、modal 内容中涉及公司名的位置一律写 "DormTool"
- 邮箱 `hello@dormtool.com` 保持不变

## 已知 issue

- ~~根目录有 `index.html.bak`、`index.html.pre-navbak` 备份文件，可清理~~ 2026-07-28 已删除
- ~~根目录有一批一次性调试脚本，非核心代码，可以清理~~ 2026-07-28 已删除（`balance_check.js`、`check_brace2.js`、`check_cf.js`、`check_cf2.js`、`check_root.js`、`check_syn.js`、`check_syn2.js`、`check_tail.js`、`find_error_pos.js`、`fix_dcl1.js`、`fix_laundry.js`、`fix_one.js`、`tmp_check.js`、`trace_dcl.js`、`verify_css.js`、`verify_laundry.js`、`verify_one.js`、`verify_page.js`）。仍在用的核心脚本不动：`build.js`、`build-nav.js`、`add-jsonld.js`、`contact-worker.js`、`sw.js`、`fix-cart.js`
- 2026-07-28 全站排查发现 `TOOL_NAV_DATA`/`TOOL_DATA` 里普遍缺 `college-acceptance-calculator`（新工具上线后没同步到其他页面），部分页面还缺 `roommate-agreement`、`dorm-budget-calculator`；侧边栏 emoji 已按要求全部清空；`hubToolsMenu`/`hubToolsBtn` 死代码（对应桌面下拉菜单元素已在改版中移除，但 JS 还留着引用）已清理；`about`/`contact`/`privacy`/`terms` 的 `.hub-hamburger` 缺 `margin-left:auto` 导致手机端汉堡按钮没有顶到最右边，已修复；`sw.js` 的 fetch 处理器对 POST 请求无条件调用 `cache.put()` 导致控制台报 `Uncaught TypeError`，已加 `if(e.request.method!=='GET')return;` 跳过
- `blog/index.html` 的 `ARTICLES` 数组曾经漏掉 1 篇已发布文章（college-money-mistakes），导致这篇在博客列表页上是"孤岛"——文章本身能直接访问，但博客首页找不到入口，Google 从博客页爬不到。2026-07-21 已补进数组
  - 排查时的教训：另外3篇（how-much-rent-can-i-afford、how-to-calculate-gpa、weighted-gpa-calculator）一开始被误判为"也漏了"，原因是它们的对象用的是双引号 `id:"..."` 而不是数组里大多数条目用的单引号 `id:'...'`，用 grep 排查时如果只匹配单引号会漏检。之后误加了3条重复记录，已经删掉。**以后检查 ARTICLES 数组完整性时，正则必须同时匹配单引号和双引号（`id:['"]([^'"]*)['"]`），不能假设全站统一用单引号**
- `blog/weighted-gpa-calculator/index.html` 的"Weighted vs Unweighted"章节里有一段像是没删干净的 AI 草稿自言自语："Wait — this calculation gives a different result? Let me recalculate. Actually, looking at the numbers..."，读起来不像正式发布的文案。2026-07-29 排查合并文章时发现，用户还没决定要不要清理，先记录，不要自行修改

## 2026-07-21 移动端侧边栏 bug 修复记录

全站排查后发现并修复了以下几类系统性问题，涉及 `blog/*/index.html` 里大量文章（不是个别页面）：

- **`TOOL_NAV_DATA` 不全**：标准应为 13 个工具（顺序：dorm-checklist → dorm-laundry-hub → move-out-checklist → moving-cost-calculator → first-apartment-checklist → rent-affordability → bill-splitter → dorm-budget-calculator → student-loan-calculator → gpa-calculator → final-grade-calculator → college-acceptance-calculator → roommate-agreement）。发现时有近 20 篇文章只有 7-12 个，是历史上加新工具时忘记同步旧文章导致的。**每次新增工具后，必须检查所有已发布博客文章的 `TOOL_NAV_DATA`，不能只改首页/工具页**
- **✕ 关闭图标 / ☰ 汉堡图标缺失**：`<button class="hsp-close" id="hubSideClose"></button>` 和 `hubHamburger` 有时会漏写图标文字（空按钮）
- **Home/All Tools 链接不统一**：博客文章侧边栏不应该有 Home/All Tools 这两项（已统一去掉），只有首页 `index.html` 自己保留
- **`.hub-side-overlay.is-open .hub-side-panel{transform:translateX(0)}` 规则缺失**：极隐蔽的 bug——缺了这条，遮罩层能正常变暗，但侧边面板本身永远不会滑入屏幕（点击没反应的假象）。CSS 里必须同时有 `.hub-side-overlay.is-open{display:block}` 和这条 transform 规则，两条缺一不可
- **`--hub-primary` CSS 变量未定义**：`.hub-side-panel{background:var(--hub-primary)}` 依赖这个变量，如果 `:root` 里没定义会导致面板背景透明，文章内容透视出来。标准值 `--hub-primary:#1E3A5F`（和 `--primary` 一致）
- **表格横向溢出**：手机端宽表格（4列以上）如果没有包一层 `.table-scroll{overflow-x:auto}` 或 `.table-wrap{overflow-x:auto}`，会撑破整个页面横向布局。新文章里的对比表格必须包这层容器
- **early-decision-vs-early-action 文章**：内嵌的策略测试工具 JS 曾经被截断（`evaluate()` 函数写到一半没了），导致整段脚本因语法错误全部失效。已重写补全评分逻辑

**建议**：新增博客文章时，直接复制近期已验证过的文章（如 `dorm-room-organization-guide`）的导航栏/侧边栏代码块作为模板，而不是手写，避免重复踩坑。

## 2026-07-29 GPA 重复文章合并

背景：`gpa-calculator`（工具）、`weighted-gpa-calculator`、`how-to-calculate-gpa` 三个页面关键词高度重叠，后两篇博客文章内容近似重复（cannibalization），GSC 数据显示两篇排名都很差（weighted-gpa-calculator 约65次曝光/排名83，how-to-calculate-gpa 仅1次曝光/排名93）。决定把 how-to-calculate-gpa 合并进 weighted-gpa-calculator，做法：

- 对比两篇全文，把 how-to-calculate-gpa 里 weighted-gpa-calculator 没有的独有内容（累计GPA多学期合并算法、目标GPA倒推公式、retake/pass-fail/withdrawal政策、GPA对应学术地位/奖学金/读研的对照表）合并进 weighted-gpa-calculator，新增为第8-11节 + 3条FAQ（同步更新了正文和 JSON-LD FAQPage），`dateModified` 同步改为当天
- 站点根目录新增 `_redirects` 文件（之前不存在），写入 `/blog/how-to-calculate-gpa/ /blog/weighted-gpa-calculator/ 301`
- `blog/index.html` 的 `ARTICLES` 数组删除 how-to-calculate-gpa 条目（注意它是双引号 `id:"..."` 格式，见上面已知issue的教训）
- `blog/early-decision-vs-early-action/index.html` 的 next-moves 卡片里原本同时链向 weighted-gpa-calculator 和 how-to-calculate-gpa——如果只是把后者的链接改成前者会造成同一组卡片里重复链接同一个页面，所以改成了链向 `final-grade-calculator`（复用了别处已有的文案，没有编造新内容）
- `sitemap.xml` 删除 how-to-calculate-gpa 那条 `<url>` 记录
- `blog/how-to-calculate-gpa/` 整个文件夹（含 index.html）已删除

**教训/建议**：以后遇到关键词重叠的文章，先整篇读完对比内容（不能只看标题/关键词），确认是否真的是重复（如 how-much-rent-can-i-afford 和 rent-affordability-guide 经核实是不同受众角度、已经互相内链，不是重复，未合并）。合并时任何跨页面的 next-moves/内链卡片都要检查会不会因为改动产生同一组卡片重复链接同一目标的问题。

## 2026-07-30 rent-affordability-guide 优化 + dorm 清洁类文章合并

**rent-affordability-guide 优化**：用户上传该文章单独筛选的 GSC 数据（过去3个月331次展示/排名10.38，是当时全站排名最接近首页的文章），发现"average rent for college student"这个查询词排第7（很接近首页）。查了 Education Data Initiative（NCES数据）和 Find My Place 的 2026 学生租房数据后，给文章新增了两处：

- 新增"Average Rent for College Students in 2026"板块（国家平均值 + 按城市类型分类的租金区间），引用上述两个数据源
- 在已有的"30% Rule"章节里加了一个反查表（房租倒推所需收入），针对"what salary do you need to afford $1200 rent"这类查询词
- 顺带发现该文章的 FAQPage JSON-LD 定义了3个问答，但正文里完全没有对应的可见 FAQ 板块（结构化数据与可见内容不匹配，不符合谷歌的FAQ rich result规范）——已补一个可见的 FAQ 板块，内容跟JSON-LD一字不差，不是新编的
- `dateModified` 同步更新，`keywords` 字段追加了新覆盖的查询词

**dorm-room-cleaning-guide / dorm-cleaning-checklist 合并**：这两篇文章跟 GPA 那次是同一个模式——用户分别导出两篇的 GSC 页面数据（过去28天，guide 222次展示/排名38.27，checklist 162次展示/排名56.98），查询词高度重叠（十几个词两篇都在抢：dorm cleaning、dorm cleaning checklist、how to clean dorm room等）。通读全文确认 checklist 基本是 guide 的缩水版，唯一独有内容是"Staying Organized（收纳整理跟打扫是两回事）"这个角度。处理方式：

- 把 Staying Organized 的4个要点合并进 dorm-room-cleaning-guide，新增为第12节，原本编号12的FAQ改成13（正文+TOC都同步改了编号）
- `_redirects` 追加一条：`/blog/dorm-cleaning-checklist/ /blog/dorm-room-cleaning-guide/ 301`
- `blog/index.html` 的 `ARTICLES` 数组删除 dorm-cleaning-checklist 条目（这条是单引号格式）
- 全站排查后发现只有 `blog/can-you-loft-a-dorm-bed/index.html` 一篇文章内链指向 dorm-cleaning-checklist，改成指向 dorm-room-cleaning-guide（改之前确认了该页没有已存在的 dorm-room-cleaning-guide 链接，不会造成重复）
- `sitemap.xml` 删除 dorm-cleaning-checklist 那条 `<url>` 记录
- `blog/dorm-cleaning-checklist/` 整个文件夹已删除

**新增的选题验证流程**：这轮之前还讨论过"暑期转租(summer sublease)"这个新话题，用户用 Google Keyword Planner 查了长尾词真实搜索量，发现除了一个词（10-100/月，低竞争）外其余全部是0-10/月的最低区间，且核心词三个月内搜索量下降了100%（季节性已过季），最终判断不值得写，放弃了这个选题。**教训**：以后遇到没有 GSC 历史数据支撑的全新选题（不是老文章的关键词缺口），写之前应该先让用户用 Keyword Planner 或类似工具查一下真实搜索量再决定，不要只凭"网上有多少竞争内容"这种定性判断就动笔——竞争分析能看出"能不能打"，但看不出"值不值得打"。

## 待办：TOOL_NAV_DATA 统一迁移（方案A，尚未开始）

上面这轮 bug（12篇缺工具、导航图标丢失、后续又发现另外10+篇同类问题）本质上是同一种失败模式：`TOOL_NAV_DATA` 数据散落在 35-40 个文件里各自维护一份，靠人为记得同步，迟早会漏。

长远方案已经讨论并确定：**方案A——把 `TOOL_NAV_DATA`（以及可能的 `renderToolNav` 逻辑）抽成一个共享的 `/nav-data.js` 文件，全站页面统一 `<script src="/nav-data.js">` 引用，不再各自维护一份**。这样"忘记同步"这个动作在技术上不可能发生，而不是靠检查脚本或人工提醒去兜底（方案B）。方案B 的检查脚本思路不冲突，可以留着做上线前兜底，但不能替代方案A。

**现状**：只是决定了方向，还没有开始迁移。原因是当前所有页面已经手动修复并验证过，站点处于正确状态，迁移属于"面向未来的保险"而非紧急修复，且这轮修复工作量已经很大，不适合疲劳状态下继续做大范围改动。

**迁移涉及的复杂点**（下次动手前务必确认）：
1. 全站有三种 URL 风格混用：绝对路径 `/xxx/`、绝对路径 `/xxx/index.html`、相对路径 `../../xxx/index.html`——迁移时建议统一成绝对路径 `/xxx/`，需要顺带处理
2. `renderToolNav` 至少有两个变体：普通版本（无 Home/All Tools），以及带 `hubToolsMenu` + `CURRENT_TOOL`（排除当前工具自身链接）的版本，后者主要给工具页顶部下拉菜单用——迁移前要先确认工具页那边的具体用法，不能直接照搬博客文章的模式
3. 建议节奏：先搭好 `/nav-data.js` 共享文件 → 挑2-3个页面接入验证无误 → 再批量替换其余文件 + 抽查，而不是继续"一个页面一个页面手动查"（那是排查未知bug时的节奏，迁移是机械替换，可以更快）

## Footer Legal & Trust 链接

所有页面的 footer "Legal & Trust" 4 个链接（Privacy/ Terms/ About/ Contact）改为真实链接，不用 JS 弹窗。路径格式跟随页面中 Smart Utilities 已有链接的风格：

- 如果 Smart Utilities 用绝对路径 `/dorm-checklist/` → Legal 也用 `/privacy/`
- 如果 Smart Utilities 用相对路径 `../dorm-checklist/index.html` → Legal 也用 `../privacy/index.html`
- 首页（根目录）用 `privacy/index.html`

所有 16 个页面的 About modal 已统一为第一人称版本，正文如下：
- 段落1：品牌介绍（"DormTool provides free interactive tools..."）
- 段落2：个人故事（"I started this as a way to turn the most stressful parts..."）
- 段落3：solo project 说明（"DormTool is a solo project. I write and organize the content myself..."）
- 署名统一为 `— DormTool`，右对齐
- 联系方式 `hello@dormtool.com`
- 更新清单：index.html, tools/index.html, about/index.html, rent-affordability, moving-cost-calculator, move-out-checklist, first-apartment-checklist, dorm-laundry-hub, dorm-checklist, bill-splitter, blog/index.html, roommate-agreement, student-loan-calculator, gpa-calculator, final-grade-calculator, dorm-budget-calculator, college-acceptance-calculator

## Smart Utilities 底部导航（2026-07-15 更新）

所有页面的 footer "Smart Utilities" 栏目统一为 5 个工具链接 + "View All Tools →"：
1. Dorm Checklist
2. Rent Affordability Calculator
3. Roommate Bill Splitter
4. GPA Calculator
5. Moving Cost Calculator
6. View All Tools（`<a href="/tools/">`，字体加粗，琥珀色）

注意：部分页面（contact、about、privacy、terms）原先有 9 个工具，已标准化为统一的 5 个 + 查看全部。

注意：`--max-w` CSS 变量各页面可能不同（如 college-acceptance-calculator 原为 780px），影响 footer 列间距。修改时需确认一致。

## 执行规则

- **只执行用户明确要求的修改**：不得自行修复任何布局、样式、功能、结构问题，哪怕明显有问题。用户没让改的，一概不动。
- **不部署，除非用户说部署**：改完代码后不得自行部署、发布、或触发任何部署流程。只有用户明确说"部署"或"发布"时才执行。
- **多页面修复必须一个一个来**：如果同一类问题涉及多个页面，修复一个页面后立即发本地连接（http://127.0.0.1:5500/...）给用户检查，等用户确认没问题后才能修复下一个页面。禁止一次性批量修改多个页面再统一汇报。
- **修复/更新后及时清理历史包袱**：每轮修复或功能更新做完后，主动检查这次过程中产生或暴露出的历史遗留物——一次性调试脚本、备份文件（`*.bak`/`*.orig`/`*.pre-navbak`）、确认无引用的死代码、遗留的 git 锁文件（`.git/index.lock`）等——提出来问用户是否清理，不要放着攒到下次排查时才发现。清理动作本身仍然要走"用户明确指令才动手"的规矩，这条只是要求主动提出、不要遗漏，不代表可以绕过确认直接删。
- **写文章（博客正文、外链投稿如IndieHackers帖子等）先用中文写初稿**：交给用户看，用户看完提出要改的地方后，再翻译/改写成英文成稿。不要一上来就直接写英文成稿。
