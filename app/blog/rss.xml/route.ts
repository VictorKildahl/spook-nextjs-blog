import { getArticles, getMeta } from "../_lib/spook";

// RSS 2.0 feed, served at /blog/rss.xml. Set NEXT_PUBLIC_SITE_URL to your
// production origin so item links are absolute. Revalidated hourly.
export const revalidate = 3600;

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com").replace(
  /\/$/,
  "",
);

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const [meta, articles] = await Promise.all([getMeta(), getArticles()]);
  const title = meta?.name ? `${meta.name} Blog` : "Blog";

  const items = articles
    .map((a) => {
      const link = `${SITE_URL}/blog/${a.slug}`;
      const pubDate = a.publishedAt
        ? new Date(a.publishedAt).toUTCString()
        : new Date().toUTCString();
      return `    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(a.teaser || a.metaDescription)}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${SITE_URL}/blog</link>
    <atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml" />
    <description>${escapeXml(`Latest articles from ${meta?.name ?? "our blog"}.`)}</description>
    <language>${escapeXml(meta?.language ?? "en")}</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
