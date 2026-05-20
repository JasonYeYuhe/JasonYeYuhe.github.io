import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const library = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/library" }),
  schema: z.object({
    title: z.string(),
    source: z.string(),           // 例如 "Anthropic / Claude"
    originalTitle: z.string().optional(),
    originalUrl: z.string().url(),
    lang: z.enum(["zh", "en", "bilingual"]).default("zh"),
    stage: z.array(z.string()).default([]),         // Idea / MVP / Launch / Scale
    tags: z.array(z.string()).default([]),
    date: z.coerce.date(),                           // 我整理/发布日期
    summary: z.string(),                             // 列表卡片用
    pdf: z.string().optional(),                      // 站内或外链 PDF
    repo: z.string().url().optional(),               // 对应 GitHub repo
    status: z.enum(["notes", "link-only", "translation"]).default("notes"),
    draft: z.boolean().default(false),
  }),
});

const os = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/os" }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    description: z.string(),
    order: z.number().default(99),
    updated: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
  schema: z.object({
    name: z.string(),
    oneLiner: z.string(),
    year: z.string(),                       // "2026" or "2025–2026"
    category: z.string(),                   // 例如 "Playbook" / "Tooling"
    metric: z.string().optional(),          // "GitHub · 36 页全译"
    url: z.string().url().optional(),
    repo: z.string().url().optional(),
    order: z.number().default(99),
    draft: z.boolean().default(false),
  }),
});

export const collections = { library, os, projects };
