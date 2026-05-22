---
title: "Prompt 不是 Skill"
subtitle: "Prompt 像一次对话；Skill 像一份操作手册——让 AI 在重复任务里稳定复现你的工作方式。"
date: 2026-05-23
tags: ["skill", "agentic-engineering", "automation", "workflow", "codex"]
kind: "essay"
summary: "有朋友问：Skill 是不是就是收藏一段 prompt？不是。一个最小可用的 Skill 只需要一个文件夹 + 一个 SKILL.md。判断标准很简单：如果你会说「下次我还想让 AI 这样做」，它就值得被做成 Skill。"
xhs:
  style: light
  cards:
    - kind: quote
      body: |-
        Prompt 像一次对话。
        Skill 像一份操作手册。
      attribution: Prompt 不是 Skill
    - kind: content
      title: 1 · 最小可用
      body: |-
        一个最小可用的 Skill 只需要两样东西：

        一个文件夹；
        一个 SKILL.md。

        自己长期用就放 ~/.codex/skills/，项目专用就放项目里。
    - kind: content
      title: 2 · description 别写虚的
      body: |-
        最容易写虚的是 description。

        不要写「提升效率」「优化工作流」。

        要写清楚：输入是什么、要做什么、什么场景该用、最后交付什么。
    - kind: content
      title: 3 · 正文写 SOP，不写散文
      body: |-
        检查输入 → 检查敏感信息 → 定故事线 → 写文案 → 输出成品 → QA。

        细节太多就拆出去：references / scripts / assets。
    - kind: content
      title: 4 · 判断标准
      body: |-
        一个 Skill 好不好，不看写得多漂亮，看它能不能稳定交付、少犯错、少问废话。

        如果你会说「下次我还想让 AI 这样做」，它就值得被做成 Skill。
---

发了几篇关于 agent 工作流的东西之后，有朋友私聊问我：你说的 Skill 到底怎么做？是不是就是收藏一段 prompt？

我的理解是：不是。

Prompt 更像一次对话；Skill 更像一份操作手册。它不是让 AI「灵感爆发」，而是让 AI 在重复任务里**稳定复现你的工作方式**。

## 一个最小可用的 Skill

其实只需要两样东西：

1. 一个文件夹；
2. 一个 `SKILL.md`。

如果你只是自己长期使用，可以先放在 `~/.codex/skills/你的-skill-name/`。项目专用就放进项目里。想分享给朋友，再整理成 GitHub repo。

## description 是最容易写虚的地方

`SKILL.md` 最重要的是开头的 frontmatter：`name`（叫什么）和 `description`（什么时候该被调用）。

不要写「提升效率」「优化工作流」这种话。要写清楚：**输入是什么、要做什么、什么场景该用、最后要交付什么。**

比如我做的小红书发布包 Skill，description 不是「帮我做内容」，而是：把产品截图、设置流程截图、官方链接和草稿，整理成可以直接发布的小红书图文包。

## 正文写 SOP，不要写散文

```
1. 先检查输入素材
2. 检查截图里有没有敏感信息
3. 决定 6–8 张卡片的故事线
4. 写中文文案
5. 输出图片、caption、README、contact sheet 和 zip
6. 最后做 QA
```

细节太多就别全塞进 `SKILL.md`，拆出去：`references/` 放规则与清单，`scripts/` 放稳定动作，`assets/` 放模板素材。

最后一定要用**真实任务**测一遍。一个 Skill 好不好，不看它写得多漂亮，而看它能不能稳定交付、少犯错、少问废话。

---

我现在的判断标准很简单：

如果你会说「下次我还想让 AI 这样做」，那它就值得被做成 Skill。

当你把重复工作沉淀成 Skill，AI 就不只是临时回答问题，而是开始**继承你的工作方式**。这件事，和我在 [Founder OS](/os) 里说的「把判断变成系统」是同一个母题——Skill 是把判断固化下来的最小单位。
