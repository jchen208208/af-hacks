"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface NavSection {
  id: string;
  label: string;
}

/** Sticky pill nav on its own dark-green surface (legible over the green field and beige sheets). */
export function SectionNav({ sections }: { sections: NavSection[] }) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -60% 0px" },
    );
    for (const s of sections) {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav aria-label="Sections" className="no-print sticky top-0 z-30 border-b border-white/10 bg-band/90 shadow-[0_8px_24px_-12px_rgb(0_0_0/0.5)] backdrop-blur-md">
      <ul className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3 sm:px-6">
        {sections.map((s) => {
          const isActive = s.id === active;
          return (
            <li key={s.id} className="shrink-0">
              <a
                href={`#${s.id}`}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "block rounded-full border px-5 py-2 text-base font-semibold whitespace-nowrap transition-colors focus-visible:ring-3 focus-visible:ring-white/60 focus-visible:outline-none",
                  isActive
                    ? "border-white bg-white text-hero"
                    : "border-white/25 bg-white/5 text-hero-foreground hover:border-white/50 hover:bg-white/15",
                )}
              >
                {s.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
