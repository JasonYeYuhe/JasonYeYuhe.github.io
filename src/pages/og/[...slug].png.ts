import type { APIRoute } from "astro";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { getCollection } from "astro:content";
import { loadOgFont, ogTree, OG_SIZE, type OgInput } from "../../lib/og";

type Item = OgInput & { path: string };

export async function getStaticPaths() {
  const lib = await getCollection("library", (e) => !e.data.draft);
  const os = await getCollection("os", (e) => !e.data.draft);
  const wri = await getCollection("writing", (e) => !e.data.draft);

  const items: Item[] = [
    {
      path: "default",
      kicker: "FOUNDER OS · 2026",
      title: "把一线 AI 原始资料做成中文创始人可用的操作系统",
      meta: "Library · OS · Build · Writing",
    },
    ...lib.map((e) => ({
      path: `library/${e.id}`,
      kicker: `LIBRARY · ${e.data.source.toUpperCase()}`,
      title: e.data.title,
      meta: e.data.summary,
    })),
    ...os.map((e) => ({
      path: `os/${e.id}`,
      kicker: "FOUNDER OS",
      title: e.data.title,
      meta: e.data.subtitle ?? e.data.description,
    })),
    ...wri.map((e) => ({
      path: `writing/${e.id}`,
      kicker: `WRITING · ${e.data.kind.toUpperCase()}`,
      title: e.data.title,
      meta: e.data.subtitle ?? e.data.summary,
    })),
  ];

  return items.map((it) => ({ params: { slug: it.path }, props: it }));
}

export const GET: APIRoute = async ({ props }) => {
  const { kicker, title, meta } = props as unknown as Item;
  const font = await loadOgFont();
  const svg = await satori(ogTree({ kicker, title, meta }) as any, {
    ...OG_SIZE,
    fonts: [{ name: "serif", data: font, weight: 400, style: "normal" }],
  });
  const png = new Resvg(svg, { background: "#FAF7F0" }).render().asPng();
  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
