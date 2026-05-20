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
            },
            children: input.title,
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
                  },
                  children: input.meta,
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
