---
title: "Claude Code 最佳实践"
source: "Anthropic"
originalTitle: "Claude Code: Best practices for agentic coding"
originalUrl: "https://www.anthropic.com/engineering/claude-code-best-practices"
lang: "en"
stage: ["MVP", "Launch"]
tags: ["claude-code", "agentic-coding", "context", "workflow"]
date: 2026-05-20
summary: "Anthropic 工程团队公开的 Claude Code 内部用法合集。讲清楚 CLAUDE.md、计划模式、并行会话、验证回路这些是怎么在他们自己团队里运转的。"
status: "link-only"
---

## 这是什么

Anthropic 工程团队整理的一份 Claude Code 实用指南，原文为英文长文。讲他们内部是怎么把 Claude Code 编进真实代码库的——不是 demo 视角，是「我们每天都在用」的视角。

## 为什么值得读

大多数 AI 编程教程停在「问一句、得一段」。这篇直接跳过那一层，讨论的是：

- 怎么写 `CLAUDE.md`，让 agent 每次进项目都从相同的事实出发
- 什么时候用 Plan Mode，什么时候直接动手
- 怎么用 git worktree 跑并行会话不打架
- 验证回路（写代码 → 跑测试 → 看输出 → 改）为什么是 Claude Code 真正的杠杆点

## 我的注

> AI 编程的瓶颈不是模型有多强，是**上下文的工程化**。一个写得好的 `CLAUDE.md` 比换一个更强的模型更管用——这是 Founder OS 里「上下文层」的实操印证。

读完之后建议立刻做一件事：给你正在做的项目写一份 100 行以内的 `CLAUDE.md`，把架构事实、依赖偏好、不要做的事写进去。下次会话你会立刻感到差别。

## 原文

- 官方原文（英文）：<{{originalUrl}}>

## 版权声明

原作者 Anthropic。本页为非官方读书笔记 / 链接转发，不包含原文翻译。请直接阅读官方原文。
