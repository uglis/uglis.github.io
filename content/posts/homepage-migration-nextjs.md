---
title: 个人主页迁移：从静态 HTML 到 Next.js App Router + RSC
date: 2026-05-11
slug: homepage-migration-nextjs
summary: 把个人主页从手写 HTML + JSON 数据驱动架构，完整迁移到 Next.js 15 App Router + RSC 技术栈，实现服务端渲染、ISR、Markdown 直读文件系统。
tags:
  - Next.js
  - React
  - RSC
  - 前端
  - 建站
---

## 起点

旧版个人主页的架构：

```
index.html          ← 手写 HTML
post.html           ← 文章详情（前端 fetch JSON + 渲染）
posts.html          ← 文章列表（前端搜索 + 标签筛选）
moments.html        ← 动态时间线
admin.html          ← 管理后台
styles.css          ← 1100 行手写 CSS（含 light/dark 主题）
script.js           ← 650 行 JS（主题切换、markdown 渲染、lightbox、滚动动画）
data/posts.json     ← 文章索引 + 全文嵌入
data/moments.json   ← 动态数据
```

这个架构的问题是：

1. **所有内容靠浏览器 fetch 再渲染**——SEO 几乎为零
2. **script.js 里手写了一个 markdown 解析器**——200 多行正则，代码块、嵌套列表都得自己处理
3. **发布流程依赖本地 Python 脚本**——写完 markdown，跑脚本更新 JSON，再 git push
4. **1100 行 CSS 全是手写**——颜色变量散落各处，响应式靠媒体查询硬扛

## 目标架构

迁移到 Next.js 15 App Router + RSC：

```
app/
├── layout.tsx              ← RSC 根布局（服务端渲染）
├── page.tsx                ← 首页（直接读文件系统，零客户端 JS）
├── globals.css             ← Tailwind v4 + CSS 变量主题
├── posts/
│   ├── page.tsx            ← 文章列表（RSC + ISR 1h）
│   ├── posts-filter.tsx    ← 搜索/筛选（唯一的客户端岛屿）
│   └── [slug]/
│       └── page.tsx        ← 文章详情（generateStaticParams + SSG）
├── moments/
│   └── page.tsx            ← 动态页（RSC + ISR）
├── moments.client.tsx      ← 动态渲染（客户端组件）
├── admin/                  ← 管理后台（客户端组件）
└── api/publish/            ← 发布 API（Server Route）

lib/
├── posts.ts                ← gray-matter 解析 markdown frontmatter
└── moments.ts              ← 读取 moments.json

components/
├── header.tsx, footer.tsx
├── theme-provider.tsx      ← next-themes 无闪烁主题切换
├── markdown-body.tsx       ← marked 服务端渲染 markdown
├── scroll-reveal.tsx       ← IntersectionObserver 滚动动画
└── lightbox.tsx            ← 图片灯箱
```

## 关键技术决策

### 服务端直接读文件系统

不再需要 JSON 中间层。文章是 `.md` 文件，RSC 里直接用 `fs.readFileSync` + `gray-matter` 解析 frontmatter，`marked` 把正文转成 HTML。整个流程在构建时完成，浏览器收到的是完整 HTML。

```typescript
// lib/posts.ts — 数据层
export async function getAllPosts(): Promise<Post[]> {
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"));
  return files.map((file) => {
    const raw = fs.readFileSync(path.join(postsDir, file), "utf-8");
    const { data, content } = matter(raw);   // gray-matter
    return { slug: data.slug, title: data.title, content, ... };
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
```

### ISR — 增量静态再生成

博客更新频率低，全量 SSG 就够了。设 1 小时 revalidate：

```typescript
export const dynamic = "force-static";
export const revalidate = 3600;
```

新文章发布后，下一次请求触发后台重新生成，旧页面瞬间返回。Vercel 免费额度绰绰有余。

### 客户端岛屿精确隔离

整个站只有三处 `"use client"`：

- **搜索/标签筛选** — 需要用户输入和状态管理
- **主题切换按钮** — 需要读取浏览器 localStorage
- **动态渲染（moments.client.tsx）** — 需要展开/收起交互

其他所有内容都在服务端渲染成 HTML，发到浏览器就是零 JS 的静态页面。这是 RSC 的核心价值——把交互边界控制在最小粒度。

### Tailwind v4 的 CSS-first 配置

不再需要 `tailwind.config.ts`，主题变量直接写在 CSS 里：

```css
@import "tailwindcss";
@theme {
  --color-bg: #0d1117;
  --color-accent-green: #3fb950;
  --font-mono: "JetBrains Mono", monospace;
}
```

配合 `@custom-variant` 实现 light/dark 主题，`next-themes` 控制 DOM 属性切换，无闪烁。

## 构建产物对比

| | 旧站 | 新站 |
|---|---|---|
| HTML 页面 | 5 个手写文件 | 14 个自动生成 |
| JS 体积 | 650 行（~18KB） | 仅交互岛屿（~3KB first load） |
| Markdown 渲染 | 浏览器端手写解析器 | marked 服务端执行 |
| SEO | 无（fetch 加载内容） | 完整 HTML 直出 |
| 部署 | 手动 push | Vercel 自动触发 |
| 发布文章 | Python 脚本 → 更新 JSON → push | Markdown 文件 → push |

## 总结

迁移的核心收益不是"用了新框架"，而是把内容的产出路径从 `写文章 → 更新 JSON → 手动部署` 简化成了 `写文章 → push`。RSC + Vercel 的组合让博客重新回到了"静态站点"的简单性，但保留了动态站点的开发体验。
