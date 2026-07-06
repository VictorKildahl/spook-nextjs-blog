import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticle, getArticles, getRelatedArticles } from "../_lib/spook";
import { readingTimeMinutes, withHeadingIds } from "../_lib/content";
import { formatDate, readingTimeLabel } from "../_lib/format";
import { ArticleBody } from "../_components/article-body";
import { Breadcrumbs } from "../_components/breadcrumbs";
import { Faq } from "../_components/faq";
import { PostCard } from "../_components/post-card";
import { ShareButtons } from "../_components/share-buttons";
import { TableOfContents } from "../_components/table-of-contents";

// Re-render each post at most hourly; publishing in Spook makes changes appear
// on the next revalidation.
export const revalidate = 3600;

// Pre-build a static page for every published post at build time. New posts
// published later are rendered on-demand and then cached (ISR).
export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: "Post not found" };

  const image = article.featuredImageUrl ?? undefined;
  return {
    title: article.metaTitle || article.title,
    description: article.metaDescription,
    alternates: { canonical: article.url },
    openGraph: {
      type: "article",
      title: article.metaTitle || article.title,
      description: article.metaDescription,
      url: article.url,
      publishedTime: article.publishedAt ?? undefined,
      authors: article.author ? [article.author] : undefined,
      images: image ? [image] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: article.metaTitle || article.title,
      description: article.metaDescription,
      images: image ? [image] : undefined,
    },
  };
}

// BreadcrumbList JSON-LD (the Article + FAQ JSON-LD comes ready-made from Spook
// as `article.jsonLd`). Serialized safely so a "</script>" in any label can't
// break out of the tag.
function breadcrumbJsonLd(origin: string, title: string, url: string): string {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: origin },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${origin}/blog` },
      { "@type": "ListItem", position: 3, name: title, item: url },
    ],
  };
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const related = await getRelatedArticles(slug);

  // One pass turns the raw body into anchor-linkable HTML and the TOC that
  // points at it, so the two can never drift apart.
  const { html, toc } = withHeadingIds(article.contentHtml);
  const minutes = readingTimeMinutes(article.contentHtml);
  const origin = (() => {
    try {
      return new URL(article.url).origin;
    } catch {
      return "";
    }
  })();

  return (
    <main className="blog-page">
      <div className="blog-article-layout">
        <div className="blog-article-main">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Blog", href: "/blog" },
              { name: article.title },
            ]}
          />

          <header className="blog-article-header">
            <h1 className="blog-article-title">{article.title}</h1>
            <div className="blog-article-meta">
              {article.publishedAt && (
                <time dateTime={article.publishedAt}>
                  {formatDate(article.publishedAt)}
                </time>
              )}
              {article.author && (
                <>
                  <span className="blog-dot" aria-hidden="true">
                    ·
                  </span>
                  <span>{article.author}</span>
                </>
              )}
              <span className="blog-dot" aria-hidden="true">
                ·
              </span>
              <span>{readingTimeLabel(minutes)}</span>
            </div>
          </header>

          {article.featuredImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className="blog-hero"
              src={article.featuredImageUrl}
              alt={article.featuredImageAlt ?? article.title}
            />
          )}

          <div className="blog-body">
            {/* Collapsible TOC for small screens; hidden ≥60rem. */}
            <TableOfContents items={toc} mobile />

            <ArticleBody html={html} />

            <Faq items={article.faqs} />
          </div>
        </div>

        {/* Sticky TOC sidebar for wide screens; hidden below 60rem. */}
        <aside className="blog-toc-sidebar">
          <TableOfContents items={toc} />
        </aside>
      </div>

      {related.length > 0 && (
        <section className="blog-related">
          <h2 className="blog-related-heading">Keep reading</h2>
          <ul className="blog-grid">
            {related.map((a) => (
              <PostCard key={a.id} article={a} />
            ))}
          </ul>
        </section>
      )}

      <ShareButtons url={article.url} title={article.title} />

      {/* Article + FAQ JSON-LD for rich results, pre-built + escaped by Spook. */}
      <div dangerouslySetInnerHTML={{ __html: article.jsonLd }} />

      {/* BreadcrumbList JSON-LD we assemble here. */}
      {origin && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: breadcrumbJsonLd(origin, article.title, article.url),
          }}
        />
      )}
    </main>
  );
}
