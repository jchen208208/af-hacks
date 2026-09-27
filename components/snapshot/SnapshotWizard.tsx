"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSnapshot } from "@/lib/state/SnapshotContext";
import { STEP_TITLES, checkStep } from "@/lib/snapshot/questions";
import { StepBusiness, StepNumbers, StepOperations, StepOwner } from "./steps";

const STEPS = [StepBusiness, StepNumbers, StepOperations, StepOwner];

const STEP_INTROS = [
  "The basics: what you do, where, and how big the business is.",
  "Rough numbers are fine. Your accountant can refine them later.",
  "How the business runs day to day. This is what buyers look at most.",
  "Your timing and what matters most to you in the sale.",
];

export function SnapshotWizard() {
  const { draft, update, step, setStep, hydrated, fillExample, draftIsExample, exitDemo } = useSnapshot();
  const router = useRouter();

  // Opening the wizard means the owner is working on their own plan, so stop showing the example.
  useEffect(() => {
    if (hydrated) exitDemo();
  }, [hydrated, exitDemo]);

  // On a step change, move focus to the new step's heading so keyboard and screen-reader users start at the top.
  const headingRef = useRef<HTMLHeadingElement>(null);
  const prevStep = useRef(step);
  useEffect(() => {
    if (prevStep.current !== step) headingRef.current?.focus({ preventScroll: true });
    prevStep.current = step;
  }, [step]);

  if (!hydrated) {
    return <div className="h-[32rem] animate-pulse rounded-2xl border bg-card shadow-sm" aria-busy />;
  }

  const StepComponent = STEPS[step];
  const isLast = step === STEPS.length - 1;
  // Checked live: "Next" unlocks once every required question on this step is answered and valid.
  const { valid, missing, errors } = checkStep(step, draft);
  const errorCount = Object.keys(errors).length;

  const next = () => {
    if (!valid) return;
    if (isLast) router.push("/results");
    else setStep(step + 1);
    window.scrollTo({ top: 0 });
  };

  const back = () => {
    setStep(step - 1);
    window.scrollTo({ top: 0 });
  };

  const status = valid
    ? null
    : missing.length > 0
      ? `${missing.length} required ${missing.length === 1 ? "question" : "questions"} left on this step`
      : `Please fix ${errorCount === 1 ? "the answer" : `${errorCount} answers`} marked in red`;

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border bg-card shadow-sm">
        <div className="flex flex-col gap-4 border-b px-5 pt-8 pb-7 sm:flex-row sm:items-start sm:justify-between sm:px-10 sm:pt-10 sm:pb-9">
          <div className="space-y-3">
            <p className="text-sm font-bold tracking-[0.12em] text-primary uppercase">
              Step {step + 1} of {STEPS.length}
            </p>
            <h2 ref={headingRef} tabIndex={-1} className="text-4xl leading-tight font-semibold focus:outline-none sm:text-[2.75rem]">
              {STEP_TITLES[step]}
            </h2>
            <p className="text-lg text-muted-foreground">{STEP_INTROS[step]}</p>
          </div>
          <button
            type="button"
            onClick={fillExample}
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-primary/25 bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground transition-colors hover:border-primary/50 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <Sparkles className="size-4" aria-hidden />
            {draftIsExample ? "Example loaded" : "Fill with an example"}
          </button>
        </div>

        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            next();
          }}
        >
          <div className="space-y-9 px-5 py-8 sm:px-10 sm:py-10">
            <p className="text-base text-muted-foreground">
              Questions marked <span aria-hidden className="font-bold text-destructive">*</span>
              <span className="sr-only">with an asterisk</span> are required.
            </p>
            <StepComponent draft={draft} update={update} errors={errors} />
          </div>

          <div className="flex flex-col-reverse gap-3 rounded-b-2xl border-t bg-muted/40 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-10">
            <Button type="button" variant="ghost" size="xl" className="h-14 w-full px-5 text-lg sm:w-auto" onClick={back} disabled={step === 0}>
              <ArrowLeft /> Back
            </Button>
            <div className="flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center">
              <p id="step-status" aria-live="polite" className="text-center text-base text-muted-foreground sm:text-right">
                {status}
              </p>
              <Button
                type="submit"
                size="xl"
                disabled={!valid}
                aria-describedby={status ? "step-status" : undefined}
                className="h-14 w-full px-8 text-lg shadow-sm sm:w-auto"
              >
                {isLast ? "See my results" : "Next"} <ArrowRight />
              </Button>
            </div>
          </div>
        </form>
      </div>

      <p className="flex items-center justify-center gap-2 text-center text-sm text-muted-foreground">
        <Lock className="size-4 shrink-0" aria-hidden />
        Your answers are saved in this browser only. Nothing is sent anywhere.
      </p>
    </div>
  );
}
