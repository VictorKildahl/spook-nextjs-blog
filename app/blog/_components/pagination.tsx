import Link from "next/link";

// Compact numbered pagination for the post list. Renders <Link>s to `?page=N`
// (page 1 links to the clean /blog URL). Server component — the list page reads
// the current page from searchParams and slices accordingly.
function pageHref(page: number): string {
  return page <= 1 ? "/blog" : `/blog?page=${page}`;
}

// Build a windowed sequence like [1, "…", 4, 5, 6, "…", 12] around the current
// page so long archives stay tidy.
function pageSequence(current: number, total: number): (number | "gap")[] {
  const pages = new Set<number>([1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

  const out: (number | "gap")[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) out.push("gap");
    out.push(p);
    prev = p;
  }
  return out;
}

export function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  return (
    <nav className="blog-pagination" aria-label="Pagination">
      {currentPage > 1 && (
        <Link href={pageHref(currentPage - 1)} rel="prev" aria-label="Previous page">
          ‹
        </Link>
      )}

      {pageSequence(currentPage, totalPages).map((item, i) =>
        item === "gap" ? (
          <span key={`gap-${i}`} className="blog-pagination-gap" aria-hidden="true">
            …
          </span>
        ) : item === currentPage ? (
          <span key={item} aria-current="page">
            {item}
          </span>
        ) : (
          <Link key={item} href={pageHref(item)} aria-label={`Page ${item}`}>
            {item}
          </Link>
        ),
      )}

      {currentPage < totalPages && (
        <Link href={pageHref(currentPage + 1)} rel="next" aria-label="Next page">
          ›
        </Link>
      )}
    </nav>
  );
}
