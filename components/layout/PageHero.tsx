import { cn } from "@/lib/utils";
import { HeroBackdrop } from "./HeroBackdrop";

/**
 * Full-bleed green page header in the landing hero's style (split backdrop, white type).
 * Use at the top of every page; content below sits on the light background.
 * In print it collapses to plain dark-on-white text.
 */
export function PageHero({
  eyebrow,
  title,
  children,
  actions,
  aside,
  className,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  /** Lead paragraph under the title. */
  children?: React.ReactNode;
  /** Buttons row (e.g. Print). Use `heroButtonClass` variants for contrast on green. */
  actions?: React.ReactNode;
  /** Optional right-hand content (e.g. a key figure card) shown on large screens. */
  aside?: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative isolate overflow-hidden bg-hero text-hero-foreground print:bg-transparent print:text-foreground",
        className,
      )}
    >
      <HeroBackdrop variant="page" />
      <div
        className={cn(
          "relative mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 sm:py-16 print:px-0 print:py-4",
          aside && "lg:grid-cols-[1fr_auto] lg:items-center",
        )}
      >
        <div className="max-w-3xl space-y-4">
          {eyebrow && (
            <p className="text-sm font-semibold tracking-[0.12em] text-highlight uppercase print:text-primary">{eyebrow}</p>
          )}
          <h1 className="font-heading text-4xl leading-[1.1] font-semibold text-balance sm:text-5xl">{title}</h1>
          {children && <div className="max-w-2xl text-xl leading-relaxed text-hero-muted print:text-muted-foreground">{children}</div>}
          {actions && <div className="flex flex-wrap items-center gap-3 pt-2">{actions}</div>}
        </div>
        {aside && <div className="relative">{aside}</div>}
      </div>
    </section>
  );
}

/** Button classes for use on the green hero. */
export const heroButtonClass = {
  solid:
    "h-14 bg-white px-8 text-lg text-hero shadow-lg hover:bg-[oklch(0.95_0.02_165)] focus-visible:ring-white/60",
  outline:
    "h-14 border-2 border-white/80 bg-transparent px-8 text-lg text-white hover:bg-white/10 hover:text-white focus-visible:ring-white/60 print:hidden",
};
