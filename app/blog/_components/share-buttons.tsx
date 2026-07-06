"use client";

import { useState, type ReactNode } from "react";

// Lightweight share row: copy-to-clipboard plus X and LinkedIn intents. No SDKs,
// no tracking scripts — just anchor links, inline SVG icons, and the Clipboard API.

function ShareIcon({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      fill="currentColor"
    >
      {children}
    </svg>
  );
}

function XLogoIcon({ className }: { className?: string }) {
  return (
    <ShareIcon className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </ShareIcon>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <ShareIcon className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a-2.116 2.116 0 1 1 0-4.233 2.116 2.116 0 0 1 0 4.233zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </ShareIcon>
  );
}

function LinkIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

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
        aria-label="Share on X"
        title="Share on X"
      >
        <XLogoIcon className="blog-share-icon" />
      </a>
      <a
        className="blog-share-btn"
        href={linkedin}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        title="Share on LinkedIn"
      >
        <LinkedInIcon className="blog-share-icon" />
      </a>
      <button
        type="button"
        className="blog-share-btn"
        onClick={copy}
        aria-label={copied ? "Link copied" : "Copy link"}
        title={copied ? "Link copied" : "Copy link"}
      >
        {copied ? (
          <CheckIcon className="blog-share-icon" />
        ) : (
          <LinkIcon className="blog-share-icon" />
        )}
      </button>
    </div>
  );
}