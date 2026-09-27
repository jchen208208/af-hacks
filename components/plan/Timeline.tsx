import type { PlanStep } from "@/lib/engine/types";

/** Steps built from the owner's top readiness fixes (plan 7.6) have ids starting with "fix-". */
const isReadinessFix = (step: PlanStep) => step.id.startsWith("fix-");

/** Vertical year-by-year timeline: green numbered markers on a soft rail, serif step titles. */
export function Timeline({ steps }: { steps: PlanStep[] }) {
  return (
    <ol className="relative space-y-8">
      {/* Rail behind the markers */}
      <span aria-hidden className="absolute top-5 bottom-5 left-5 w-0.5 -translate-x-1/2 bg-primary/20" />
      {steps.map((step, i) => (
        <li key={step.id} className="relative flex gap-5">
          <span
            aria-hidden
            className="relative z-10 grid size-10 shrink-0 place-items-center rounded-full bg-hero font-heading text-lg font-semibold text-hero-foreground ring-4 ring-background"
          >
            {i + 1}
          </span>
          <div className="space-y-1 pt-1.5">
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-semibold tracking-[0.12em] text-primary uppercase">
              {step.when}
              {isReadinessFix(step) && (
                <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs tracking-normal text-secondary-foreground normal-case">
                  Readiness fix
                </span>
              )}
            </p>
            <h3 className="font-heading text-xl leading-snug font-semibold">{step.title}</h3>
            {step.detail && (
              <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
                {step.detail}
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
