import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const items = await getCollection("library", (e) => !e.data.draft);
  return rss({
    title: "Jason Ye · Library",
    description: "一线 AI 资料的中文译本与注解。",
    site: context.site ?? "https://jasonyeyuhe.github.io",
    items: items
      .sort((a, b) => +b.data.date - +a.data.date)
      .map((entry) => ({
        title: entry.data.title,
        description: entry.data.summary,
        pubDate: entry.data.date,
        link: `/library/${entry.id}/`,
        categories: [...entry.data.stage, ...entry.data.tags],
      })),
    customData: `<language>zh-Hans</language>`,
  });
}
