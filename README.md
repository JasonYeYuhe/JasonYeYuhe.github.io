# JasonYeYuhe.github.io

Personal site of Jason Ye — 中文 AI builder · Founder OS.

**Live**: https://jasonyeyuhe.github.io

## 栈

- [Astro](https://astro.build) + [Tailwind CSS v4](https://tailwindcss.com) + MDX + Sitemap
- 内容用 Astro Content Collections（`src/content/library/`）
- 部署：GitHub Pages（Actions 自动构建）

## 本地

```bash
npm install
npm run dev      # http://localhost:4321
npm run build
npm run preview
```

## 结构

```
src/
  layouts/Base.astro          # HTML shell + head meta
  components/{Header,Footer}  # 全站头尾
  pages/                      # 路由
    index.astro               # 首页
    about.astro               # 关于
    now.astro                 # 最近在做（Now page）
    library/
      index.astro             # 资料库列表
      [slug].astro            # 单条资料详情
  content/library/*.md        # 资料条目（带 frontmatter）
  content.config.ts           # 集合 schema（zod 校验）
  styles/global.css           # 设计 tokens（@theme）+ prose-zh
```

## 设计

「学术克制」：衬线标题（Source Serif 4 + Songti SC fallback）、Inter 正文、暖白底、单一强调色（terracotta），用横线分隔代替卡片阴影。

## 加一条资料

在 `src/content/library/` 新建一个 `.md`，frontmatter 按 `content.config.ts` 中 schema 填；正文写注解。`git push` 自动部署。

## 版权

站点代码采用 MIT；引用的第三方原作版权归原作者所有，仅供学习交流。任何条目，收到权利人请求即删。
