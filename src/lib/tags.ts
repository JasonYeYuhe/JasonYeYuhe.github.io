import { getCollection } from "astro:content";

export type TagItem = {
  type: "library" | "writing";
  id: string;
  title: string;
  href: string;
  date: Date;
  summary: string;
};

export const tagSlug = (t: string) => t.trim().toLowerCase();

/** tag-slug -> items (library + writing), each list sorted newest first */
export async function getTagMap(): Promise<Map<string, TagItem[]>> {
  const lib = await getCollection("library", (e) => !e.data.draft);
  const wri = await getCollection("writing", (e) => !e.data.draft);
  const map = new Map<string, TagItem[]>();
  const add = (tag: string, item: TagItem) => {
    const key = tagSlug(tag);
    if (!key) return;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(item);
  };
  for (const e of lib) {
    const item: TagItem = {
      type: "library",
      id: e.id,
      title: e.data.title,
      href: `/library/${e.id}`,
      date: e.data.date,
      summary: e.data.summary,
    };
    for (const t of e.data.tags) add(t, item);
  }
  for (const e of wri) {
    const item: TagItem = {
      type: "writing",
      id: e.id,
      title: e.data.title,
      href: `/writing/${e.id}`,
      date: e.data.date,
      summary: e.data.summary,
    };
    for (const t of e.data.tags) add(t, item);
  }
  for (const list of map.values()) list.sort((a, b) => +b.date - +a.date);
  return map;
}
