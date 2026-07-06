"use client";

import { useState } from "react";

// Lightweight share row: copy-to-clipboard plus X and LinkedIn intents. No SDKs,
// no tracking scripts — just anchor links and the Clipboard API.
export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard blocked (e.g. insecure origin) — silently ignore.
    }
  };

  const enc = encodeURIComponent;
  const x = `https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(url)}`;
  const linkedin = `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`;

  return (
    <div className="blog-share">
      <span className="blog-share-label">Share</span>
      <a
        className="blog-share-btn"
        href={x}
        target="_blank"
        rel="noopener noreferrer"
      >
        X
      </a>
      <a
        className="blog-share-btn"
        href={linkedin}
        target="_blank"
        rel="noopener noreferrer"
      >
        LinkedIn
      </a>
      <button type="button" className="blog-share-btn" onClick={copy}>
        {copied ? "Copied ✓" : "Copy link"}
      </button>
    </div>
  );
}
