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

  return (
    <div className="space-y-3">
      <p className="text-base text-muted-foreground">
        {count} of {steps.length} done
      </p>
      <ul className="space-y-2">
        {steps.map((step) => (
          <li key={step.id}>
            <label className="group flex cursor-pointer items-start gap-3 rounded-lg border bg-card px-4 py-3 text-base has-data-[state=checked]:bg-secondary">
              <Checkbox
                className="mt-1 size-5"
                checked={!!done[step.id]}
                onCheckedChange={(c) => toggle(step.id, c === true)}
              />
              <span className="group-has-data-[state=checked]:text-muted-foreground group-has-data-[state=checked]:line-through">
                {step.title}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
