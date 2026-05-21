# JasonYeYuhe.github.io

Personal site of Jason Ye — 中文 AI builder · Founder OS.

**Live**: https://jasonyeyuhe.github.io

资料库（一线官方资料的中文注解）· Founder OS 方法论 · 项目 · 手记。

## 栈

- [Astro](https://astro.build)（静态输出）+ [Tailwind CSS v4](https://tailwindcss.com) + MDX + Sitemap
- 内容走 Astro Content Collections（zod schema 校验）
- [Satori](https://github.com/vercel/satori) + [resvg](https://github.com/yisibl/resvg-js)：构建时生成 OG 图与小红书卡片
- 部署：GitHub Actions → GitHub Pages

## 本地

```bash
npm install
npm run dev          # http://localhost:4321
npm run build        # 构建（含 OG 图生成）
npm run preview
npm run new          # 脚手架新建内容（见下）
npm run xhs -- <md>  # 渲染一篇帖子的小红书卡片
```

## 结构

```
src/
  layouts/Base.astro          # head meta + OG + JSON-LD + analytics
  components/                 # Header / Footer / Analytics
  lib/og.ts                   # OG 图模板 + 字体缓存
  analytics.config.ts         # 统计开关（默认 none）
  pages/
    index / about / now / 404
    library/  {index,[slug]}   # 资料库
    os/       {index,prompts}  # Founder OS：GUIDE + PROMPTS
    build/    index            # 项目（构建时拉 GitHub stars）
    writing/  {index,[...slug]}# 手记
    og/[...slug].png.ts        # 动态 OG 图端点
    rss.xml.ts                 # 合并 RSS（library + writing）
  content/{library,os,projects,writing}/*.md
  content.config.ts           # 集合 schema
  styles/global.css           # 设计 tokens（@theme）+ prose-zh
scripts/
  xhs.mjs                     # Markdown → 小红书 1080×1440 卡片
  new.mjs                     # 新建 library / writing 条目
```

## 设计

「学术克制」：衬线标题（Source Serif 4 + Songti SC fallback）、Inter 正文、暖白底、单一强调色（terracotta），用横线分隔代替卡片阴影。

## 加一条资料库

```bash
npm run new -- library "标题"
```

frontmatter 关键字段：`title / source / originalUrl / stage[] / tags[] / date / summary / status(notes|link-only|translation)`。

> 资料库只放**摘要 + 我的注解 + 官方原文链接**；完整翻译走对应 GitHub repo，不在本站托管。

## 写一篇手记（可选带小红书卡片）

```bash
npm run new -- writing "标题"
```

带卡片的 frontmatter：

```yaml
xhs:
  style: light            # light | dark
  cards:
    - kind: quote          # quote | content
      body: |-
        大引言
      attribution: 出处
    - kind: content
      title: 1 · 小标题
      body: |-
        正文（多行）
```

`npm run xhs -- src/content/writing/<slug>.md` → 输出到 `dist-xhs/<slug>/`。

## 统计

编辑 `src/analytics.config.ts`，把 `provider` 从 `none` 换成 `plausible` / `umami` / `goatcounter`。无 cookie。

## 版权

站点代码 MIT。站内引用的第三方原作版权归各原作者所有；资料库为非官方注解，仅供学习交流，收到权利人请求即删。
