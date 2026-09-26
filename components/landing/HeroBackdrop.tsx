import fs from "node:fs";
import path from "node:path";
import Image from "next/image";

/** Drop a photo here (e.g. an owner in their workshop) and it appears in the right-hand panel. */
const PHOTO_PATH = "/landing/hero-photo.jpg";
const hasPhoto = fs.existsSync(path.join(process.cwd(), "public", PHOTO_PATH));

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

/**
 * The hero's split background: a deep-green field with an angled, lighter panel on the right
 * (bottom on mobile) that carries the texture or an optional photo.
 */
export function HeroBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div
        className="absolute inset-x-0 bottom-0 h-[52%] overflow-hidden bg-[oklch(0.4_0.07_165)] [clip-path:polygon(0_14%,100%_0,100%_100%,0_100%)] lg:inset-y-0 lg:right-0 lg:left-auto lg:h-auto lg:w-[46%] lg:[clip-path:polygon(18%_0,100%_0,100%_100%,0_100%)]"
      >
        {hasPhoto && (
          <>
            <Image src={PHOTO_PATH} alt="" fill sizes="50vw" className="object-cover opacity-40 mix-blend-luminosity" priority />
            <div className="absolute inset-0 bg-[oklch(0.4_0.07_165)]/60" />
          </>
        )}
        <Contours />
      </div>
      {/* Soft glow behind the product mockups */}
      <div className="absolute top-1/2 right-[18%] hidden size-[36rem] -translate-y-1/2 rounded-full bg-[oklch(0.6_0.09_165)] opacity-20 blur-3xl lg:block" />
    </div>
  );
}
