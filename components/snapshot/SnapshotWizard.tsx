"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSnapshot } from "@/lib/state/SnapshotContext";
import { STEP_SCHEMAS, STEP_TITLES } from "@/lib/snapshot/questions";
import { StepBusiness, StepNumbers, StepOperations, StepOwner } from "./steps";

const STEPS = [StepBusiness, StepNumbers, StepOperations, StepOwner];

const STEP_INTROS = [
  "The basics: what you do, where, and how big the business is.",
  "Rough numbers are fine. Your accountant can refine them later.",
  "How the business runs day to day. This is what buyers look at most.",
  "Your timing and what matters most to you in the sale.",
];

export function SnapshotWizard() {
  const { draft, update, step, setStep, hydrated, loadDemo, isDemo } = useSnapshot();
  // Errors are tied to the step they came from, so going back via the stepper never shows stale messages.
  const [errors, setErrors] = useState<{ step: number; fields: Record<string, string> }>({ step: -1, fields: {} });
  const router = useRouter();

  if (!hydrated) {
    return <div className="h-[32rem] animate-pulse rounded-2xl border bg-card shadow-sm" aria-busy />;
  }

  const StepComponent = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const stepErrors = errors.step === step ? errors.fields : {};
  const errorCount = Object.keys(stepErrors).length;

  const next = () => {
    const result = STEP_SCHEMAS[step].safeParse(draft);
    if (!result.success) {
      const found: Record<string, string> = {};
      for (const issue of result.error.issues) {
        found[String(issue.path[0])] ??= issue.message;
      }
      setErrors({ step, fields: found });
      return;
    }
    setErrors({ step: -1, fields: {} });
    if (isLast) router.push("/results");
    else setStep(step + 1);
    window.scrollTo({ top: 0 });
  };

  const back = () => {
    setErrors({ step: -1, fields: {} });
    setStep(step - 1);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border bg-card shadow-sm">
        <div className="flex flex-col gap-4 border-b px-5 pt-12 pb-7 sm:flex-row sm:items-start sm:justify-between sm:px-10 sm:pt-16 sm:pb-9">
          <div className="space-y-3">
            <p className="text-sm font-bold tracking-[0.12em] text-primary uppercase">
              Step {step + 1} of {STEPS.length}
            </p>
            <h2 className="text-4xl leading-tight font-semibold sm:text-[2.75rem]">{STEP_TITLES[step]}</h2>
            <p className="text-lg text-muted-foreground">{STEP_INTROS[step]}</p>
          </div>
          <button
            type="button"
            onClick={loadDemo}
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-primary/25 bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground transition-colors hover:border-primary/50 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <Sparkles className="size-4" aria-hidden />
            {isDemo ? "Example loaded" : "Fill with an example"}
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
            {errorCount > 0 && (
              <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-base font-medium text-destructive">
                Please check {errorCount === 1 ? "the answer" : `${errorCount} answers`} marked below.
              </p>
            )}
            <StepComponent draft={draft} update={update} errors={stepErrors} />
          </div>

          <div className="flex flex-col-reverse gap-3 rounded-b-2xl border-t bg-muted/40 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-10">
            <Button type="button" variant="ghost" size="xl" className="h-14 w-full px-5 text-lg sm:w-auto" onClick={back} disabled={step === 0}>
              <ArrowLeft /> Back
            </Button>
            <Button type="submit" size="xl" className="h-14 w-full px-8 text-lg shadow-sm sm:w-auto">
              {isLast ? "See my results" : "Next"} <ArrowRight />
            </Button>
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
