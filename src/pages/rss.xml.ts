import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const lib = await getCollection("library", (e) => !e.data.draft);
  const wri = await getCollection("writing", (e) => !e.data.draft);
  const libItems = lib.map((entry) => ({
    title: `[Library] ${entry.data.title}`,
    description: entry.data.summary,
    pubDate: entry.data.date,
    link: `/library/${entry.id}/`,
    categories: [...entry.data.stage, ...entry.data.tags],
  }));
  const wriItems = wri.map((entry) => ({
    title: entry.data.title,
    description: entry.data.summary,
    pubDate: entry.data.date,
    link: `/writing/${entry.id}/`,
    categories: [entry.data.kind, ...entry.data.tags],
  }));
  return rss({
    title: "Jason Ye · Founder OS",
    description: "一线 AI 资料的中文译本与注解、Founder OS 方法论、手记。",
    site: context.site ?? "https://jasonyeyuhe.github.io",
    items: [...libItems, ...wriItems].sort(
      (a, b) => +b.pubDate - +a.pubDate,
    ),
    customData: `<language>zh-Hans</language>`,
  });
}
