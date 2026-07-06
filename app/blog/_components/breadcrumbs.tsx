import Link from "next/link";

export type Crumb = { name: string; href?: string };

// Visual breadcrumb trail (Home / Blog / Article). The matching
// BreadcrumbList JSON-LD is emitted by the article page, so this is presentation
// only. The last crumb (no href) is marked as the current page.
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="blog-breadcrumb">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} aria-current={isLast ? "page" : undefined}>
              {item.href && !isLast ? (
                <Link href={item.href}>{item.name}</Link>
              ) : (
                <span>{item.name}</span>
              )}
              {!isLast && <span aria-hidden="true"> / </span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
