// Small formatting helpers shared across the blog pages.

export function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Pluralized reading-time label, e.g. "5 min read".
export function readingTimeLabel(minutes: number): string {
  return `${minutes} min read`;
}
