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

待首次部署后补入实际提交、Actions 和线上检查结果。

截图中的序号保留实际操作顺序。授权页未成功截图，因此不补造第 02 张。
