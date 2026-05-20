---
title: "MCP · Model Context Protocol"
source: "Anthropic / open spec"
originalTitle: "Model Context Protocol"
originalUrl: "https://modelcontextprotocol.io"
lang: "en"
stage: ["MVP", "Launch", "Scale"]
tags: ["mcp", "protocol", "agents", "tools"]
date: 2026-05-19
summary: "Anthropic 主导、面向开放的「让 AI agent 连接工具与数据源」的协议。理解 MCP 是把 agent 从演示变成产品的关键一环。"
status: "link-only"
---

## 这是什么

一个开放协议，规定 AI agent 怎么以一致方式接上外部工具与数据源（你的 GitHub、本地文件、数据库、Slack、Gmail……）。不是 SDK，不是产品，是一份**接口约定**。

任何一端实现了 MCP server，任何 MCP-aware 的 agent 都能即插即用地用它——而不需要重写胶水代码。

## 为什么值得读

如果你想做的不是聊天 demo，而是**让 agent 真正进入工作流**，那么早晚要回答两个问题：

- 我的 agent 怎么访问我已有的工具与数据？
- 别人怎么以最小成本接入我做的东西？

MCP 给的是统一答案。Claude Code、Claude Desktop、越来越多的 agent runtime 都直接消费 MCP server——意味着你写一次 server，多端复用。

## 我的注

> 工具能力的「碎片化集成」是 agent 产品化最大的隐性成本。MCP 把这部分变成基础设施。值得花一个下午读 spec、跑一个最小 server 例子，理解它的边界。

## 原文

- 官方网站：<{{originalUrl}}>
- 规范：<https://spec.modelcontextprotocol.io>

## 版权声明

协议为开放规范；本页为非官方导读，仅链接官方资源。
