"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Low-contrast shades of the deep hero green (oklch L 0.27–0.38). Neighbouring facets always differ,
 * but only slightly, so the field reads as one calm surface with quiet geometry.
 */
const SHADES = [
  "oklch(0.31 0.057 165)",
  "oklch(0.35 0.065 164)",
  "oklch(0.285 0.05 166)",
  "oklch(0.38 0.07 163)",
  "oklch(0.33 0.06 167)",
  "oklch(0.27 0.048 165)",
];

/** Deterministic pseudo-random in [0, 1) so facets never reshuffle between renders. */
function rand(a: number, b: number) {
  const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

interface Facet {
  points: string;
  fill: string;
}
interface Edge {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  bright: boolean;
}

/**
 * Slanted "fault lines" run across the page roughly every band height; one or two diagonal cuts split each
 * band into quads. Geometry depends only on the width and the band index, so a taller page (e.g. an opened
 * accordion) just adds bands at the bottom instead of reshuffling everything above.
 */
function buildFacets(w: number, h: number) {
  const band = Math.min(760, Math.max(440, w * 0.5));
  const count = Math.ceil(h / band) + 1;
  const cuts = w < 700 ? 1 : 2;

  const fault = (k: number) => {
    if (k === 0) return { left: -2, right: -2 };
    const tilt = (k % 2 ? 1 : -1) * band * 0.3 * (0.6 + 0.4 * rand(k, 1));
    return { left: k * band - tilt / 2, right: k * band + tilt / 2 };
  };
  const yAt = (line: { left: number; right: number }, x: number) => line.left + ((line.right - line.left) * x) / w;

  const facets: Facet[] = [];
  const edges: Edge[] = [];
  let prevShade = -1;

  for (let k = 0; k < count; k++) {
    const top = fault(k);
    const bottom = fault(k + 1);
    if (k > 0) edges.push({ x1: 0, y1: top.left, x2: w, y2: top.right, bright: rand(k, 7) > 0.6 });

    const bounds = [{ t: 0, b: 0 }];
    for (let j = 0; j < cuts; j++) {
      const t = (w * (j + 1)) / (cuts + 1) + (rand(k, j + 2) - 0.5) * w * 0.22;
      const b = t + (rand(k, j + 5) - 0.5) * w * 0.5;
      bounds.push({ t, b });
      edges.push({ x1: t, y1: yAt(top, t), x2: b, y2: yAt(bottom, b), bright: false });
    }
    bounds.push({ t: w, b: w });

    for (let j = 0; j < bounds.length - 1; j++) {
      const [l, r] = [bounds[j], bounds[j + 1]];
      let shade = Math.floor(rand(k, j + 11) * SHADES.length);
      if (shade === prevShade) shade = (shade + 1 + (k % 3)) % SHADES.length;
      prevShade = shade;
      facets.push({
        points: [
          [l.t, yAt(top, l.t)],
          [r.t, yAt(top, r.t)],
          [r.b, yAt(bottom, r.b)],
          [l.b, yAt(bottom, l.b)],
        ]
          .map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`)
          .join(" "),
        fill: SHADES[shade],
      });
    }
  }
  return { facets, edges };
}

/** A section of page whose background is a field of faceted greens. Children sit on top. */
export function FacetField({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize((s) => (s && s.w === Math.round(width) && s.h === Math.round(height) ? s : { w: Math.round(width), h: Math.round(height) }));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const shapes = useMemo(() => (size ? buildFacets(size.w, size.h) : null), [size]);

  return (
    <div
      ref={ref}
      // Base colour = SHADES[0].
      className={cn("relative isolate bg-[oklch(0.31_0.057_165)]", className)}
    >
      {size && shapes && (
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 size-full"
          viewBox={`0 0 ${size.w} ${size.h}`}
          preserveAspectRatio="none"
        >
          {shapes.facets.map((f, i) => (
            <polygon key={i} points={f.points} fill={f.fill} />
          ))}
          <g stroke="white" strokeWidth="1">
            {shapes.edges.map(({ bright, ...line }, i) => (
              <line key={i} {...line} strokeOpacity={bright ? 0.16 : 0.08} />
            ))}
          </g>
        </svg>
      )}
      {children}
    </div>
  );
}

/**
 * A beige reading surface floating on the green field. Large rounded corners and a soft, wide shadow make the
 * green-to-beige change feel like a sheet laid on the surface rather than a hard cut.
 */
export function Sheet({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-[1.5rem] bg-background p-3 text-foreground shadow-[0_28px_70px_-28px_rgb(0_0_0/0.55),0_2px_6px_-2px_rgb(0_0_0/0.2)] ring-1 ring-white/10 sm:rounded-[2.25rem] sm:p-8 lg:p-10",
        className,
      )}
    >
      {children}
    </div>
  );
}
