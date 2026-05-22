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

// ---- CJK line-break (避头尾 / kinsoku) -----------------------------------
// Satori wraps purely by width and will happily drop a closing punctuation
// mark onto its own line. We pre-break the text ourselves: never start a line
// with closing punctuation, never end a line with opening punctuation.
const NO_LINE_START = "。，、；：？！）】」』〉》”’%·…〕｝";
const NO_LINE_END = "（【「『〈《“‘〔｛";

function isWide(ch) {
  const c = ch.codePointAt(0);
  return (
    (c >= 0x1100 && c <= 0x115f) ||
    (c >= 0x2e80 && c <= 0x303e) ||
    (c >= 0x3041 && c <= 0x33ff) ||
    (c >= 0x3400 && c <= 0x9fff) ||
    (c >= 0xf900 && c <= 0xfaff) ||
    (c >= 0xff00 && c <= 0xff60) ||
    (c >= 0xffe0 && c <= 0xffe6)
  );
}

function charW(ch, fs) {
  if (ch === " ") return fs * 0.3;
  return isWide(ch) ? fs * 1.0 : fs * 0.6;
}

const isLatin = (ch) => {
  const c = ch.codePointAt(0);
  return (c >= 0x30 && c <= 0x39) || (c >= 0x41 && c <= 0x5a) || (c >= 0x61 && c <= 0x7a);
};

// Tokenize so Latin words / numbers stay whole; each CJK char is its own token.
function tokenize(s) {
  const toks = [];
  let i = 0;
  while (i < s.length) {
    const ch = s[i];
    if (ch === " ") {
      toks.push(" ");
      i++;
    } else if (isLatin(ch)) {
      let j = i + 1;
      while (j < s.length && (isLatin(s[j]) || "._-/+&#".includes(s[j]))) j++;
      toks.push(s.slice(i, j));
      i = j;
    } else {
      toks.push(ch);
      i++;
    }
  }
  return toks;
}

const tokW = (t, fs) => [...t].reduce((a, c) => a + charW(c, fs), 0);

// Insert explicit \n at safe break points: never split a Latin word, never
// start a line with closing punctuation, never end a line with opening one.
function wrapCJK(text, fontSize, maxWidth) {
  const paras = norm(text).split("\n");
  const lines = [];
  for (const para of paras) {
    if (para === "") {
      lines.push("");
      continue;
    }
    let line = "";
    let w = 0;
    for (const tok of tokenize(para)) {
      const tw = tokW(tok, fontSize);
      if (tok === " ") {
        if (line === "") continue;        // swallow leading space
        if (w + tw > maxWidth) { lines.push(line); line = ""; w = 0; continue; }
        line += " ";
        w += tw;
        continue;
      }
      if (w + tw > maxWidth && line !== "") {
        if (tok.length === 1 && NO_LINE_START.includes(tok)) {
          line += tok;                    // keep closing punct (slight overflow)
          lines.push(line);
          line = "";
          w = 0;
          continue;
        }
        while (line.length && line[line.length - 1] === " ") line = line.slice(0, -1);
        let moved = "";
        while (line.length && NO_LINE_END.includes(line[line.length - 1])) {
          moved = line[line.length - 1] + moved;
          line = line.slice(0, -1);
        }
        lines.push(line);
        line = moved + tok;
        w = tokW(line, fontSize);
        continue;
      }
      line += tok;
      w += tw;
    }
    if (line !== "") lines.push(line);
  }
  return lines.join("\n");
}

// content box width = card - horizontal padding(90*2), minus a safety margin
const CONTENT_W = CARD_W - 180 - 24;

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
              whiteSpace: "pre-wrap",
            },
            children: wrapCJK(title, titleSize, CONTENT_W),
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
              whiteSpace: "pre-wrap",
            },
            children: wrapCJK(subtitle, 40, CONTENT_W),
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
            children: wrapCJK(body, bodySize, CONTENT_W),
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
            children: wrapCJK(body, bodySize, CONTENT_W),
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
