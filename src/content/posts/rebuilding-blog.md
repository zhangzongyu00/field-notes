---
title: "重新搭一个自己的博客：GitHub Pages 自动发布与 Markdown 写作"
description: "从选择 AstroPaper、新建仓库到自动发布，把博客作为公众号和小红书内容的统一母稿。"
pubDatetime: 2026-11-11T08:00:00Z
modDatetime: 2026-11-11T09:17:00Z
featured: true
draft: false
tags:
  - 折腾记录
  - GitHub Pages
  - 工具
---

我想找一个地方，持续整理技术实践、好玩的工具和可以公开分享的工作经验。文章以后也可能发到公众号或小红书，但不想在几个平台维护几份互不相干的原稿。

于是重新搭了这个博客，叫 **折腾笔记**。文章用 Markdown 存在 Git 仓库里，GitHub Pages 提供公开页面，GitHub Actions 负责在每次提交后自动构建和发布。这篇记录实际使用的方案、目录和操作过程。

## 先把需求定下来

我的需求很简单：

- 浏览器里编辑文章并提交，博客就能更新。
- 本地写作、提交并推送，也走同一条发布流程。
- 保留完整文章、代码、截图和修改历史。
- 公众号、小红书发实际内容，改编稿从同一个母稿整理。
- 先用现成主题，支持中文、搜索、标签、归档、RSS 和明暗模式。

旧博客这次不迁移，新建一个独立仓库 `field-notes`。这是 GitHub Pages 的项目站点，因此地址带仓库名：

```text
仓库：https://github.com/zhangzongyu00/field-notes
博客：https://zhangzongyu00.github.io/field-notes/
```

## 1. 比较主题，选择 AstroPaper

先看了 AstroPaper、Chirpy、PaperMod 的真实演示。最后选 AstroPaper：界面简洁，内容集中，Markdown 写作方便，以后想修改页面也可以沿着 Astro 和 TypeScript 的代码改。

![在 Safari 中查看 AstroPaper 的公开演示](@/assets/images/rebuilding-blog/01-theme-preview-in-safari.png)

这张图是主题演示，站点名和示例文章属于原作者；部署时会换成自己的内容。此次初始化使用 AstroPaper `7.1.0`，保留主题的 MIT 许可。

## 2. 新建公开仓库

GitHub CLI 的授权和 Safari 的网页登录是两件事。完成 CLI 设备授权后，才能在终端以自己的账号操作仓库；临时设备码和令牌不进入截图素材。

新仓库名为 `field-notes`，可见性选 Public。技术文章和图片也会随源码公开。

![GitHub 的新建仓库表单](@/assets/images/rebuilding-blog/03-create-repository-form.png)

![新仓库创建后的空仓库页面](@/assets/images/rebuilding-blog/04-repository-created.png)

这次实际通过 `gh repo create` 创建仓库。表单截图用于说明名称和可见性，创建结果以新仓库页面为准。

然后取 AstroPaper 源码，在本地初始化独立的 Git 历史，把 `origin` 指向新仓库。这个仓库记录从“折腾笔记”初始化开始的修改。

![主题初始化并提交后，新仓库的文件目录](@/assets/images/rebuilding-blog/07-repository-files.png)

## 3. 改成自己的博客

主要配置在两个文件：

```typescript
// astro-paper.config.ts 中的 site
{
  url: "https://zhangzongyu00.github.io/field-notes/",
  title: "折腾笔记",
  description: "记录技术实践、工具发现，以及值得分享的公开经验。",
  author: "zhangzongyu00",
  lang: "zh-CN",
  timezone: "Asia/Shanghai",
}
```

```typescript
// astro.config.ts
site: config.site.url,
base: "/field-notes",
trailingSlash: "always",
i18n: {
  locales: ["zh-CN"],
  defaultLocale: "zh-CN",
  routing: { prefixDefaultLocale: false },
},
```

`base` 很容易漏掉。这个站点挂在 `/field-notes/` 下，文章链接、图片、搜索资源和 RSS 都要沿着这个前缀访问。

此外，增加中文翻译，改首页和关于页，去掉主题示例文章，把“编辑文章”指向自己的仓库。正文用系统字体，中文显示更自然，构建时也不需要下载 Google 字体。

![首次本地构建后的折腾笔记首页](@/assets/images/rebuilding-blog/06-local-blog-preview.png)

## 4. 目录只围绕写作需要组织

```text
field-notes/
├── src/content/posts/
│   └── rebuilding-blog.md           # 本篇文章的唯一母稿
├── src/content/pages/about.md
├── src/assets/images/rebuilding-blog/
│   └── 01-theme-preview-in-safari.png
├── distribution/rebuilding-blog/
│   ├── wechat.md                    # 公众号改编稿
│   ├── xiaohongshu.md               # 小红书图文稿
│   └── README.md                    # 对应母稿和分发记录
├── templates/post.md
├── docs/writing-and-publishing.md
├── .github/workflows/deploy.yml
├── astro-paper.config.ts
├── astro.config.ts
└── pnpm-lock.yaml
```

文章先平铺，不急着按年份或分类分多层目录。时间由 `pubDatetime` 记录，主题由 `tags` 表达。一篇文章可以同时打 `iOS`、`工具`、`折腾记录` 等标签。

这里的文件名 `rebuilding-blog` 是稳定标识，对应文章地址、图片目录和平台稿目录。标题可以改，发布后的文件名和目录尽量不动：当前主题会把文章子目录加入 URL，随意移动会改变地址。

## 5. 配置自动发布

在 **Settings → Pages → Build and deployment** 中把 Source 设为 **GitHub Actions**。这次通过 GitHub API 设置，再到网页核对。

![Pages 发布来源设置为 GitHub Actions](@/assets/images/rebuilding-blog/05-pages-source-github-actions.png)

发布流程是：

```text
网页编辑并提交 main ─┐
                    ├→ Actions 安装依赖、检查和构建
本地 commit + push ─┘              ↓
                              上传 dist
                                  ↓
                            部署 GitHub Pages
```

工作流保存在 `.github/workflows/deploy.yml`，监听：

```yaml
on:
  push:
    branches: [main]
  workflow_dispatch:
```

构建任务依次使用 checkout、pnpm/action-setup、setup-node、configure-pages，执行：

```bash
pnpm install --frozen-lockfile
pnpm run build
```

`build` 包含 Astro 检查、静态页面生成和 Pagefind 搜索索引生成。构建通过后上传 `dist`，部署任务用 `actions/deploy-pages` 发布。部署任务需要 `pages: write` 和 `id-token: write` 权限。

此次本地与流水线统一使用 Node.js `24.22.2`、pnpm `11.3.0`，提交锁文件固定依赖。旧教程里的运行时版本不一定适合当前主题，要以实际 `package.json` 的要求为准。

## 6. 以后怎么写文章

### 直接在浏览器写

打开仓库 `src/content/posts/`，用 **Add file → Create new file** 创建 `.md`，或者点击博客文章底部的“编辑文章”。复制模板，改内容，提交到 `main`。

```yaml
---
title: "我发现了一个好用的工具"
description: "记录使用场景、操作步骤和实际体验。"
pubDatetime: 2026-11-11T08:00:00Z
draft: false
featured: false
tags: [工具, 折腾记录]
---
```

`08:00Z` 是北京时间 16:00。模板默认 `draft: true`，准备发布时改成 `false`。草稿不生成博客页，但公开仓库里的源文件仍能被看到。

### 在本地写

拉取最新版本、编辑文章，再提交需要发布的文件：

```bash
git pull --ff-only
git add src/content/posts/my-new-tool.md
git commit -m "记录新工具的使用体验"
git push origin main
```

只保存本地文件不会更新博客。网页和本地最终都要产生 `main` 上的提交，才触发工作流。

图片放到 `src/assets/images/<文章标识>/`，使用本地引用：

```markdown
![描述截图展示的内容](@/assets/images/my-new-tool/01-options.png)
```

Astro 会处理图片路径和尺寸。用 `pnpm dev` 预览正文，用 `pnpm build` 后的 `pnpm preview` 检查全文搜索。

## 实际发布验证

两种入口都做了真实操作，没有只检查配置文件。

**本地推送：** 初始化提交 `87c79dc` 推送到 `main`，自动触发[第一次工作流](https://github.com/zhangzongyu00/field-notes/actions/runs/42993066195)。`build` 和 `deploy` 都成功，随后线上首页和首篇文章可以打开。这次运行总耗时 49 秒，后续耗时以实际运行结果为准。

![本地推送触发的首次 Actions 构建与部署都成功](@/assets/images/rebuilding-blog/08-first-deployment-success.png)

![首次部署后的线上折腾笔记首页](@/assets/images/rebuilding-blog/09-live-blog-homepage.png)

**网页提交：** 在 Safari 打开 GitHub 的 `about.md` 编辑器，添加“持续更新”段落，点击 **Commit changes**，选择直接提交到 `main`。

![在 Safari 的 GitHub 编辑器里修改关于页](@/assets/images/rebuilding-blog/10-edit-about-in-github.png)

![提交窗口中选择直接提交到 main](@/assets/images/rebuilding-blog/11-commit-directly-to-main.png)

网页生成提交 `2eb95d2`，自动触发[第二次工作流](https://github.com/zhangzongyu00/field-notes/actions/runs/42993770224)。发布后检查关于页中的新段落，确认网页编辑也进入了同一条自动发布流程。

![网页提交自动触发的第二次 Actions 发布成功](@/assets/images/rebuilding-blog/12-browser-update-deployment-success.png)

![网页提交后的线上关于页出现持续更新段落](@/assets/images/rebuilding-blog/13-live-about-after-browser-edit.png)

线上还检查了中文全文搜索、手机菜单、明暗切换、文章图片、RSS、站点地图和内部链接。中文搜索“公众号”能够找到本篇文章，页面没有脚本错误。

## 7. 作为公众号和小红书的唯一源头

这个方案可行，但“唯一源头”需要靠写作习惯维持。

完整文章、代码和原始截图先写入母稿。公众号稿保留完整内容，转换排版、上传图片后复核；小红书稿根据主题拆成图文，保留核心结论和可执行步骤。平台读者能直接读到内容，无需跳转博客才能理解。

`distribution/` 保存这些派生稿，不参与博客文章收录。正文更正先回到母稿，再更新平台稿；平台已经发布的内容不会自动随博客变化。

初期人工整理和发布足够，没有为此额外搭建跨平台发布系统。本次只准备改编稿，没有向外部平台发送内容。

## 参考资料

- [GitHub Pages 的用户站点与项目站点](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)
- [配置 GitHub Pages 发布源](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [Astro 官方 GitHub Pages 部署指南](https://docs.astro.build/en/guides/deploy/github/)
- [AstroPaper 源码与许可](https://github.com/satnaing/astro-paper)
