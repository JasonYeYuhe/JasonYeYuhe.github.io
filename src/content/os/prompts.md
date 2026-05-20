---
title: "可复制 Prompts"
subtitle: "把判断动作固定下来"
description: "配合 GUIDE 使用的 prompt 工具箱：反驳 idea、用户访谈、PMF 诊断等。"
order: 2
updated: 2026-05-21
---

这些 prompt 是为了把判断动作固定下来。请替换 `{idea}`、`{product}`、`{target_user}`、`{codebase}` 等占位符。

## 1. 反驳 idea

```text
请站在反对者角度审查这个创业 idea：

{idea}

请输出：
1. 这个 idea 最可能失败的 5 个原因
2. 每个原因对应的可验证反证
3. 类似产品或相邻市场的失败模式
4. 用户嘴上说想要、行为上却可能不需要的信号
5. 分发、采购、合规、替代方案里最可能成为障碍的部分

要求：不要安慰我，不要给泛泛建议。优先找让我停止或缩小投入的证据。
```

## 2. 用户访谈

```text
我想验证这个问题是否真实存在：

{problem}

目标用户：
{target_user}

请设计 5 个不诱导答案的用户访谈问题。

要求：
1. 不要问“你会不会用”
2. 多问过去行为，而不是未来意愿
3. 至少 2 个问题要验证付费或迁移成本
4. 给出每个问题背后要验证的假设
```

## 3. 砍 MVP scope

```text
这是我想做的 MVP：

{mvp_plan}

请把它切到只验证一个核心假设。

请输出：
1. 核心假设一句话
2. 必须保留的功能
3. 必须删除的功能
4. 可以暂缓的功能
5. 如果只能用 7 天做出来，最小版本是什么
6. 哪些功能看起来有用，但其实只是让 demo 更漂亮
```

## 4. 技术债 / 安全风险

```text
请审查这个产品方案或代码库：

{product_or_codebase}

上线前请列出：
1. 必须立即处理的安全风险
2. 可以接受但必须记录的技术债
3. 会在用户增长后放大的架构风险
4. 最小整改顺序
5. 哪些内容应该写入 CLAUDE.md / specs / decisions

要求：按严重程度排序，不要只给最佳实践清单。
```

## 5. PMF 信号

```text
这是产品和当前早期数据：

{product}
{early_signals}

请帮我区分真实 PMF 信号和早期热闹。

请输出：
1. 哪些信号可能只是 hype
2. 哪些信号更接近真实需求
3. 还缺哪些关键证据
4. 接下来两周应该跟踪的 5 个指标
5. 如果没有改善，应该调整、pivot，还是回到 Idea 阶段
```

## 6. Launch workflow

```text
请把这个 launch 后的反馈流程设计成 agentic workflow：

{launch_context}

请输出：
1. 输入源：用户反馈、CRM、analytics、support、社媒
2. 每天自动整理什么
3. 每周 founder 需要看什么
4. 哪些反馈进入 backlog
5. 哪些反馈需要触发用户回访
6. 最小可执行的文件/表格/自动化结构
```

## 7. Context layer 初始化

```text
请帮我为这个项目初始化一个 context layer：

{project_description}

请输出这些文件的初稿结构：
1. CLAUDE.md
2. specs/README.md
3. decisions/README.md
4. workflows/README.md
5. daily-log 模板

要求：这些文件要能帮助另一个 agent 在未来重新进入项目，而不是只给人看的文档。
```

