# uglis@home:~

林方浩的个人主页 — CLI-style geek portfolio，基于 Astro 构建，部署在 GitHub Pages。

**[uglis.github.io](https://uglis.github.io)**

## 技术栈

- **框架**: [Astro](https://astro.build) 5（静态输出）
- **交互**: React 19 islands（Terminal、DeskPet）
- **样式**: Tailwind CSS 4 + Catppuccin 双主题
- **内容**: Markdown（gray-matter） + JSON
- **部署**: GitHub Pages（GitHub Actions 自动构建）

## 本地开发

```bash
npm install
npm run dev        # http://localhost:4321
```

## 构建

```bash
npm run build      # 输出到 dist/
npm run preview    # 预览构建结果
```

## 部署

Push 到 `main` 分支，GitHub Actions 自动构建并部署到 `uglis.github.io`。

工作流文件：`.github/workflows/deploy.yml`

## 内容维护

### 添加文章

在 `content/posts/` 下新建 `.md` 文件：

```md
---
title: 文章标题
date: 2026-05-12
summary: 一句话摘要
slug: my-post-slug
tags:
  - 标签1
  - 标签2
cover: /photos/cover.jpg
---

正文内容（Markdown）
```

提交并 push 即可。

### 添加动态

编辑 `content/moments.json`，在数组开头插入：

```json
{
  "date": "2026-05-12",
  "text": "动态内容",
  "music": {
    "platform": "Apple Music",
    "title": "歌名",
    "url": "https://..."
  },
  "photo": {
    "src": "/photos/img.jpg",
    "alt": "图片描述"
  }
}
```

## 项目结构

```
├── astro.config.ts
├── content/
│   ├── posts/*.md          # 博客文章
│   └── moments.json        # 动态数据
├── public/
│   └── photos/             # 静态资源
├── src/
│   ├── components/
│   │   ├── *.astro         # Astro 静态组件
│   │   └── react/*.tsx     # React islands
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── lib/
│   │   ├── posts.ts        # 文章数据层
│   │   └── moments.ts      # 动态数据层
│   ├── pages/              # 路由页面
│   └── styles/
│       └── globals.css     # 全局样式（Tailwind + 主题）
└── .github/workflows/
    └── deploy.yml          # GitHub Pages 自动部署
```
