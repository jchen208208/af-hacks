"use client";

import { Check } from "lucide-react";
import { useSnapshot } from "@/lib/state/SnapshotContext";
import { STEP_TITLES, checkStep, firstIncompleteStep } from "@/lib/snapshot/questions";
import { cn } from "@/lib/utils";

/**
 * Step progress shown inside the green PageHero. Any step can be opened once every step
 * before it has its required questions answered; steps past the first incomplete one stay locked.
 */
export function SnapshotStepper() {
  const { step, setStep, hydrated, draft } = useSnapshot();
  const current = hydrated ? step : 0;
  const total = STEP_TITLES.length;
  const reachable = hydrated ? firstIncompleteStep(draft) : 0;

  const steps = STEP_TITLES.map((title, i) => ({
    title,
    active: i === current,
    complete: hydrated && checkStep(i, draft).valid,
    // A step can be opened when all the steps before it are complete.
    open: i !== current && i <= reachable,
  }));

  const go = (i: number) => {
    setStep(i);
    window.scrollTo({ top: 0 });
  };

  const srStatus = (s: (typeof steps)[number]) =>
    s.active ? "Current step: " : s.complete ? "Completed: " : s.open ? "Not finished: " : "Locked: ";

  return (
    <nav aria-label="Snapshot progress" className="w-full max-w-3xl print:hidden">
      {/* Phone: current step name + four tappable numbered steps */}
      <div className="space-y-3 sm:hidden">
        <p className="text-base font-semibold text-hero-foreground">
          Step {current + 1} of {total}: <span className="text-highlight">{STEP_TITLES[current]}</span>
        </p>
        <ol className="flex items-center">
          {steps.map((s, i) => {
            const marker = (
              <span
                className={cn(
                  "grid size-11 place-items-center rounded-full text-base font-bold transition-colors",
                  s.active && "bg-white text-hero shadow-lg",
                  !s.active && s.complete && "bg-highlight text-hero",
                  !s.active && s.complete && !s.open && "opacity-50",
                  !s.active && !s.complete && s.open && "border-2 border-highlight text-hero-foreground",
                  !s.active && !s.complete && !s.open && "border-2 border-white/30 text-hero-muted",
                )}
              >
                {s.complete && !s.active ? <Check className="size-5" strokeWidth={3} aria-hidden /> : i + 1}
              </span>
            );
            return (
              <li key={s.title} aria-current={s.active ? "step" : undefined} className="flex flex-1 items-center last:flex-none">
                {s.open ? (
                  <button
                    type="button"
                    onClick={() => go(i)}
                    className="rounded-full focus-visible:ring-3 focus-visible:ring-white/60 focus-visible:outline-none"
                  >
                    <span className="sr-only">
                      {srStatus(s)}
                      {s.title}
                    </span>
                    {marker}
                  </button>
                ) : (
                  <span>
                    <span className="sr-only">
                      {srStatus(s)}
                      {s.title}
                    </span>
                    {marker}
                  </span>
                )}
                {i < total - 1 && (
                  <span aria-hidden className={cn("mx-1.5 h-0.5 flex-1 rounded-full", i < reachable ? "bg-highlight" : "bg-white/20")} />
                )}
              </li>
            );
          })}
        </ol>
      </div>

      {/* Tablet and up: labelled steps */}
      <ol className="hidden gap-2 sm:grid sm:grid-cols-4">
        {steps.map((s, i) => {
          const content = (
            <>
              <span
                className={cn(
                  "grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold",
                  s.active && "bg-hero text-hero-foreground",
                  !s.active && s.complete && "bg-highlight text-hero",
                  !s.active && s.complete && !s.open && "opacity-50",
                  !s.active && !s.complete && s.open && "border-2 border-highlight text-hero-foreground",
                  !s.active && !s.complete && !s.open && "border-2 border-white/40 text-hero-muted",
                )}
              >
                {s.complete && !s.active ? <Check className="size-4" strokeWidth={3} aria-hidden /> : i + 1}
              </span>
              <span className="min-w-0 text-left text-sm leading-tight font-semibold">
                <span className="sr-only">{srStatus(s)}</span>
                {s.title}
              </span>
            </>
          );
          const base = "flex h-full w-full items-center gap-2.5 rounded-xl px-3 py-2.5 transition-colors";
          return (
            <li key={s.title} aria-current={s.active ? "step" : undefined}>
              {s.open ? (
                <button
                  type="button"
                  onClick={() => go(i)}
                  className={cn(
                    base,
                    "bg-white/10 text-hero-foreground hover:bg-white/20 focus-visible:ring-3 focus-visible:ring-white/60 focus-visible:outline-none",
                  )}
                >
                  {content}
                </button>
              ) : (
                <div className={cn(base, s.active ? "bg-white text-hero shadow-lg" : "text-hero-muted ring-1 ring-white/20")}>
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
