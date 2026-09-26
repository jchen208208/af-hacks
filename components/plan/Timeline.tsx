import type { PlanStep } from "@/lib/engine/types";

export function Timeline({ steps }: { steps: PlanStep[] }) {
  return (
    <ol className="relative space-y-6 border-l-2 border-primary/30 pl-8">
      {steps.map((step, i) => (
        <li key={step.id} className="print-break-avoid relative">
          <span
            aria-hidden
            className="absolute top-0.5 -left-[2.6rem] grid size-8 place-items-center rounded-full bg-primary font-heading text-sm font-semibold text-primary-foreground"
          >
            {i + 1}
          </span>
          <p className="text-sm font-semibold tracking-wide text-primary uppercase">{step.when}</p>
          <h3 className="text-lg font-semibold">{step.title}</h3>
          {step.detail && <p className="text-base text-muted-foreground">{step.detail}</p>}
        </li>
      ))}
    </ol>
  );
}
