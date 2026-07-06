import type { MetadataRoute } from "next";
import { getArticles } from "./_lib/spook";

// Blog sitemap, served at /blog/sitemap.xml. Set NEXT_PUBLIC_SITE_URL to your
// production origin (e.g. https://yoursite.com) so the URLs are absolute.
export const revalidate = 3600;

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com").replace(
  /\/$/,
  "",
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getArticles();
  return [
    {
      url: SITE_URL + "/blog",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...articles.map((a) => ({
      url: SITE_URL + "/blog/" + a.slug,
      lastModified: a.publishedAt ? new Date(a.publishedAt) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
