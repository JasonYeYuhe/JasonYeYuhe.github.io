// Shared OG-image helpers (Satori font cache + render).
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const FONT_URL =
  "https://cdn.jsdelivr.net/gh/notofonts/noto-cjk@main/Serif/SubsetOTF/SC/NotoSerifSC-Regular.otf";
const CACHE_PATH = ".cache/fonts/NotoSerifSC-Regular.otf";

let cached: ArrayBuffer | null = null;

export async function loadOgFont(): Promise<ArrayBuffer> {
  if (cached) return cached;
  if (existsSync(CACHE_PATH)) {
    const buf = readFileSync(CACHE_PATH);
    cached = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
    return cached;
  }
  const r = await fetch(FONT_URL);
  if (!r.ok) throw new Error(`OG font fetch failed: ${r.status}`);
  const ab = await r.arrayBuffer();
  mkdirSync(dirname(CACHE_PATH), { recursive: true });
  writeFileSync(CACHE_PATH, Buffer.from(ab));
  cached = ab;
  return ab;
}

export const OG_SIZE = { width: 1200, height: 630 } as const;

export const COLORS = {
  bg: "#FAF7F0",
  ink: "#1A1916",
  inkSoft: "#5C5447",
  muted: "#8A8174",
  accent: "#A0522D",
  rule: "#D9D0BE",
};

// ---- CJK line-break (避头尾) so Satori never drops a lone punctuation mark
// onto its own line, and never splits a Latin word mid-way.
const NO_LINE_START = "。，、；：？！）】」』〉》”’%·…〕｝";
const NO_LINE_END = "（【「『〈《“‘〔｛";
const isWide = (ch: string) => {
  const c = ch.codePointAt(0)!;
  return (
    (c >= 0x1100 && c <= 0x115f) || (c >= 0x2e80 && c <= 0x303e) ||
    (c >= 0x3041 && c <= 0x33ff) || (c >= 0x3400 && c <= 0x9fff) ||
    (c >= 0xf900 && c <= 0xfaff) || (c >= 0xff00 && c <= 0xff60) ||
    (c >= 0xffe0 && c <= 0xffe6)
  );
};
const isLatin = (ch: string) => {
  const c = ch.codePointAt(0)!;
  return (c >= 0x30 && c <= 0x39) || (c >= 0x41 && c <= 0x5a) || (c >= 0x61 && c <= 0x7a);
};
const charW = (ch: string, fs: number) => (ch === " " ? fs * 0.3 : isWide(ch) ? fs : fs * 0.6);
function tokenize(s: string): string[] {
  const toks: string[] = [];
  let i = 0;
  while (i < s.length) {
    const ch = s[i];
    if (ch === " ") { toks.push(" "); i++; }
    else if (isLatin(ch)) {
      let j = i + 1;
      while (j < s.length && (isLatin(s[j]) || "._-/+&#".includes(s[j]))) j++;
      toks.push(s.slice(i, j)); i = j;
    } else { toks.push(ch); i++; }
  }
  return toks;
}
const tokW = (t: string, fs: number) => [...t].reduce((a, c) => a + charW(c, fs), 0);
export function wrapCJK(text: string, fontSize: number, maxWidth: number): string {
  const lines: string[] = [];
  for (const para of String(text).split("\n")) {
    if (para === "") { lines.push(""); continue; }
    let line = "", w = 0;
    for (const tok of tokenize(para)) {
      const tw = tokW(tok, fontSize);
      if (tok === " ") {
        if (line === "") continue;
        if (w + tw > maxWidth) { lines.push(line); line = ""; w = 0; continue; }
        line += " "; w += tw; continue;
      }
      if (w + tw > maxWidth && line !== "") {
        if (tok.length === 1 && NO_LINE_START.includes(tok)) {
          line += tok; lines.push(line); line = ""; w = 0; continue;
        }
        while (line.length && line[line.length - 1] === " ") line = line.slice(0, -1);
        let moved = "";
        while (line.length && NO_LINE_END.includes(line[line.length - 1])) {
          moved = line[line.length - 1] + moved; line = line.slice(0, -1);
        }
        lines.push(line); line = moved + tok; w = tokW(line, fontSize); continue;
      }
      line += tok; w += tw;
    }
    if (line !== "") lines.push(line);
  }
  return lines.join("\n");
}

export type OgInput = {
  kicker: string;      // e.g. "LIBRARY · ANTHROPIC"
  title: string;       // big title
  meta?: string;       // optional one-line meta under title
};

export function ogTree(input: OgInput) {
  return {
    type: "div",
    props: {
      style: {
        width: `${OG_SIZE.width}px`,
        height: `${OG_SIZE.height}px`,
        background: COLORS.bg,
        display: "flex",
        flexDirection: "column",
        padding: "70px 80px",
        fontFamily: "serif",
        color: COLORS.ink,
        position: "relative",
      },
      children: [
        {
          type: "div",
          props: {
            style: {
              fontSize: "22px",
              color: COLORS.muted,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontFamily: "serif",
            },
            children: input.kicker,
          },
        },
        {
          type: "div",
          props: {
            style: {
              fontSize: input.title.length > 24 ? "60px" : "78px",
              lineHeight: 1.15,
              marginTop: "40px",
              maxWidth: "1040px",
              fontFamily: "serif",
              color: COLORS.ink,
              whiteSpace: "pre-wrap",
            },
            children: wrapCJK(input.title, input.title.length > 24 ? 60 : 78, 1010),
          },
        },
        ...(input.meta
          ? [
              {
                type: "div",
                props: {
                  style: {
                    fontSize: "26px",
                    color: COLORS.inkSoft,
                    marginTop: "28px",
                    maxWidth: "1040px",
                    fontFamily: "serif",
                    whiteSpace: "pre-wrap",
                  },
                  children: wrapCJK(input.meta, 26, 1010),
                },
              },
            ]
          : []),
        {
          type: "div",
          props: {
            style: {
              marginTop: "auto",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              fontSize: "22px",
              color: COLORS.muted,
              fontFamily: "serif",
              borderTop: `1px solid ${COLORS.rule}`,
              paddingTop: "24px",
            },
            children: [
              {
                type: "div",
                props: {
                  style: { color: COLORS.ink, fontSize: "26px" },
                  children: "Jason Ye · Founder OS",
                },
              },
              {
                type: "div",
                props: {
                  children: "jasonyeyuhe.github.io",
                },
              },
            ],
          },
        },
      ],
    },
  };
}
