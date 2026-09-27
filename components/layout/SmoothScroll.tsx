"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
/** Anchor jumps use a fixed-length glide (Lenis's default ease-out), so long jumps don't creep in at the end. */
const ANCHOR_DURATION_S = 1.2;

/** Drop any glide in progress and adopt the page's current scroll position (stop/start resets Lenis). */
function resync(lenis: Lenis) {
  lenis.stop();
  lenis.start();
}

/**
 * Site-wide Lenis smooth scrolling. Not started at all for people who prefer reduced motion.
 * Same-page "#id" links glide to their target; the target's `scroll-margin-top` (e.g. `scroll-mt-20`)
 * keeps it clear of the sticky section nav.
 */
export function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const media = window.matchMedia(REDUCED_MOTION);

    const onAnchorClick = (e: MouseEvent) => {
      const lenis = lenisRef.current;
      if (!lenis || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest?.("a[href*='#']");
      if (!(link instanceof HTMLAnchorElement)) return;
      const url = new URL(link.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
      const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!target) return;
      // Replace the browser's instant jump with Lenis's glide, but keep the URL and focus behaviour.
      e.preventDefault();
      if (location.hash !== url.hash) history.pushState(null, "", url.hash);
      // A native scroll Lenis hasn't seen yet (keyboard, find-in-page, focus) would skew the target; adopt it first.
      if (lenis.animatedScroll !== lenis.actualScroll && lenis.isScrolling !== "smooth") resync(lenis);
      lenis.scrollTo(target, { duration: ANCHOR_DURATION_S });
      if (target.hasAttribute("tabindex")) target.focus({ preventScroll: true });
    };

    const start = () => {
      if (lenisRef.current || media.matches) return;
      lenisRef.current = new Lenis({
        autoRaf: true,
        // Page changes jump to the top as usual instead of finishing an old glide.
        stopInertiaOnNavigate: true,
        // Let open dropdown lists scroll themselves, and leave the page still while one is open
        // (Radix locks page scrolling by cancelling wheel events outside the list).
        prevent: (node) => node.hasAttribute("data-radix-select-viewport"),
        virtualScroll: ({ event }) => !event.defaultPrevented,
      });
    };
    const stop = () => {
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
    const onMotionChange = () => (media.matches ? stop() : start());

    start();
    media.addEventListener("change", onMotionChange);
    document.addEventListener("click", onAnchorClick);
    return () => {
      media.removeEventListener("change", onMotionChange);
      document.removeEventListener("click", onAnchorClick);
      stop();
    };
  }, []);

  // After a route change Next.js scrolls natively; resync so the next wheel starts from there.
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    resync(lenis);
    const frame = requestAnimationFrame(() => resync(lenis));
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}
