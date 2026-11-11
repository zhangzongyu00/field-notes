import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://zhangzongyu00.github.io/field-notes/",
    title: "折腾笔记",
    description: "记录技术实践、工具发现，以及值得分享的公开经验。",
    author: "zhangzongyu00",
    profile: "https://github.com/zhangzongyu00",
    ogImage: "default-og.jpg",
    lang: "zh-CN",
    timezone: "Asia/Shanghai",
    dir: "ltr",
  },
  posts: {
    perPage: 4,
    perIndex: 4,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: false,
    showArchives: true,
    showBackButton: true,
    editPost: {
      enabled: true,
      url: "https://github.com/zhangzongyu00/field-notes/edit/main/",
    },
    search: "pagefind",
    toc: true,
  },
  socials: [
    { name: "github", url: "https://github.com/zhangzongyu00/field-notes" },
  ],
  shareLinks: [
  ],
});
