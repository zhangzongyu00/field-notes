# 搭建记录

日期：2026-11-11。账号：`zhangzongyu00`。名称：**折腾笔记**。

- 新仓库：<https://github.com/zhangzongyu00/field-notes>（Public）
- Pages：<https://zhangzongyu00.github.io/field-notes/>
- 主题：AstroPaper `7.1.0`，上游提交 `6f61e2dc0e45bbcefc05f4055f293cd7f81bcb03`
- Node.js：`24.22.2`；pnpm：`11.3.0`
- 母稿：`src/content/posts/rebuilding-blog.md`
- 文章截图：`src/assets/images/rebuilding-blog/`

## 实际操作

1. 查看三个主题的真实演示，并按用户选择使用 AstroPaper。
2. 安装 GitHub CLI，完成设备授权；首轮超时，第二轮成功。不保存设备码和令牌。
3. 创建独立公开仓库，初始化主题和新的 Git 历史。
4. 修改中文界面、时区、首页、关于页、项目路径及编辑链接。
5. 清理主题示例内容，增加文章模板、平台稿目录和写作说明。
6. 设置 Pages `build_type=workflow`，增加 main push 自动发布工作流。

依赖安装初次使用本机 npm 镜像，部分版本清单未同步而失败；改用 npm 官方源，并在 `.npmrc` 固定官方源。

## 发布验证

| 入口                       | 实际提交                                   | Actions                                                                              | 结果                                             |
| -------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------ | ------------------------------------------------ |
| 本地初始化并 push main     | `87c79dca94a24f0777aafb7e88330868c4b5811c` | [42993066195](https://github.com/zhangzongyu00/field-notes/actions/runs/42993066195) | build、deploy 成功，线上首页和文章正常           |
| Safari 网页编辑并提交 main | `2eb95d2797c0bc52d5c388497140a32d0a5e969b` | [42993770224](https://github.com/zhangzongyu00/field-notes/actions/runs/42993770224) | build、deploy 成功，线上关于页出现“持续更新”段落 |

本地已用 `git pull --ff-only` 同步网页提交，验证两种编辑方式可交替使用。

检查通过：Astro 检查无错误或警告；静态构建、中文 Pagefind 索引生成；线上中文搜索“公众号”；手机导航菜单；明暗切换；文章图片、编辑链接、RSS、站点地图和项目路径前缀；无页面脚本错误。

初次构建和部署的总耗时为 49 秒。该记录描述这一次实际运行，不代表后续耗时承诺。

## 截图索引

以下截图都来自真实操作或真实页面，位于 `src/assets/images/rebuilding-blog/`：

| 文件                                       | 对应操作                                |
| ------------------------------------------ | --------------------------------------- |
| `01-theme-preview-in-safari.png`           | 查看原主题演示                          |
| `02-device-activation-complete.png`        | 用户补充的 Device Activation 授权成功页 |
| `03-create-repository-form.png`            | 新仓库名称与 Public 选项                |
| `04-repository-created.png`                | 新仓库创建结果                          |
| `05-pages-source-github-actions.png`       | Pages 发布源设为 GitHub Actions         |
| `06-local-blog-preview.png`                | 本地构建后的首页                        |
| `07-repository-files.png`                  | 初始化后的仓库目录                      |
| `08-first-deployment-success.png`          | 本地 push 触发的首次发布成功            |
| `09-live-blog-homepage.png`                | 线上博客首页                            |
| `10-edit-about-in-github.png`              | Safari 里实际编辑 about.md              |
| `11-commit-directly-to-main.png`           | 网页直接提交到 main                     |
| `12-browser-update-deployment-success.png` | 网页提交触发的发布成功                  |
| `13-live-about-after-browser-edit.png`     | 线上关于页出现新增段落                  |
| `15-first-post-card-user-capture.png`      | 用户补充的首次上线文章卡片              |

截图中的序号保留操作阶段。授权页当时未成功截图，随后用户提供真实成功页，作为第 02 张补入；用户提供的文章卡片作为第 15 张补入。临时设备码和访问令牌没有进入公开材料。

使用说明已补充 Device Activation 的含义、新电脑登录、日常发布、预览和仓库图片的处理方式；首篇文章内链接到这份完整文档。
