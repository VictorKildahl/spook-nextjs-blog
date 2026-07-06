"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "../_lib/content";

// Auto-generated table of contents with scroll-spy: the heading currently in view
// is highlighted as you read. Ids are injected onto the headings by
// `withHeadingIds` (see _lib/content.ts), so the links here always resolve.
//
// Rendered twice by the article page: once as a sticky desktop sidebar, and once
// (with `mobile`) inline above the article body on narrow screens. CSS in
// blog.css shows the right one per breakpoint.
export function TableOfContents({
  items,
  mobile = false,
}: {
  items: TocItem[];
  mobile?: boolean;
}) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const headings = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => el !== null);
    if (headings.length === 0) return;

    // Track every heading; the topmost one that's intersecting (or the last one
    // scrolled past) wins. The rootMargin biases the "active" line toward the
    // upper third of the viewport so it flips at a natural reading position.
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        const firstVisible = headings.find((h) => visible.has(h.id));
        if (firstVisible) {
          setActiveId(firstVisible.id);
        } else {
          // Nothing intersecting (between headings) — keep the last one above.
          const scrolled = [...headings]
            .reverse()
            .find((h) => h.getBoundingClientRect().top < 120);
          if (scrolled) setActiveId(scrolled.id);
        }
      },
      { rootMargin: "-80px 0px -66% 0px", threshold: 0 },
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  const nav = (
    <nav className="blog-toc" aria-label="Table of contents">
      <p className="blog-toc-title">Table of contents</p>
      <ol>
        {items.map((item) => (
          <li key={item.id} data-level={item.level}>
            <a
              href={`#${item.id}`}
              aria-current={activeId === item.id ? "true" : undefined}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );

  if (mobile) {
    return <div className="blog-toc-mobile">{nav}</div>;
  }

  return nav;
}
