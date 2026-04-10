import type { ReactNode } from "react";

interface SectionBlockProps {
  title: string;
  children: ReactNode;
}

export function SectionBlock({ title, children }: SectionBlockProps) {
  return (
    <section className="t-section">
      <header className="t-section-title">{title}</header>
      <div className="t-section-body">{children}</div>
    </section>
  );
}
