import type { ReactNode } from "react";
import "./blog.css";

// Wraps every /blog route. Importing blog.css here means copying this folder is
// all it takes to get the full styled blog — nothing to add to your global CSS.
// The `.blog-root` class scopes those styles so they never leak into the rest of
// your site. Delete this file if you'd rather style the blog yourself.
//
// If your site has a fixed header, add `blog-root--fixed-nav` so the sticky
// table of contents clears it on scroll (see `--blog-nav-offset` in blog.css).
export default function BlogLayout({ children }: { children: ReactNode }) {
  return <div className="blog-root">{children}</div>;
}
