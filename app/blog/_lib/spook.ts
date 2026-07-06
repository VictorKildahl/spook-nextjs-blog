import "server-only";

// Spook hosted-blog client. Fetches this site's published articles from Spook's
// read API and lets your Next.js app render them as a blog - no CMS, no database.
// Freshness is handled by Next.js ISR (see `revalidate` below): publish in Spook,
// and the new post appears on the next revalidation.
//
// Required env (server-side only - never prefix with NEXT_PUBLIC_):
//   SPOOK_BLOG_API_URL   the API base shown in your Spook publishing settings
//   SPOOK_BLOG_API_KEY   the API key you generated there

const API_BASE = (process.env.SPOOK_BLOG_API_URL ?? "").replace(/\/$/, "");
const API_KEY = process.env.SPOOK_BLOG_API_KEY ?? "";

// Re-fetch each post/list at most once an hour. Lower it for fresher updates.
const REVALIDATE_SECONDS = 3600;

export type BlogArticleSummary = {
  id: string;
  title: string;
  slug: string;
  teaser: string;
  metaTitle: string;
  metaDescription: string;
  featuredImageUrl: string | null;
  featuredImageAlt: string | null;
  publishedAt: string | null; // ISO-8601
};

export type BlogArticle = BlogArticleSummary & {
  featuredSnippet: string;
  contentHtml: string;
  contentMarkdown: string;
  faqs: { question: string; answer: string }[];
  language: string;
  url: string;
  author: string | null;
  structuredData: Record<string, unknown>;
  jsonLd: string;
};

export type BlogMeta = {
  name: string;
  domain: string;
  language: string;
};

async function feed(path: string): Promise<Response | null> {
  if (!API_BASE || !API_KEY) {
    throw new Error(
      "Set SPOOK_BLOG_API_URL and SPOOK_BLOG_API_KEY in your environment (see your Spook publishing settings).",
    );
  }
  try {
    return await fetch(`${API_BASE}${path}`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
      next: { revalidate: REVALIDATE_SECONDS },
    });
  } catch {
    return null;
  }
}

// All published articles, newest first (up to `limit`, max 100 per request).
export async function getArticles(limit = 100): Promise<BlogArticleSummary[]> {
  const res = await feed(`/blog/articles?limit=${limit}`);
  if (!res || !res.ok) return [];
  const data = (await res.json()) as { articles?: BlogArticleSummary[] };
  return data.articles ?? [];
}

// One published article by slug, or null if it doesn't exist / isn't published.
export async function getArticle(slug: string): Promise<BlogArticle | null> {
  const res = await feed(`/blog/articles/${encodeURIComponent(slug)}`);
  if (!res || !res.ok) return null;
  const data = (await res.json()) as { article?: BlogArticle };
  return data.article ?? null;
}

// Site name, domain, and language - handy for the blog header and RSS feed.
export async function getMeta(): Promise<BlogMeta | null> {
  const res = await feed(`/blog/meta`);
  if (!res || !res.ok) return null;
  return (await res.json()) as BlogMeta;
}

// A few other posts to show under an article ("Keep reading"). Newest first,
// excluding the one being viewed.
export async function getRelatedArticles(
  currentSlug: string,
  count = 3,
): Promise<BlogArticleSummary[]> {
  const articles = await getArticles(count + 1);
  return articles.filter((a) => a.slug !== currentSlug).slice(0, count);
}
