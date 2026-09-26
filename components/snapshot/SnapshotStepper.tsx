"use client";

import { Check } from "lucide-react";
import { useSnapshot } from "@/lib/state/SnapshotContext";
import { STEP_TITLES } from "@/lib/snapshot/questions";
import { cn } from "@/lib/utils";

/**
 * Step progress shown inside the green PageHero. Completed steps can be clicked to go back;
 * later steps can only be reached with "Next" (so each step is validated).
 */
export function SnapshotStepper() {
  const { step, setStep, hydrated } = useSnapshot();
  const current = hydrated ? step : 0;
  const total = STEP_TITLES.length;

  return (
    <nav aria-label="Snapshot progress" className="w-full max-w-3xl print:hidden">
      {/* Phone: one line of text + segmented bar */}
      <div className="space-y-2.5 sm:hidden">
        <p className="text-base font-semibold text-hero-foreground">
          Step {current + 1} of {total}: <span className="text-highlight">{STEP_TITLES[current]}</span>
        </p>
        <div className="grid grid-cols-4 gap-1.5" aria-hidden>
          {STEP_TITLES.map((title, i) => (
            <span key={title} className={cn("h-2 rounded-full", i <= current ? "bg-highlight" : "bg-white/20")} />
          ))}
        </div>
      </div>

      {/* Tablet and up: labelled steps */}
      <ol className="hidden gap-2 sm:grid sm:grid-cols-4">
        {STEP_TITLES.map((title, i) => {
          const done = i < current;
          const active = i === current;
          const content = (
            <>
              <span
                className={cn(
                  "grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold",
                  active && "bg-hero text-hero-foreground",
                  done && "bg-highlight text-hero",
                  !active && !done && "border-2 border-white/40 text-hero-muted",
                )}
              >
                {done ? <Check className="size-4" strokeWidth={3} aria-hidden /> : i + 1}
              </span>
              <span className="min-w-0 text-left text-sm leading-tight font-semibold">
                <span className="sr-only">{done ? "Completed: " : active ? "Current step: " : "Upcoming: "}</span>
                {title}
              </span>
            </>
          );
          const base = "flex h-full w-full items-center gap-2.5 rounded-xl px-3 py-2.5 transition-colors";
          return (
            <li key={title} aria-current={active ? "step" : undefined}>
              {done ? (
                <button
                  type="button"
                  onClick={() => setStep(i)}
                  className={cn(
                    base,
                    "bg-white/10 text-hero-foreground hover:bg-white/20 focus-visible:ring-3 focus-visible:ring-white/60 focus-visible:outline-none",
                  )}
                >
                  {content}
                </button>
              ) : (
                <div className={cn(base, active ? "bg-white text-hero shadow-lg" : "text-hero-muted ring-1 ring-white/20")}>
                  {content}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
