// Renders the article HTML (with heading ids already injected by withHeadingIds)
// into the `.blog-content` prose styles. Kept as its own component so the article
// page reads cleanly and you have one place to swap in a custom renderer.
export function ArticleBody({ html }: { html: string }) {
  return (
    <div
      className="blog-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
