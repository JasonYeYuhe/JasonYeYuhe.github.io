#!/usr/bin/env node
/**
 * Render a Markdown post's frontmatter `xhs.cards[]` into 1080×1440 PNG cards
 * ready for 小红书. Reuses the same Noto Serif SC font as OG images.
 *
 * Usage:  npm run xhs -- src/content/writing/hello-this-site.md
 *         (outputs to dist-xhs/<slug>/01.png, 02.png, ...)
 */
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
} from "node:fs";
import { dirname, basename, join } from "node:path";
import matter from "gray-matter";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

const FONT_URL =
  "https://cdn.jsdelivr.net/gh/notofonts/noto-cjk@main/Serif/SubsetOTF/SC/NotoSerifSC-Regular.otf";
const FONT_CACHE = ".cache/fonts/NotoSerifSC-Regular.otf";

const CARD_W = 1080;
const CARD_H = 1440;

const COLORS = {
  bg: "#FAF7F0",
  ink: "#1A1916",
  inkSoft: "#5C5447",
  muted: "#8A8174",
  rule: "#D9D0BE",
};

async function loadFont() {
  if (existsSync(FONT_CACHE)) return readFileSync(FONT_CACHE);
  const r = await fetch(FONT_URL);
  if (!r.ok) throw new Error(`font fetch failed: ${r.status}`);
  const buf = Buffer.from(await r.arrayBuffer());
  mkdirSync(dirname(FONT_CACHE), { recursive: true });
  writeFileSync(FONT_CACHE, buf);
  return buf;
}

function cover({ brand, title, subtitle, idx, total }) {
  const titleSize = title.length > 14 ? 84 : title.length > 9 ? 100 : 120;
  return {
    type: "div",
    props: {
      style: {
        width: `${CARD_W}px`,
        height: `${CARD_H}px`,
        background: COLORS.bg,
        color: COLORS.ink,
        display: "flex",
        flexDirection: "column",
        padding: "110px 90px",
        fontFamily: "serif",
      },
      children: [
        {
          type: "div",
          props: {
            style: {
              fontSize: "30px",
              color: COLORS.muted,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
            },
            children: brand,
          },
        },
        {
          type: "div",
          props: {
            style: {
              fontSize: `${titleSize}px`,
              lineHeight: 1.18,
              marginTop: "60px",
              color: COLORS.ink,
              fontWeight: 400,
            },
            children: title,
          },
        },
        subtitle && {
          type: "div",
          props: {
            style: {
              fontSize: "40px",
              lineHeight: 1.5,
              marginTop: "40px",
              color: COLORS.inkSoft,
            },
            children: subtitle,
          },
        },
        {
          type: "div",
          props: {
            style: {
              marginTop: "auto",
              display: "flex",
              justifyContent: "space-between",
              fontSize: "26px",
              color: COLORS.muted,
              borderTop: `1px solid ${COLORS.rule}`,
              paddingTop: "30px",
            },
            children: [
              {
                type: "div",
                props: { children: "jasonyeyuhe.github.io" },
              },
              {
                type: "div",
                props: { children: `${idx}/${total}` },
              },
            ],
          },
        },
      ].filter(Boolean),
    },
  };
}

function content({ title, body, footer, idx, total }) {
  const bodySize = body.length > 220 ? 32 : body.length > 140 ? 38 : 44;
  return {
    type: "div",
    props: {
      style: {
        width: `${CARD_W}px`,
        height: `${CARD_H}px`,
        background: COLORS.bg,
        color: COLORS.ink,
        display: "flex",
        flexDirection: "column",
        padding: "110px 90px",
        fontFamily: "serif",
      },
      children: [
        title && {
          type: "div",
          props: {
            style: {
              fontSize: "30px",
              color: COLORS.muted,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            },
            children: title,
          },
        },
        {
          type: "div",
          props: {
            style: {
              fontSize: `${bodySize}px`,
              lineHeight: 1.55,
              marginTop: title ? "44px" : "0px",
              color: COLORS.ink,
              whiteSpace: "pre-wrap",
            },
            children: body,
          },
        },
        {
          type: "div",
          props: {
            style: {
              marginTop: "auto",
              display: "flex",
              justifyContent: "space-between",
              fontSize: "24px",
              color: COLORS.muted,
              borderTop: `1px solid ${COLORS.rule}`,
              paddingTop: "30px",
            },
            children: [
              {
                type: "div",
                props: { children: footer ?? "jasonyeyuhe.github.io" },
              },
              { type: "div", props: { children: `${idx}/${total}` } },
            ],
          },
        },
      ].filter(Boolean),
    },
  };
}

async function renderCard(tree, font) {
  const svg = await satori(tree, {
    width: CARD_W,
    height: CARD_H,
    fonts: [{ name: "serif", data: font, weight: 400, style: "normal" }],
  });
  return new Resvg(svg, { background: COLORS.bg }).render().asPng();
}

async function main() {
  const inFile = process.argv[2];
  if (!inFile) {
    console.error("usage: npm run xhs -- <markdown-file>");
    process.exit(1);
  }
  const md = readFileSync(inFile, "utf8");
  const { data } = matter(md);
  const slug = basename(inFile).replace(/\.mdx?$/, "");
  const cards = data?.xhs?.cards ?? [];
  if (!cards.length) {
    console.error(
      `no xhs.cards[] in ${inFile}\n` +
        `add e.g.:\n\nxhs:\n  cards:\n    - title: 1\n      body: ...\n`,
    );
    process.exit(1);
  }
  const font = await loadFont();
  const outDir = join("dist-xhs", slug);
  mkdirSync(outDir, { recursive: true });

  const all = [
    {
      kind: "cover",
      brand: "Jason Ye · Founder OS",
      title: data.title,
      subtitle: data.subtitle ?? data.summary ?? "",
    },
    ...cards.map((c) => ({
      kind: "content",
      title: c.title ?? "",
      // Allow both real newlines and \n escapes in YAML; normalise to \n.
      body: String(c.body ?? "").replace(/\\n/g, "\n"),
      footer: c.footer,
    })),
  ];

  for (let i = 0; i < all.length; i++) {
    const idx = i + 1;
    const total = all.length;
    const c = all[i];
    const tree =
      c.kind === "cover"
        ? cover({ brand: c.brand, title: c.title, subtitle: c.subtitle, idx, total })
        : content({ title: c.title, body: c.body, footer: c.footer, idx, total });
    const png = await renderCard(tree, font);
    const out = join(outDir, String(idx).padStart(2, "0") + ".png");
    writeFileSync(out, png);
    console.log("  ✓ wrote", out, `(${(png.length / 1024).toFixed(1)} KB)`);
  }
  console.log(`done · ${all.length} cards → ${outDir}/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
