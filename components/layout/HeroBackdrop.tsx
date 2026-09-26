import Image from "next/image";
import { cn } from "@/lib/utils";

/** Topographic contour lines: a quiet "land and legacy" texture. */
function Contours() {
  const lines = Array.from({ length: 22 }, (_, i) => {
    const y = 20 + i * 42;
    const a = 26 + (i % 5) * 7;
    return `M -40 ${y} C 160 ${y - a}, 320 ${y + a}, 520 ${y} S 860 ${y - a * 0.8}, 1040 ${y + 6}`;
  });
  return (
    <svg className="absolute inset-0 size-full" viewBox="0 0 1000 950" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <g fill="none" stroke="white" strokeOpacity="0.12" strokeWidth="1.5">
        {lines.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
    </svg>
  );
}

const PANEL = {
  // Landing: a large panel on the right (bottom on mobile) behind the product mockups.
  landing:
    "inset-x-0 bottom-0 h-[52%] [clip-path:polygon(0_14%,100%_0,100%_100%,0_100%)] lg:inset-y-0 lg:right-0 lg:left-auto lg:h-auto lg:w-[46%] lg:[clip-path:polygon(18%_0,100%_0,100%_100%,0_100%)]",
  // Page headers: a narrower angled panel on the right at every size.
  page: "inset-y-0 right-0 w-[38%] [clip-path:polygon(40%_0,100%_0,100%_100%,0_100%)] lg:w-[34%] lg:[clip-path:polygon(22%_0,100%_0,100%_100%,0_100%)]",
};

/**
 * The split background shared by the landing hero and every page header: a deep-green field with an
 * angled, lighter panel carrying the contour texture (or the optional photo on the landing page).
 */
export function HeroBackdrop({
  variant = "landing",
  photoSrc,
}: {
  variant?: keyof typeof PANEL;
  /** Optional photo for the panel (landing only). Safe to use from client components: no fs here. */
  photoSrc?: string | null;
}) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 print:hidden">
      <div className={cn("absolute overflow-hidden bg-hero-panel", PANEL[variant])}>
        {photoSrc && (
          <>
            <Image src={photoSrc} alt="" fill sizes="50vw" className="object-cover opacity-40 mix-blend-luminosity" priority />
            <div className="absolute inset-0 bg-hero-panel/60" />
          </>
        )}
        <Contours />
      </div>
      {variant === "landing" && (
        <div className="absolute top-1/2 right-[18%] hidden size-[36rem] -translate-y-1/2 rounded-full bg-hero-glow opacity-20 blur-3xl lg:block" />
      )}
    </div>
  );
}
