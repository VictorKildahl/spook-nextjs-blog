# Spook blog for Next.js

A drop-in, batteries-included blog for the Next.js App Router, powered by
[Spook](https://tryspook.com). Spook hosts your articles and this folder renders
them — no CMS, no database, no webhooks. Publish in Spook, and posts appear on
your site automatically (via Next.js ISR).

**Copy one folder, set two env vars, done.** No extra npm packages to install —
styling ships with the folder, and the table of contents, FAQ accordion, and
everything else are plain React + a little CSS.

## Get the files

This repo is a copy-target: you drop the `app/blog` folder into your existing
Next.js App Router app (it's not a standalone runnable app). Grab it however you
like:

```bash
# Recommended — copies just the app/blog folder into your project:
npx degit VictorKildahl/spook-nextjs-blog/app/blog app/blog
```

Or clone the whole repo to browse, or download it as a ZIP from GitHub
(**Code → Download ZIP**) and copy `app/blog` out of it:

```bash
git clone https://github.com/VictorKildahl/spook-nextjs-blog.git
```

## What you get

- **`/blog`** — a paginated list of your published articles, as responsive cards
- **`/blog/[slug]`** — a full article page with:
  - **Auto-generated table of contents** with scroll-spy — sticky in a sidebar on
    desktop (beside the title, hero image, and body), always visible on mobile
    under a **Table of contents** heading; headings are anchor-linkable
  - **FAQ accordion** — accessible, animated, keyboard-friendly
  - **Reading time**, author, and publish date
  - **Share buttons** with SVG icons (copy link, X, LinkedIn) at the bottom of
    the article
  - **Related posts** ("Keep reading")
  - **Breadcrumbs** with `BreadcrumbList` structured data
  - SEO metadata + **Article / FAQ JSON-LD** (built by Spook)
- **`/blog/sitemap.xml`** — a sitemap of your posts
- **`/blog/rss.xml`** — an RSS 2.0 feed
- **Light theme** out of the box, scoped so it won't touch the rest of your site

## Folder layout

```
app/blog/
├── layout.tsx                  # imports blog.css, scopes styles to /blog
├── blog.css                    # self-contained styles (delete to use your own)
├── page.tsx                    # post list + pagination
├── [slug]/page.tsx             # the article page
├── rss.xml/route.ts            # RSS feed
├── sitemap.ts                  # /blog/sitemap.xml
├── _lib/
│   ├── spook.ts                # the Spook read-API client (the only Spook-specific file)
│   ├── content.ts              # heading ids + TOC + reading time (pure functions)
│   └── format.ts               # date / reading-time formatting
└── _components/
    ├── table-of-contents.tsx   # scroll-spy TOC (client)
    ├── faq.tsx                  # FAQ accordion (client)
    ├── share-buttons.tsx        # copy / social share with SVG icons (client)
    ├── article-body.tsx         # renders the article HTML
    ├── post-card.tsx            # a card in the list
    ├── pagination.tsx           # numbered pagination
    └── breadcrumbs.tsx          # breadcrumb trail
```

Folders prefixed with `_` are private (never routed by Next.js).

## Setup

1. **Turn on the integration in Spook.** In your site's **Publishing** settings,
   choose **NextJS** and click **Generate API key**. Copy the API base URL and key
   shown there.

2. **Copy this folder** into your project so you have `app/blog/…`.

3. **Add the credentials** to `.env.local` (keep them server-side — never prefix
   with `NEXT_PUBLIC_`):

   ```bash
   SPOOK_BLOG_API_URL=https://<your-deployment>.convex.site
   SPOOK_BLOG_API_KEY=spook_blog_xxxxxxxx
   ```

   Also set `NEXT_PUBLIC_SITE_URL` to your production origin (used by the blog
   sitemap and RSS feed), e.g. `NEXT_PUBLIC_SITE_URL=https://yoursite.com`.

4. **Run it:** `npm run dev`, then open `http://localhost:3000/blog`.

## Styling

Styling lives in `blog.css`, imported by `layout.tsx`, and is scoped under a
`.blog-root` wrapper so it never leaks into the rest of your site. Retheme the
whole blog by overriding the CSS custom properties at the top of that file (colors,
radius, measure, accent). Prefer your own system? Delete `blog.css` and `layout.tsx`
and style the `blog-*` class names — or swap `.blog-content` for `prose` if you use
[`@tailwindcss/typography`](https://github.com/tailwindlabs/tailwindcss-typography).

Featured images come from Spook as absolute URLs and render with a plain `<img>`,
so there's nothing to configure. To use `next/image` instead, add the image host to
`images.remotePatterns` in `next.config`.

### Fixed site header

If your site has a fixed navbar, add the `blog-root--fixed-nav` class in
`layout.tsx` so the sticky table of contents clears it when you scroll:

```tsx
<div className="blog-root blog-root--fixed-nav">{children}</div>
```

Tweak `--blog-nav-offset` in `blog.css` if your header is taller or shorter.

## How it stays fresh

Each request is cached and revalidated hourly (`revalidate = 3600` in the pages and
in `_lib/spook.ts`). Article pages are also pre-built at deploy time via
`generateStaticParams`; posts published later render on-demand and are then cached.
Lower `revalidate` for fresher updates, or wire up on-demand revalidation with
[`revalidatePath`](https://nextjs.org/docs/app/api-reference/functions/revalidatePath).

## API

The client in `_lib/spook.ts` talks to these endpoints (bearer token = your key):

| Method & path                | Returns                                       |
| ---------------------------- | --------------------------------------------- |
| `GET /blog/articles`         | `{ articles: Summary[], nextCursor }`         |
| `GET /blog/articles/{slug}`  | `{ article: Article }` (full body + JSON-LD)  |
| `GET /blog/meta`             | `{ name, domain, language }`                  |

Build something custom against these if you'd rather not use the starter pages.