# 我重新搭了一个博客，让每次提交都自动发布

我想持续整理技术实践、好玩的工具和可以公开分享的经验。这些内容也可能发到公众号和小红书，所以先把完整母稿放到一个地方。

这次重新搭的博客叫“折腾笔记”。用 Markdown 写文章，Git 保存修改历史，GitHub Actions 自动构建，GitHub Pages 提供公开页面。

这篇就是实际搭建记录。

## 先选一个适合写作的主题

看过 AstroPaper、Chirpy、PaperMod 的演示之后，我选了 AstroPaper。它的页面简洁，有文章列表、标签、归档、搜索、RSS 和明暗模式，以后也方便沿着 Astro 和 TypeScript 的代码调整。

配图：`../../src/assets/images/rebuilding-blog/01-theme-preview-in-safari.png`

图注：先看真实演示，再决定主题；这是 AstroPaper 原作者的演示页面。

## 新建独立的公开仓库

这次新建 `field-notes`，不迁移旧博客。初始化主题后，把本地仓库的 `origin` 指向自己的新仓库，保留主题的 MIT 许可。

GitHub CLI 的设备授权和 Safari 的网页登录互相独立。终端需要完成 CLI 授权，才能以自己的账号操作。

配图：`../../src/assets/images/rebuilding-blog/04-repository-created.png`

图注：新仓库创建成功。文章和截图随后作为源码一起提交。

## 最容易漏掉的是站点路径

GitHub Pages 的项目站点带仓库名前缀：

```text
https://zhangzongyu00.github.io/field-notes/
```

所以除了改博客名称、描述、作者、语言和时区，还要在 Astro 配置里加：

```typescript
site: config.site.url,
base: "/field-notes",
trailingSlash: "always",
```

文章、图片、搜索资源和 RSS 都要使用这个前缀。首页能打开，不代表其他页面一定没问题。

我还加了中文界面，改首页和关于页，清理示例文章，把“编辑文章”指向自己的仓库。正文改用系统字体，中文显示更自然。

配图：`../../src/assets/images/rebuilding-blog/06-local-blog-preview.png`

图注：第一次本地构建后的“折腾笔记”首页。

## 让网页编辑和本地写作走同一条发布流程

在仓库的 Settings → Pages 中，把 Source 设为 GitHub Actions。工作流放在 `.github/workflows/deploy.yml`，监听对 `main` 的提交：

```yaml
on:
  push:
    branches: [main]
  workflow_dispatch:
```

构建任务安装锁定的依赖，执行 Astro 检查、生成静态页面和中文搜索索引。成功后上传 `dist`，再由部署任务发布 GitHub Pages。

配图：`../../src/assets/images/rebuilding-blog/05-pages-source-github-actions.png`

图注：Pages 的发布来源选择 GitHub Actions。

今后的网页写作流程：打开文章源文件 → 编辑 → Commit changes 到 `main` → 等 Actions 成功。

本地写作则是：

```bash
git pull --ff-only
git add src/content/posts/my-new-tool.md
git commit -m "记录新工具的使用体验"
git push origin main
```

只保存文件不会更新博客，需要完成提交和推送。

## 把目录围绕内容组织

文章母稿放在 `src/content/posts/`，每篇截图放在 `src/assets/images/<文章标识>/`。

目前文章先平铺，主题用标签表达，时间用 `pubDatetime` 记录，不急着建立复杂分类。文件名作为稳定标识，关联文章地址、截图和平台稿；发布后不随意改文件名或移动目录。

新文章从模板复制：

```yaml
---
title: "我发现了一个好用的工具"
description: "记录使用场景、操作步骤和实际体验。"
pubDatetime: 2026-11-11T08:00:00Z
draft: false
tags: [工具, 折腾记录]
---
```

日期的 `Z` 表示 UTC，示例时间是北京时间 16:00。草稿不生成博客页，但公开仓库里的源文件仍然可见。

## 博客成为唯一源头，需要怎样的习惯

完整文章和原始截图先写入母稿。公众号版本保留完整步骤，调整排版并上传图片；小红书版本拆成图文，突出结论和可执行的操作。

这些派生稿放在 `distribution/`，不被重复收录到博客里。各平台的内容本身完整可读，读者不用点击链接才能理解。

有更正时先更新母稿，再同步平台稿。已经发布的平台内容不会自动跟着博客更新，因此我先采用人工整理和发布。

这样既能保持完整原文和版本记录，也给不同平台留出合适的阅读形式。

## 两种更新入口都试了一遍

本地推送初始化版本后，第一次 Actions 的构建和部署都成功，博客可以访问。这次总耗时 49 秒，后续以实际运行结果为准。

配图：`../../src/assets/images/rebuilding-blog/08-first-deployment-success.png`

图注：本地推送后，构建与部署都成功。

接着在 Safari 的 GitHub 编辑器里修改关于页，选择直接提交到 main。新提交再次触发同一条工作流，用线上关于页的新增段落确认更新。

配图：`../../src/assets/images/rebuilding-blog/11-commit-directly-to-main.png`

图注：网页提交也直接进入自动发布流程。

中文搜索“公众号”能找到这篇文章，手机菜单、明暗切换、文章图片和 RSS 也检查通过。

---

排版提示：本文件是正文稿。发布前把上述“配图/图注”转成编辑器中的图片与说明，复核代码块。平台尚未发布，原始事实以 `src/content/posts/rebuilding-blog.md` 为准。
