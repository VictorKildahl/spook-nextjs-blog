import type { Metadata } from "next";
import { getArticles } from "./_lib/spook";
import { PostCard } from "./_components/post-card";
import { Pagination } from "./_components/pagination";

// Blog index. Revalidated hourly (see _lib/spook.ts) so newly published articles
// appear without a redeploy.
export const revalidate = 3600;

// Posts per page in the list.
const PAGE_SIZE = 9;

export const metadata: Metadata = {
  title: "Blog",
  description: "Latest articles.",
};

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const articles = await getArticles();

  const totalPages = Math.max(1, Math.ceil(articles.length / PAGE_SIZE));
  const current = Math.min(Math.max(1, Number(page) || 1), totalPages);
  const start = (current - 1) * PAGE_SIZE;
  const pageArticles = articles.slice(start, start + PAGE_SIZE);

  return (
    <main className="blog-page">
      <header>
        <p className="blog-eyebrow">Blog</p>
        <h1 className="blog-title">Latest articles</h1>
        <p className="blog-lead">
          Guides, updates, and notes — published straight from Spook.
        </p>
      </header>

      {articles.length === 0 ? (
        <p className="blog-empty">No posts yet — check back soon.</p>
      ) : (
        <>
          <ul className="blog-grid">
            {pageArticles.map((a) => (
              <PostCard key={a.id} article={a} />
            ))}
          </ul>
          <Pagination currentPage={current} totalPages={totalPages} />
        </>
      )}
    </main>
  );
}
