# 写作与发布

## 直接在 GitHub 写

修改现有文章时，可以点击博客文章底部的“编辑文章”，直接进入对应源文件。

1. 登录 `zhangzongyu00`，打开仓库的 `src/content/posts/`。
2. 打开已有 `.md` 文件，点击铅笔编辑；新文章用 **Add file → Create new file**，文件名如 `my-new-tool.md`。
3. 新文章复制 `templates/post.md` 的内容，修改标题、描述、发布时间和标签。
4. 确认发布时把 `draft: true` 改为 `draft: false`。
5. 点击 **Commit changes**，填写说明，并选择直接提交到 `main`。
6. 到 **Actions → Deploy blog to GitHub Pages** 查看本次运行，`build`、`deploy` 都成功后访问博客。

公开仓库里的草稿仍能被人从 GitHub 源码看到；`draft: true` 仅是不生成博客页面。未准备公开的材料请先保存在仓库之外。

## 在本地写

第一次使用：

```bash
git clone https://github.com/zhangzongyu00/field-notes.git
```

克隆公开仓库不需要写入权限。首次在一台电脑推送时，需要给终端授权；Safari 登录不会自动让终端登录。可以用 GitHub CLI 登录并按需配置 Git 的认证：

```bash
gh auth login
gh auth setup-git
```

当前搭建已完成 CLI 授权。若本机普通 `git push` 仍提示认证，可运行第二条命令。它会设置 Git 的凭据助手；搭建过程中使用了仅本次命令生效的助手，没有修改已有 Git 配置。

在仓库目录运行（不要对已有未提交工作直接覆盖）：

```bash
git pull --ff-only
cp templates/post.md src/content/posts/my-new-tool.md
```

编辑文章后，把需要发布的文件逐个加入提交：

```bash
git add src/content/posts/my-new-tool.md
git commit -m "记录新工具的使用体验"
git push origin main
```

网页更新和本地更新可以交替使用。本地编辑前先 `git pull --ff-only`；遇到冲突时先处理冲突再推送。

## 字段和图片

```yaml
---
title: "我试了一个新工具"
description: "记录使用场景、操作过程和实际体验。"
pubDatetime: 2026-11-11T08:00:00Z
modDatetime: 2026-11-12T08:00:00Z
draft: false
featured: false
tags: [工具, 折腾记录]
---
```

- `pubDatetime` 是首次发布时间，`Z` 表示 UTC；示例的 `08:00Z` 是北京时间 16:00。界面按 `Asia/Shanghai` 显示。
- 更新正文时保留首次时间，添加或修改 `modDatetime`。
- 未来时间的文章不会在当前构建中发布。到了那个时间也需要新的提交或手动运行工作流；本站没有定时发布任务。
- `featured: true` 会进入首页精选；`description` 用于列表、搜索摘要和分享信息。
- 文件名用稳定英文短名。平铺文章不要随意改名或改目录，以免旧地址失效。

图片放 `src/assets/images/my-new-tool/`，正文引用：

```markdown
![界面中已开启的新工具选项](@/assets/images/my-new-tool/01-options.png)
```

网页上传：进入对应图片目录，用 **Add file → Upload files** 上传图片，再编辑文章加入引用。首次建目录也可在上传界面把文件路径指定到目标目录。提交图片和正文后检查页面。

本地预览用 `pnpm dev`；中文全文搜索索引只在 `pnpm build` 后生成，用 `pnpm preview` 检查。

## 平台稿从母稿整理

每篇需要分发的文章创建 `distribution/<文章标识>/`：

- `wechat.md`：适合公众号的正文，保留完整步骤与说明。用 Markdown 排版工具转换后，上传图片并检查代码块和表格。
- `xiaohongshu.md`：图文笔记正文、配图顺序和每张图的文字；根据当前平台限制调整长度。
- `README.md`：记录对应母稿、版本和平台发布时间/地址。

平台稿不参与博客构建。这套流程整理真实内容；各平台不会自动跟随博客更新，暂未配置自动外发。

## 发布失败怎么办

在 Actions 打开失败运行和失败步骤。常见原因是 frontmatter 日期格式不正确、引用的图片文件不存在或依赖问题。修复后提交到 `main` 即可重新发布。

Pages 设置的 **Build and deployment → Source** 应为 **GitHub Actions**。项目站点的 `base` 是 `/field-notes`，更换仓库名或域名时要一并调整 `astro.config.ts` 和 `astro-paper.config.ts`，并核对图片、RSS、搜索、站点地图及内部链接。
