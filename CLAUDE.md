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

- `/roommate-agreement/index.html` — Dorm Roommate Agreement Generator（交互式勾选 → 生成可打印协议，8个分类32个条款）
- `/index.html` — 首页（Dorm Essentials Checklist + 工具矩阵）
- `/tools/index.html` — 工具中心页（全量工具分类展示）
- `/dorm-checklist/index.html` — Dorm Essentials Checklist
- `/dorm-laundry-hub/index.html` — Dorm Laundry Hub
- `/move-out-checklist/index.html` — Dorm Move-Out Checklist
- `/moving-cost-calculator/index.html` — Moving Cost Calculator
- `/first-apartment-checklist/index.html` — First Apartment Checklist
- `/rent-affordability/index.html` — Rent Affordability Calculator（含4个tab：Calculator / What-If / City Guide / Tips&Resources）
- `/bill-splitter/index.html` — Roommate Bill Splitter
- `/student-loan-calculator/index.html` — Student Loan Calculator
- `/gpa-calculator/index.html` — GPA Calculator
- `/blog/index.html` — Blog hub（全量文章列表自动渲染）
- `/blog/*/index.html` — 单篇博客文章

## 设计系统

- 所有页面为单文件 HTML（inline CSS + JS），无框架
- 字体：Inter（全部页面统一）
- 配色：海军蓝 #1E3A5F header + 暖灰 #F8F6F3 背景 + 琥珀色 #D97706 强调色
- 导航栏统一：🛠 + 白字 "DormTool" + 工具下拉菜单
- 侧边面板（移动端）：`hub-side-overlay` + `hub-side-panel`
- 工具导航数据：`TOOL_NAV_DATA` 对象（全量工具 + emoji + url）
- 博客文章数据：`ARTICLES` 数组

## 关键约定

- **Emoji**: 仅保留导航栏 logo 🛠、侧边栏图标、TOOL_NAV_DATA 中的 emoji 值。页面内容区域（标题、标签、按钮等）不使用 emoji。文章内的装饰性 emoji 图标（如推荐卡片、网格图标等）一律不加
- **跨工具链接**：统一用 `.next-card` 样式卡片放在页面底部
- **跨站链接**：指向 koalasave.com 的链接用 "Your Next Step: ..." 标题
- **PWA**：所有页面引用 `/manifest.json`，favicon 为 `/favicon.svg`，sw 为 `/sw.js`
- **GA4**：`G-C7V3YR4WTZ`
- **隐私**：所有数据 localStorage 存储，无服务器端收集
- **SEO 内链**：每篇新博客文章必须内链到至少 2-3 个已有工具 + 1-2 篇相关文章，底部加 `.blog-next-moves` 推荐卡片，帮助 Google 爬取更深
- **Tab 系统**（rent-affordability 等页面）：tab 内容通过 JS 动态渲染到 `#categoryPanel`，切换 tab 时替换 innerHTML
- **打印**：每个工具页面有 `@media print` 样式，隐藏导航/广告/按钮等
- **首页 JSON-LD**：新增工具后同步更新 `index.html` 中 `<script type="application/ld+json">` 的 `mentions` 数组和 `<meta name="description">`

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
- **每次修改后立即验证**：grep 检查被改的关键变量/条目是否仍完整存在，不要批量改完再验证

## 品牌名称

- 品牌名统一为 **DormTool**，禁止使用 "SettleList Labs"
- 所有新建页面/文章的 footer、JSON-LD publisher/author、disclaimer、copyright、modal 内容中涉及公司名的位置一律写 "DormTool"
- 邮箱 `support@settlelist.com` 保持不变

## 已知 issue

- `index.html`（首页）有多个 .bak 备份文件，可清理
- 根目录有多个零散的 `.js` 调试/检查脚本，非核心代码

## 执行规则

- **只执行用户明确要求的修改**：不得自行修复任何布局、样式、功能、结构问题，哪怕明显有问题。用户没让改的，一概不动。
- **不部署，除非用户说部署**：改完代码后不得自行部署、发布、或触发任何部署流程。只有用户明确说"部署"或"发布"时才执行。
