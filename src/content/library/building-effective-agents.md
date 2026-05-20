---
title: "构建有效的 AI 智能体"
source: "Anthropic"
originalTitle: "Building effective agents"
originalUrl: "https://www.anthropic.com/engineering/building-effective-agents"
lang: "en"
stage: ["MVP", "Launch", "Scale"]
tags: ["agents", "workflows", "architecture", "patterns"]
date: 2026-05-18
summary: "Anthropic 工程团队给「workflow」与「agent」划了一条清晰的线，并列出几种实战中真正有用的组合模式。是判断「这个场景该不该上 agent」的最快入门。"
status: "link-only"
---

## 这是什么

Anthropic 工程团队公开的一篇综述，回答两个问题：**什么算 agent，什么只是 workflow？哪些模式真正在产品里跑通了？**

文章把常见做法归为几种结构（链式 / 并行 / 路由 / 评估-修正 / 自治 agent），每种都说清楚适用场景与失败模式。

## 为什么值得读

很多团队一上来就奔「全自治 agent」，结果在简单场景上烧了一堆 token。这篇是反向的：**先 workflow，能用 workflow 解决的不要上 agent**。

读完你会有一个清单：

- 我这个场景需要 LLM 决策几步？
- 工具调用是固定流程还是真的需要 agent 自己决定路径？
- 失败时谁来兜底？

## 我的注

> agent 不是越自治越好，是**越可观测越好**。能用 workflow 拼出来的方案，往往比一个黑盒 agent 更稳、更便宜、更可调。

这与 Founder OS 里「自动化是 Launch 阶段的事」是同一回事——先把流程写下来，再决定要不要让 agent 跑。

## 原文

- 官方原文（英文）：<{{originalUrl}}>

## 版权声明

原作者 Anthropic。本页为非官方读书笔记 / 链接转发，不包含原文翻译。请直接阅读官方原文。
