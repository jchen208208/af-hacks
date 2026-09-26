import type { PlanStep } from "@/lib/engine/types";

/** Vertical year-by-year timeline: green numbered markers on a soft rail, serif step titles. */
export function Timeline({ steps }: { steps: PlanStep[] }) {
  return (
    <ol className="relative space-y-8 print:space-y-3">
      {/* Rail behind the markers */}
      <span aria-hidden className="absolute top-5 bottom-5 left-5 w-0.5 -translate-x-1/2 bg-primary/20 print:hidden" />
      {steps.map((step, i) => (
        <li key={step.id} className="print-break-avoid relative flex gap-5 print:gap-3">
          <span
            aria-hidden
            className="relative z-10 grid size-10 shrink-0 place-items-center rounded-full bg-hero font-heading text-lg font-semibold text-hero-foreground ring-4 ring-background [print-color-adjust:exact] print:size-7 print:text-sm print:ring-0"
          >
            {i + 1}
          </span>
          <div className="space-y-1 pt-1.5 print:pt-0.5">
            <p className="text-sm font-semibold tracking-[0.12em] text-primary uppercase">{step.when}</p>
            <h3 className="font-heading text-xl leading-snug font-semibold print:text-base">{step.title}</h3>
            {step.detail && (
              <p className="max-w-2xl text-base leading-relaxed text-muted-foreground print:text-sm">{step.detail}</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
