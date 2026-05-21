#!/usr/bin/env node
/**
 * Scaffold a new content entry with correct frontmatter.
 *
 * Usage:
 *   npm run new -- library "标题" [slug]
 *   npm run new -- writing "标题" [slug]
 *
 * If no slug is given, one is derived from the ASCII in the title,
 * falling back to a date-based slug for all-CJK titles (rename freely).
 */
import { writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const today = new Date().toISOString().slice(0, 10);

function slugify(s) {
  const ascii = String(s)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
  return ascii;
}

function libraryTemplate(title) {
  return `---
title: "${title}"
source: "Anthropic"
originalTitle: ""
originalUrl: "https://"
lang: "en"
stage: ["MVP"]
tags: []
date: ${today}
summary: "一句话摘要，列表卡片会用到。"
status: "link-only"   # notes | link-only | translation
draft: true
---

## 这是什么

（用我自己的话概括它是什么、覆盖了什么。）

## 为什么值得读

（我的角度：谁该读、解决什么问题。）

## 我的注

> （一句话观点。）

## 原文

- 官方原文：<{{originalUrl}}>

## 版权声明

原作者版权所有。本页为非官方注解 / 链接转发，不含原文翻译。
`;
}

function writingTemplate(title) {
  return `---
title: "${title}"
subtitle: ""
date: ${today}
tags: []
kind: "essay"   # note | essay | xhs
summary: "一句话摘要。"
draft: true
# xhs:
#   style: light
#   cards:
#     - kind: quote
#       body: |-
#         大引言
#       attribution: 出处
#     - kind: content
#       title: 1 · 小标题
#       body: |-
#         正文
---

正文从这里开始。
`;
}

function main() {
  const [type, title, slugArg] = process.argv.slice(2);
  if (!["library", "writing"].includes(type) || !title) {
    console.error('usage: npm run new -- <library|writing> "标题" [slug]');
    process.exit(1);
  }
  let slug = slugArg ? slugify(slugArg) : slugify(title);
  if (!slug) slug = `${type === "writing" ? "post" : "entry"}-${today}`;

  const dir = join("src", "content", type);
  mkdirSync(dir, { recursive: true });
  const file = join(dir, `${slug}.md`);
  if (existsSync(file)) {
    console.error(`已存在：${file}（换个 slug，或手动编辑）`);
    process.exit(1);
  }
  const body = type === "library" ? libraryTemplate(title) : writingTemplate(title);
  writeFileSync(file, body);
  console.log(`✓ 新建 ${file}`);
  console.log(`  - 编辑它，把 draft 改成 false 后再 push`);
  if (!slugArg && !slugify(title)) {
    console.log(`  - slug 用了日期回退，需要的话直接重命名文件`);
  }
}

main();
