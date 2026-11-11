# 折腾笔记

记录技术实践、工具发现，以及值得分享的公开经验。

- 博客：<https://zhangzongyu00.github.io/field-notes/>
- 首篇文章：<https://zhangzongyu00.github.io/field-notes/posts/rebuilding-blog/>
- 写作与发布说明：[docs/writing-and-publishing.md](docs/writing-and-publishing.md)
- 搭建与验证记录：[docs/setup-record.md](docs/setup-record.md)

## 写作目录

```text
src/content/posts/                 Markdown / MDX 文章母稿
src/content/pages/about.md         关于页
src/assets/images/<文章标识>/       文章截图与图片
distribution/<文章标识>/           公众号、小红书改编稿及分发记录
templates/post.md                  新文章模板（默认草稿）
docs/                             写作、维护和搭建说明
.github/workflows/deploy.yml       main 提交触发自动发布
astro-paper.config.ts              博客名称、描述、语言等
astro.config.ts                    Pages 地址前缀和 Astro 配置
src/components/、layouts/、pages/   主题组件和页面
public/                           图标、默认分享图片
pnpm-lock.yaml                    固定依赖版本
```

文章初期采用平铺目录，主题用 `tags` 表达，时间由 `pubDatetime` 表达。文件名就是稳定的文章标识，例如 `rebuilding-blog.md`。不要在发布后改文件名或移动到子目录：当前主题会把子目录加入文章 URL。改标题不会改变 URL。

## 两种更新方式

**网页：** 打开文章源文件 → 编辑 → 提交到 `main` → 在 Actions 查看发布结果。

**本地：** 修改文件 → `git add` 指定文件 → `git commit` → `git push origin main`。

保存本地文件或仅保存网页草稿不会发布。工作流还支持在 Actions 手动运行。构建失败时查看 Actions 日志并修复；上一次成功部署的站点继续服务。

## 本地预览

使用 Node.js `24.22.2`、pnpm `11.3.0`：

```bash
nvm install 24.22.2
nvm use 24.22.2
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

访问终端给出的 `/field-notes/` 地址。检查搜索需要构建后的预览：

```bash
pnpm build
pnpm preview
```

本地环境没有 `pnpm` 命令时，可用 `corepack pnpm` 代替。

## 内容与分发

以 `src/content/posts/` 的母稿和原始图片为内容来源，博客保留完整原文。公众号和小红书稿从母稿整理，放在 `distribution/`，不会被收录为博客文章。修改先回写母稿，再同步已经发布的平台版本。

主题来源：[AstroPaper](https://github.com/satnaing/astro-paper)，初始化使用上游版本 `7.1.0`、提交 `6f61e2dc0e45bbcefc05f4055f293cd7f81bcb03`。主题代码的原 MIT 许可保留于 [LICENSE](LICENSE)；原创文章和操作截图由作者保留权利。
