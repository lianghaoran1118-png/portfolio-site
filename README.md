# 秋招个人作品集（纯静态网站）

基于 **Vite + Vue 3 + TailwindCSS** 的纯静态个人作品集网站。无后端、无接口、无大模型调用，零多余第三方依赖，可直接部署到 **Vercel** 或 **GitHub Pages**。

## 线上地址

**https://lianghaoran1118-png.github.io/portfolio-site/**

（部署于 GitHub Pages，push 到 `main` 分支后由 GitHub Actions 自动更新，约 1 分钟生效）

## 页面结构

| 页面 | 说明 |
| --- | --- |
| 首页 `/` | Hero 介绍、求职意向、下载简历 PDF、项目精选、技能速览、联系 CTA |
| 项目作品集 `/projects` | 项目卡片：简介 / 技术栈 / 截图轮播（点击放大）/ 关键成果 / 多段代码切换 |
| 技能栈 `/skills` | 编程语言（熟练度）、工具框架、业务能力 |
| 关于我 `/about` | 教育背景、实习经历、荣誉奖项、求职意向、联系方式 |

## 目录结构

```
portfolio-site/
├── index.html                  # 入口 HTML（SEO meta）
├── package.json
├── vite.config.js              # base 已设为 './'，适配 GitHub Pages 子路径
├── .github/workflows/deploy.yml # GitHub Pages 自动部署
├── public/
│   ├── favicon.svg
│   ├── resume/
│   │   └── resume.pdf          # ★ 简历 PDF（下载按钮的文件）
│   └── images/                 # ★ 项目截图存放目录
└── src/
    ├── main.js                 # 应用入口
    ├── router.js               # 路由（Hash 模式，静态部署零配置）
    ├── style.css               # Tailwind 入口 + 全局设计系统
    ├── App.vue                 # 根组件
    ├── data/
    │   └── content.js          # ★ 全站内容配置（改这里即可换文字/项目/技能）
    ├── components/             # 导航、页脚、图标、代码块、截图占位、项目卡片等
    └── views/                  # 4 个页面（首页/项目/技能/关于）
```

## 本地运行

```bash
npm install        # 安装依赖
npm run dev        # 启动开发服务器（默认 http://localhost:5173）
```

构建与预览：

```bash
npm run build      # 打包到 dist/
npm run preview    # 本地预览构建产物
```

> 要求 Node.js 18+（推荐 20 及以上）。

## 如何替换文字 / 图片 / 简历

所有内容都集中在 **`src/data/content.js`** 一个文件里，无需改动组件。

### 1. 替换个人信息
打开 `src/data/content.js`，修改 `profile` 对象：
- `name`：姓名（导航 / 首页 / 页脚 / 浏览器标题自动生效）
- `email`：邮箱（注意同时替换 `yourname@example.com`）
- `github` / `linkedin`：社交链接（留空则不显示）
- `location` / `industries`：意向地区与行业

### 2. 替换项目内容
修改 `projects` 数组，每个项目包含：`tag`（分类）、`title`、`desc`、`tech`（技术栈）、`results`（关键成果）、`code`（代码/提示词片段）。

### 3. 替换项目截图
1. 把截图放入 `public/images/`（例如 `project-arboard.png`）
2. 在 `content.js` 中把对应项目的 `imageSrc` 改为 `"images/project-arboard.png"`
3. 占位框会自动替换为真实图片（组件内已写注释说明）

### 4. 替换简历 PDF
直接覆盖 `public/resume/resume.pdf`（文件名保持不变即可），首页与导航的"下载简历"按钮会自动指向该文件。
目前该文件是从你的 `简历/` 目录复制来的版本，简历 docx/PDF 中已包含作品集线上链接，投递前请同步更新为最新版。

### 5. 调整主题色 / 字体
打开 `src/style.css`，修改 `@theme` 中的变量即可全站生效（当前主色为深蓝 `blue-600/700`）。

## 部署到 Vercel

### 方式 A：网页导入（推荐）
1. 把项目推送到 GitHub 仓库
2. 打开 [vercel.com](https://vercel.com) → New Project → Import 该仓库
3. Framework Preset 选择 **Vite**，Build Command `npm run build`，Output Directory `dist`，其余默认
4. 点击 Deploy 即可，Vercel 自动识别

### 方式 B：Vercel CLI
```bash
npm i -g vercel
vercel          # 首次登录并预览
vercel --prod   # 部署到生产环境
```

## 部署到 GitHub Pages

### 方式 A：GitHub Actions（推荐，已内置工作流）
项目已自带 `.github/workflows/deploy.yml`，只需：
1. 推送到 GitHub 仓库（分支名 `main`）
2. 仓库 Settings → Pages → Source 选择 **GitHub Actions**
3. 之后每次 `push` 到 `main` 都会自动构建并发布
4. 访问 `https://<你的用户名>.github.io/<仓库名>/`

> 当前项目实际地址：**https://lianghaoran1118-png.github.io/portfolio-site/**（已部署完成）
> `vite.config.js` 中 `base: './'` 已适配子路径部署，无需改动。若发布到 `https://<用户名>.github.io/`（用户名仓库根路径），也无需改动。

### 方式 B：手动推送 dist
```bash
npm run build
# 把 dist/ 内容提交到 gh-pages 分支即可
git add dist && git commit -m "deploy" && git push origin gh-pages
```
（仓库 Settings → Pages → Source 选择 gh-pages 分支）

## 配套分析工程

项目页里的图表与代码都来自同级的可复现分析工程：

```
个人网站/
├── maven-fuzzy-analysis/      ★ MavenFuzzyFactory 电商分析（Maven Analytics 课程样本库）
├── search-behavior-analysis/  ★ 用户搜索点击行为分析（真实日志）
├── simulation/                  仿真研究（参数复原方向，当前未在项目页展示）
├── analysis/                    早期版本：信号体检（零结果分析）
└── portfolio-site/              本站
```

### MavenFuzzyFactory 项目（`../maven-fuzzy-analysis/`）

数据源是 Maven Analytics 课程样本库 `mavenfuzzyfactory`（本机 MySQL 导入，非真实企业数据；47.3 万会话 / 118.8 万页面浏览 /
3.2 万订单），覆盖 ISOM7022 课件 Section 6–9 的 28 段 SQL 分析。

- `maven-fuzzy-analysis/README.md` — 数据字典、四个分析模块与核心结论
- `maven-fuzzy-analysis/sql/maven_fuzzy_factory_analysis.sql` — 28 段分析 SQL
- `maven-fuzzy-analysis/run_all.py` — 连 MySQL 跑完全部 SQL（凭据从 `MYSQL_PWD` 读取）
- `maven-fuzzy-analysis/make_web_images.py` — 导出 9 张 16:9 图表素材
- `maven-fuzzy-analysis/outputs/` — `results.json` + 9 张原图

```bash
cd ../maven-fuzzy-analysis
MYSQL_PWD='<你的 MySQL 密码>' python3 run_all.py
python3 make_web_images.py    # 导出 public/images/mff-*.png
```

### 用户搜索点击行为项目（`../search-behavior-analysis/`）

- `search-behavior-analysis/REPORT.md` — 完整分析报告
- `search-behavior-analysis/面试讲稿.md` — 10 分钟讲稿 + 12 个高频追问 Q&A
- `search-behavior-analysis/run_all.py` — 一键复现全部结论（约 8 秒）
- `search-behavior-analysis/outputs/charts/` — 10 张原图

### 重新生成项目页的图表素材

网站卡片以 `aspect-[16/9] object-cover` 渲染图片，而分析图表宽高比跨度较大
（1.5 ~ 3.0），直接使用会被裁掉内容。因此需要先跑一次导出脚本，
把图表居中放到 16:9 白色画布上：

```bash
cd ../search-behavior-analysis
python3 run_all.py            # 重新生成 10 张图表
python3 make_web_images.py    # 导出 16:9 版本到 public/images/
```

导出后会自动写入 `public/images/sba-*.png`（MavenFuzzyFactory 项目则为 `mff-*.png`），
`content.js` 与 `en.js` 中的 `images` 数组已指向这些文件，无需手动改名。

## 常见问题

**Q：为什么用 Hash 路由（URL 带 #）？**
纯静态托管（尤其 GitHub Pages）无法配置服务端重写，Hash 模式无需任何配置即可直接刷新、直达任意页面。

**Q：更换姓名后浏览器标题没变？**
`src/router.js` 中 `router.afterEach` 设置了固定标题，如姓名变化，把其中的"梁浩然"一并替换即可。`index.html` 的 `<title>` 同理。

**Q：如何新增一个项目？**
在 `content.js` 的 `projects` 数组中追加一个对象即可，页面自动渲染。

## 技术栈

- Vue 3（Composition API）+ Vue Router 4
- Vite 6
- TailwindCSS 4
- 零 UI 组件库、零大模型依赖
