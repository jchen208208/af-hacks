"use client";

import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import type { OptionId, PlanStep } from "@/lib/engine/types";

const storageKey = (option: OptionId) => `handover:checklist:${option}`;

/** Checklist ticks for one option, persisted in localStorage (plan 6.4). Shared by the page and the printout. */
export function useChecklist(option: OptionId) {
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

  return { done, toggle };
}

/** Checklist with a progress bar. State comes from `useChecklist` in the parent. */
export function Checklist({
  steps,
  done,
  onToggle,
}: {
  steps: PlanStep[];
  done: Record<string, boolean>;
  onToggle: (id: string, checked: boolean) => void;
}) {
  const count = steps.filter((s) => done[s.id]).length;
  const percent = steps.length ? Math.round((count / steps.length) * 100) : 0;

  return (
    <div className="space-y-5">
      <div className="space-y-2">
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
      <ul className="grid gap-3">
        {steps.map((step) => (
          <li key={step.id}>
            <label className="group flex cursor-pointer items-start gap-4 rounded-xl border bg-card px-5 py-4 text-base shadow-sm transition-colors hover:border-primary/40 has-focus-visible:ring-3 has-focus-visible:ring-ring/50 has-data-[state=checked]:border-primary/30 has-data-[state=checked]:bg-secondary">
              <Checkbox
                className="mt-0.5 size-6 rounded-md border-2 [&_svg]:size-4"
                checked={!!done[step.id]}
                onCheckedChange={(c) => onToggle(step.id, c === true)}
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
