# 折腾笔记使用说明

博客：<https://zhangzongyu00.github.io/field-notes/>

仓库：<https://github.com/zhangzongyu00/field-notes>

## 认证与换设备

**博客和仓库属于 GitHub 账号，Device Activation 不会把它们绑定到某台电脑。**

| 使用方式             | 需要什么                                         |
| -------------------- | ------------------------------------------------ |
| 阅读公开博客         | 不需要登录                                       |
| 在浏览器编辑仓库文章 | 在浏览器登录拥有写入权限的 GitHub 账号           |
| 在终端推送本地修改   | 在这台电脑完成 Git 或 GitHub CLI 的认证          |
| 本地预览页面         | 安装 Node.js `24.22.2`、pnpm `11.3.0` 并安装依赖 |

`Device Activation` 是命令行登录的确认流程。终端取得一次性临时代码，用户在 `https://github.com/login/device` 输入代码并确认账号和授权，GitHub CLI 再取得访问凭据并保存在发起登录的电脑上。这个过程不要求浏览器和终端位于同一台设备。

设备码默认 15 分钟过期，超时后重新发起即可。成功页里的 “Your device is now connected” 表示这次 CLI 登录已授权，不是将电脑永久登记为仓库的专用设备。

这次 macOS 的 CLI 凭据已存储在系统钥匙串中。换电脑不会自动迁移这个本机凭据；在新电脑重新登录同一账号即可。浏览器登录和终端登录互相独立。

在新电脑安装 Git 和 GitHub CLI 后：

```bash
gh auth login --hostname github.com --git-protocol https --web --scopes workflow
gh auth status
gh auth setup-git
git clone https://github.com/zhangzongyu00/field-notes.git
```

`gh auth setup-git` 会设置 Git 的凭据助手，让普通 `git push` 使用 CLI 的认证信息；只有浏览器写作时不需要运行这些终端命令。`workflow` 权限用于修改 GitHub Actions 工作流。多台电脑可以分别登录，不需要新建仓库或 Pages。

当前电脑已完成 CLI 登录。此前搭建使用了仅本次 Git 命令生效的凭据助手；若普通 `git push` 提示认证，可按需执行 `gh auth setup-git`。

访问凭据失效时用 `gh auth status` 检查，重新登录。不要把访问令牌放进文章或仓库。GitHub 账号设置中的 Applications 可以管理和撤销 CLI 的 OAuth 授权。

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

克隆公开仓库不需要写入权限，推送时需要完成上面的终端认证。

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

## 本地预览

在仓库目录运行：

```bash
nvm install 24.22.2
nvm use 24.22.2
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

没有 nvm 时，用当前系统的安装方式安装同版本 Node.js 即可。访问终端提示的地址并加上 `/field-notes/`，通常是 `http://localhost:4321/field-notes/`。

需要检查中文全文搜索时：

```bash
pnpm build
pnpm preview
```

`pnpm` 命令不可用时可用 `corepack pnpm` 代替。只在本地预览时无需 GitHub 登录。

## 图片保存在哪里

本次使用仓库内图片，没有使用外部图床。

原始 PNG 位于 `src/assets/images/<文章标识>/`，和 Markdown 母稿一起提交。Astro 构建时把文章图片优化为 WebP，生成在 `dist/_astro/`，再随页面部署到 GitHub Pages。

读者加载的是博客域名下的 `/field-notes/_astro/...webp`，原始图片则保留在仓库。更新原图后提交到 `main`，工作流会重新生成和发布；手动修改 `dist` 没有意义，因为下次构建会重新生成它。

平台分发使用同一批原图，再上传到公众号或小红书的编辑器。平台上传的图片不会被本站的后续构建自动替换。

## 平台稿从母稿整理

每篇需要分发的文章创建 `distribution/<文章标识>/`：

- `wechat.md`：适合公众号的正文，保留完整步骤与说明。用 Markdown 排版工具转换后，上传图片并检查代码块和表格。
- `xiaohongshu.md`：图文笔记正文、配图顺序和每张图的文字；根据当前平台限制调整长度。
- `README.md`：记录对应母稿、版本和平台发布时间/地址。

平台稿不参与博客构建。这套流程整理真实内容；各平台不会自动跟随博客更新，暂未配置自动外发。

## 发布失败怎么办

在 Actions 打开失败运行和失败步骤。常见原因是 frontmatter 日期格式不正确、引用的图片文件不存在或依赖问题。修复后提交到 `main` 即可重新发布。

Pages 设置的 **Build and deployment → Source** 应为 **GitHub Actions**。项目站点的 `base` 是 `/field-notes`，更换仓库名或域名时要一并调整 `astro.config.ts` 和 `astro-paper.config.ts`，并核对图片、RSS、搜索、站点地图及内部链接。

## 参考资料

- [GitHub CLI 登录与凭据保存](https://cli.github.com/manual/gh_auth_login)
- [GitHub Device flow](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps#device-flow)
