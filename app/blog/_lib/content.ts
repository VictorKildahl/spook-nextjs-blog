// Pure, dependency-free helpers for turning Spook's article HTML into a richer
// reading experience: an auto-generated table of contents, anchor-linkable
// headings, and a reading-time estimate. Everything here is a plain function so
// the whole blog folder drops into any Next.js app with nothing to install.

export type TocItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&#x27;": "'",
  "&nbsp;": " ",
};

// Strip tags and decode the handful of entities `marked` emits, so heading text
// and word counts read as plain prose.
export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&#?[a-z0-9]+;/gi, (m) => ENTITIES[m.toLowerCase()] ?? m)
    .replace(/\s+/g, " ")
    .trim();
}

// URL-safe, human-readable slug. Unicode-aware so non-Latin titles still get a
// usable anchor rather than collapsing to an empty string.
export function slugify(text: string): string {
  return stripHtml(text)
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

// Inject stable `id`s onto every <h2>/<h3> in the article body and collect them
// into a table of contents. Returns both so the page renders the body and the
// TOC from a single, guaranteed-consistent pass. Ids are de-duplicated (`-2`,
// `-3`, …) so repeated headings still link correctly.
export function withHeadingIds(html: string): { html: string; toc: TocItem[] } {
  const toc: TocItem[] = [];
  const seen = new Map<string, number>();

  const withIds = html.replace(
    /<(h[23])((?:\s[^>]*)?)>([\s\S]*?)<\/\1>/gi,
    (match, tag: string, attrs: string, inner: string) => {
      const text = stripHtml(inner);
      if (!text) return match;

      // Respect an id the source already provided; otherwise derive one.
      const existing = /\sid\s*=\s*["']([^"']+)["']/i.exec(attrs);
      let id = existing ? existing[1] : slugify(text) || "section";
      const count = seen.get(id) ?? 0;
      seen.set(id, count + 1);
      if (count > 0) id = `${id}-${count + 1}`;

      toc.push({ id, text, level: tag.toLowerCase() === "h2" ? 2 : 3 });

      const cleanedAttrs = existing ? attrs.replace(existing[0], "") : attrs;
      return `<${tag} id="${id}"${cleanedAttrs}>${inner}</${tag}>`;
    },
  );

  return { html: withIds, toc };
}

// Rough reading-time estimate at ~200 words/minute, floored at 1 minute.
export function readingTimeMinutes(html: string): number {
  const words = stripHtml(html).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
