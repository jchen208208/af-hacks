"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface NavSection {
  id: string;
  label: string;
}

/** Scroll distance a user must move away from a clicked section before scroll-tracking takes over again. */
const CLICK_LOCK_PX = 40;

/** Sticky pill nav on its own dark-green surface (legible over the green field and beige sheets). */
export function SectionNav({ sections }: { sections: NavSection[] }) {
  const [active, setActive] = useState(sections[0]?.id);
  // After a click, keep that pill lit even if the page can't scroll the section to the top (e.g. the last one).
  const clickLock = useRef<{ id: string; y: number | null } | null>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const lock = clickLock.current;
      if (lock) {
        if (lock.y === null || Math.abs(window.scrollY - lock.y) < CLICK_LOCK_PX) return;
        clickLock.current = null;
      }
      // Active = the last section whose top has passed a line 30% down the viewport; at page bottom, the last one.
      const line = window.innerHeight * 0.3;
      let current = sections[0]?.id;
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= line) current = s.id;
      }
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atBottom) current = sections[sections.length - 1]?.id;
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [sections]);

  const onClick = (id: string) => {
    setActive(id);
    clickLock.current = { id, y: null };
    // The anchor jump happens after this handler; record where it lands.
    requestAnimationFrame(() => {
      if (clickLock.current?.id === id) clickLock.current.y = window.scrollY;
    });
  };

  return (
    <nav aria-label="Sections" className="no-print sticky top-0 z-30 border-y border-white/10 bg-band shadow-[0_8px_24px_-12px_rgb(0_0_0/0.5)]">
      <ul className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3 sm:px-6">
        {sections.map((s) => {
          const isActive = s.id === active;
          return (
            <li key={s.id} className="shrink-0">
              <a
                href={`#${s.id}`}
                onClick={() => onClick(s.id)}
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
