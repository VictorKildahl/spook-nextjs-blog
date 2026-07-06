"use client";

import { useId, useState } from "react";

// Accessible FAQ accordion. Each row is a real <button> that toggles its answer
// panel (aria-expanded / aria-controls), and the panel animates open via a CSS
// grid-rows transition (see blog.css). Multiple rows can be open at once.
//
// Note: the FAQ *rich-result* markup (FAQPage JSON-LD) is emitted separately by
// Spook via `article.jsonLd`, so this component is purely the visual/interactive
// layer — no structured data is duplicated here.
export function Faq({ items }: { items: { question: string; answer: string }[] }) {
  const [open, setOpen] = useState<Set<number>>(new Set());
  const baseId = useId();

  if (items.length === 0) return null;

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <section className="blog-faq" aria-labelledby={`${baseId}-heading`}>
      <h2 id={`${baseId}-heading`} className="blog-faq-heading">
        Frequently asked questions
      </h2>
      <div>
        {items.map((item, i) => {
          const isOpen = open.has(i);
          const panelId = `${baseId}-panel-${i}`;
          const triggerId = `${baseId}-trigger-${i}`;
          return (
            <div className="blog-faq-item" key={i}>
              <h3 style={{ margin: 0 }}>
                <button
                  id={triggerId}
                  type="button"
                  className="blog-faq-trigger"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(i)}
                >
                  <span>{item.question}</span>
                  <span className="blog-faq-icon" aria-hidden="true" />
                </button>
              </h3>
              <div
                id={panelId}
                role="region"
                aria-labelledby={triggerId}
                className="blog-faq-panel"
                data-open={isOpen}
              >
                <div className="blog-faq-panel-inner">
                  <p className="blog-faq-answer">{item.answer}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
