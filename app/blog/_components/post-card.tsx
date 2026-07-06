import Link from "next/link";
import type { BlogArticleSummary } from "../_lib/spook";
import { formatDate } from "../_lib/format";

// A single card in the post grid. Server component — no interactivity.
export function PostCard({ article }: { article: BlogArticleSummary }) {
  return (
    <li>
      <Link href={`/blog/${article.slug}`} className="blog-card">
        {article.featuredImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="blog-card-media"
            src={article.featuredImageUrl}
            alt={article.featuredImageAlt ?? article.title}
            loading="lazy"
          />
        )}
        <div className="blog-card-body">
          {article.publishedAt && (
            <time className="blog-card-date" dateTime={article.publishedAt}>
              {formatDate(article.publishedAt)}
            </time>
          )}
          <h2 className="blog-card-title">{article.title}</h2>
          <p className="blog-card-excerpt">
            {article.teaser || article.metaDescription}
          </p>
        </div>
      </Link>
    </li>
  );
}
