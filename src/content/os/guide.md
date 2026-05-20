---
title: "AI-native Founder OS"
subtitle: "把判断变成系统"
description: "Anthropic 官方 playbook 的注解版：四阶段 founder operating system。"
order: 1
updated: 2026-05-21
---

## 0. 一句话

AI-native founder 的稀缺能力，不是让 AI 更快写代码，而是把判断变成系统。

Anthropic 的官方 playbook 把创业过程重新拆成 Idea、MVP、Launch、Scale 四个阶段。我的读法是：这四个阶段不是“用 Claude 做更多事”的清单，而是一套 founder operating system 的骨架。

这套系统至少有五层：

- 判断：什么值得做，什么不该做。
- 验证：证据来自真实用户行为，而不是 demo 存在本身。
- 范围：MVP 只验证核心假设，不给未来制造债务。
- 上下文：人和 agent 需要共享长期记忆、规则和决策。
- 自动化：Launch 和 Scale 阶段，founder 从执行者变成调度者。

## 1. Startup lifecycle 被重写了

传统创业路径默认每进一阶段都要更多人、更多钱、更多专业职能。AI 改掉的是这个假设。

在 2026 年，AI 可以参与代码、市场研究、竞品分析、投资材料、文档、运营自动化。小团队甚至单人团队，可以在扩张团队之前先做出验证、收入和流程闭环。

但这不是“所有人都能轻松创业”的鸡血结论。更准确地说，AI 让执行成本下降，也让错误执行的速度变快。

**Jason note:**  
以前的问题是“我有没有能力做出来”。现在的问题是“我是否有足够证据值得做”。创业风险从工程能力转移到判断质量。

## 2. Founder 从 individual contributor 变成 orchestrator

官方 playbook 的一个关键变化是 founder 角色上移。过去 founder 经常被定义为“自己能做什么”：技术 founder 写代码，非技术 founder 做销售、运营、融资。

AI-native startup 里，founder 更像一个调度系统的人：

- 调度研究 agent，做用户、市场、竞品和反证。
- 调度 coding agent，把明确范围转成产品。
- 调度 workflow agent，处理 CRM、报告、文档、反馈、复盘。
- 调度自己的注意力，做只有 founder 能做的判断。

**Jason note:**  
这和个人指挥中心是同一个问题。不是一个模型做所有事，而是每个 agent 都知道上下文、边界、任务和验收标准。

## 3. Idea：不要先构建，先反驳

Idea 阶段的目标不是证明自己聪明，而是找到 problem-solution fit 的证据。

AI 最危险的用法，是让它帮你补强原来的直觉。你问它“这个 idea 为什么好”，它通常能找出很多支持材料。问题是，这不等于验证。

更好的用法是让 Claude 站到反方：

- 找这个 idea 最可能失败的原因。
- 找类似产品失败的案例。
- 找用户嘴上说想要、行为上却不付费的信号。
- 找分发、采购、合规、替代方案这些结构性障碍。

官方 playbook 提醒过一个风险：很多 startup 失败，是因为做了没人要的东西。AI 让 prototype 更容易，这个问题反而更隐蔽。

**Jason note:**  
1 小时跑出 demo，不等于验证。demo 是访谈道具，不是市场证据。

## 4. MVP：不是少功能，是最小可验证系统

MVP 阶段不是把完整产品做小一点，而是把验证核心假设所需的系统做出来。

要保留：

- 能验证需求是否真实的功能。
- 能验证用户是否愿意付费的路径。
- 能验证迁移成本和使用频率的关键体验。

要砍掉：

- nice-to-have。
- 炫技功能。
- 不影响验证的分支玩法。
- 只是让 demo 更漂亮的功能。

但 MVP 也不能忽视基础质量。AI-generated code 能跑，不代表安全、架构和技术债都可接受。技术债在 MVP 阶段可以存在，但必须被看见、被记录、被安排偿还。

**Jason note:**  
速度要服务验证，不要制造未来的债。MVP 的问题不是“能不能做快”，而是“能不能只做该做的”。

## 5. Context：上下文也是基础设施

官方 playbook 多次提到 persistent context。我的理解是：AI-native 公司不是只会 prompt，而是要建立人和 agent 能持续协作的上下文系统。

一个最小 context layer 可以包括：

- `CLAUDE.md`：项目规则、运行方式、权限边界、偏好。
- `specs/`：问题定义、范围、验收标准。
- `decisions/`：重要取舍、为什么这么做、未来不要重复争论什么。
- `workflows/`：用户访谈、发布、反馈、复盘、日报、周报如何跑。

**Jason note:**  
上下文不是文档洁癖。它是把一次性的判断变成复利资产。没有上下文，agent 会变成一次性劳动力；有上下文，agent 才能进入系统。

## 6. Launch：看 PMF 信号，不看热闹

Launch 阶段的目标不是“发布成功”，而是把早期 traction 变成可重复增长。

容易误判的信号：

- 朋友圈点赞。
- Hacker News / 小红书 / Twitter 短期热度。
- 用户说“很酷”但不回来。
- 试用很多但留存、付费、转介绍都弱。

更应该看：

- 留存是否来自真实需求，而不是 founder 手动维护。
- 用户是否愿意付费或付出迁移成本。
- 客户反馈是否指向同一个核心价值。
- 渠道是否可重复，而不是靠一次性曝光。

**Jason note:**  
Launch 阶段需要把 founder attention 替换成 workflow。CRM follow-up、feedback loop、release note、reporting、docs automation 都应该逐步系统化。

## 7. Scale：深度、可靠性和调度

Scale 阶段不是简单“做更多自动化”。它要求公司从早期 founder-led 系统，进入可被团队、agent 和流程共同维护的系统。

这个阶段的 founder 工作包括：

- 找到真正需要投入的深度能力。
- 把临时架构升级成可靠系统。
- 把安全、合规、可靠性变成产品工作流。
- 把 founder 脑内的判断写成组织上下文。
- 把增长从个人网络转成可重复的增长引擎。

**Jason note:**  
Scale 不是人变多，而是上下文、决策和自动化能承载更多复杂度。

## 8. Founder OS Checklist

每个项目启动时，先问：

- 这个 idea 的反证是什么？
- 我有没有真实用户行为，而不是只有 demo？
- MVP 只验证哪一个核心假设？
- 哪些功能必须砍掉？
- 技术债和安全风险有没有记录？
- `CLAUDE.md` 是否足够让 agent 重新进入项目？
- 关键决策有没有写进 `decisions/`？
- 用户反馈是否进入可追踪的 workflow？
- Launch 后看的 PMF 信号是什么？
- 哪些 founder attention 可以被 agentic workflow 替代？

## 9. 最后

AI-native founder 的稀缺能力，不是让 AI 更快写代码，而是把判断变成系统。

先验证，再构建。  
先砍范围，再提速。  
先沉淀上下文，再协作。  
先做闭环，再规模化。

