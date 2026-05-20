#!/usr/bin/env node
/**
 * Render a Markdown post's frontmatter `xhs.cards[]` into 1080×1440 PNG cards
 * ready for 小红书.
 *
 * Frontmatter shape:
 *   xhs:
 *     style: light|dark      # palette (default light)
 *     cards:
 *       - kind: content      # default; title + body
 *         title: ...
 *         body: ...
 *       - kind: quote        # large pull-quote with optional attribution
 *         body: ...
 *         attribution: ...
 *
 * Usage:  npm run xhs -- src/content/writing/<slug>.md
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

const PALETTES = {
  light: {
    bg:      "#FAF7F0",
    ink:     "#1A1916",
    inkSoft: "#5C5447",
    muted:   "#8A8174",
    rule:    "#D9D0BE",
    quote:   "#A0522D",   // accent — quotation mark color
  },
  dark: {
    bg:      "#15140F",
    ink:     "#F5F0E4",
    inkSoft: "#C9C0AE",
    muted:   "#8A8174",
    rule:    "#3A3527",
    quote:   "#D69A6B",
  },
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

const norm = (s) => String(s ?? "").replace(/\\n/g, "\n");

function base(c, idx, total) {
  return {
    width: `${CARD_W}px`,
    height: `${CARD_H}px`,
    background: c.bg,
    color: c.ink,
    display: "flex",
    flexDirection: "column",
    padding: "110px 90px",
    fontFamily: "serif",
  };
}

function footer(c, footerText, idx, total) {
  return {
    type: "div",
    props: {
      style: {
        marginTop: "auto",
        display: "flex",
        justifyContent: "space-between",
        fontSize: "26px",
        color: c.muted,
        borderTop: `1px solid ${c.rule}`,
        paddingTop: "30px",
      },
      children: [
        { type: "div", props: { children: footerText ?? "jasonyeyuhe.github.io" } },
        { type: "div", props: { children: `${idx}/${total}` } },
      ],
    },
  };
}

function cover({ brand, title, subtitle }, c, idx, total) {
  const t = norm(title);
  const titleSize = t.length > 14 ? 84 : t.length > 9 ? 100 : 120;
  return {
    type: "div",
    props: {
      style: base(c),
      children: [
        {
          type: "div",
          props: {
            style: {
              fontSize: "30px",
              color: c.muted,
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
              color: c.ink,
              fontWeight: 400,
            },
            children: t,
          },
        },
        subtitle && {
          type: "div",
          props: {
            style: {
              fontSize: "40px",
              lineHeight: 1.5,
              marginTop: "40px",
              color: c.inkSoft,
            },
            children: norm(subtitle),
          },
        },
        footer(c, undefined, idx, total),
      ].filter(Boolean),
    },
  };
}

function content({ title, body, footer: f }, c, idx, total) {
  const b = norm(body);
  const bodySize = b.length > 220 ? 32 : b.length > 140 ? 38 : 44;
  return {
    type: "div",
    props: {
      style: base(c),
      children: [
        title && {
          type: "div",
          props: {
            style: {
              fontSize: "30px",
              color: c.muted,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            },
            children: norm(title),
          },
        },
        {
          type: "div",
          props: {
            style: {
              fontSize: `${bodySize}px`,
              lineHeight: 1.55,
              marginTop: title ? "44px" : "0px",
              color: c.ink,
              whiteSpace: "pre-wrap",
            },
            children: b,
          },
        },
        footer(c, f, idx, total),
      ].filter(Boolean),
    },
  };
}

function quote({ body, attribution, footer: f }, c, idx, total) {
  const b = norm(body);
  const bodySize = b.length > 90 ? 52 : b.length > 50 ? 62 : 76;
  return {
    type: "div",
    props: {
      style: base(c),
      children: [
        {
          type: "div",
          props: {
            style: {
              fontSize: "200px",
              lineHeight: 0.6,
              color: c.quote,
              fontFamily: "serif",
              marginTop: "20px",
              marginBottom: "30px",
            },
            children: "“",
          },
        },
        {
          type: "div",
          props: {
            style: {
              fontSize: `${bodySize}px`,
              lineHeight: 1.4,
              color: c.ink,
              whiteSpace: "pre-wrap",
              marginTop: "10px",
            },
            children: b,
          },
        },
        attribution && {
          type: "div",
          props: {
            style: {
              fontSize: "32px",
              color: c.inkSoft,
              marginTop: "44px",
              display: "flex",
              flexDirection: "row",
            },
            children: `— ${norm(attribution)}`,
          },
        },
        footer(c, f, idx, total),
      ].filter(Boolean),
    },
  };
}

async function renderCard(tree, font, bg) {
  const svg = await satori(tree, {
    width: CARD_W,
    height: CARD_H,
    fonts: [{ name: "serif", data: font, weight: 400, style: "normal" }],
  });
  return new Resvg(svg, { background: bg }).render().asPng();
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
        `add e.g.:\n\nxhs:\n  style: light\n  cards:\n    - title: 1\n      body: ...\n`,
    );
    process.exit(1);
  }
  const style = data?.xhs?.style ?? "light";
  const c = PALETTES[style] ?? PALETTES.light;
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
    ...cards,
  ];

  for (let i = 0; i < all.length; i++) {
    const idx = i + 1;
    const total = all.length;
    const card = all[i];
    let tree;
    if (card.kind === "cover") {
      tree = cover(card, c, idx, total);
    } else if (card.kind === "quote") {
      tree = quote(card, c, idx, total);
    } else {
      tree = content(card, c, idx, total);
    }
    const png = await renderCard(tree, font, c.bg);
    const out = join(outDir, String(idx).padStart(2, "0") + ".png");
    writeFileSync(out, png);
    console.log("  ✓ wrote", out, `(${(png.length / 1024).toFixed(1)} KB, ${style})`);
  }
  console.log(`done · ${all.length} cards [${style}] → ${outDir}/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
