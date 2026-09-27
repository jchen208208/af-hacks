"use client";

import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import type { OptionId, PlanStep } from "@/lib/engine/types";

const storageKey = (option: OptionId) => `handover:checklist:${option}`;

/** Checklist with state persisted per option in localStorage (plan 6.4). */
export function Checklist({ option, steps }: { option: OptionId; steps: PlanStep[] }) {
  const [done, setDone] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey(option));
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from localStorage
      setDone(raw ? JSON.parse(raw) : {});
    } catch {
      setDone({});
    }
  }, [option]);

  const toggle = (id: string, checked: boolean) => {
    const next = { ...done, [id]: checked };
    setDone(next);
    try {
      window.localStorage.setItem(storageKey(option), JSON.stringify(next));
    } catch {
      // Storage unavailable: keep the in-memory state.
    }
  };

  const count = steps.filter((s) => done[s.id]).length;
  const percent = steps.length ? Math.round((count / steps.length) * 100) : 0;

  return (
    <div className="space-y-5 print:space-y-2">
      <div className="space-y-2 print:hidden">
        <p className="text-base font-semibold" aria-live="polite">
          {count} of {steps.length} done
        </p>
        <div
          role="progressbar"
          aria-label="Checklist progress"
          aria-valuemin={0}
          aria-valuemax={steps.length}
          aria-valuenow={count}
          className="h-3 overflow-hidden rounded-full bg-secondary"
        >
          <div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${percent}%` }} />
        </div>
      </div>
      <ul className="grid gap-3 print:grid-cols-2 print:gap-x-6 print:gap-y-1">
        {steps.map((step) => (
          <li key={step.id}>
            <label className="group flex cursor-pointer items-start gap-4 rounded-xl border bg-card px-5 py-4 text-base shadow-sm transition-colors hover:border-primary/40 has-focus-visible:ring-3 has-focus-visible:ring-ring/50 has-data-[state=checked]:border-primary/30 has-data-[state=checked]:bg-secondary print:gap-2.5 print:rounded-none print:border-0 print:bg-transparent print:px-0 print:py-0.5 print:text-sm print:shadow-none">
              <Checkbox
                className="mt-0.5 size-6 rounded-md border-2 [&_svg]:size-4 print:mt-0 print:size-4 print:rounded-sm"
                checked={!!done[step.id]}
                onCheckedChange={(c) => toggle(step.id, c === true)}
              />
              <span className="leading-snug group-has-data-[state=checked]:text-muted-foreground group-has-data-[state=checked]:line-through group-has-data-[state=checked]:decoration-primary/60">
                {step.title}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
