"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useSnapshot } from "@/lib/state/SnapshotContext";
import { STEP_SCHEMAS, STEP_TITLES } from "@/lib/snapshot/questions";
import { StepBusiness, StepNumbers, StepOperations, StepOwner } from "./steps";

const STEPS = [StepBusiness, StepNumbers, StepOperations, StepOwner];

export function SnapshotWizard() {
  const { draft, update, step, setStep, hydrated, loadDemo, isDemo } = useSnapshot();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  if (!hydrated) return <div className="h-96 animate-pulse rounded-xl bg-muted" aria-busy />;

  const StepComponent = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const next = () => {
    const result = STEP_SCHEMAS[step].safeParse(draft);
    if (!result.success) {
      const found: Record<string, string> = {};
      for (const issue of result.error.issues) {
        found[String(issue.path[0])] ??= issue.message;
      }
      setErrors(found);
      return;
    }
    setErrors({});
    if (isLast) router.push("/results");
    else setStep(step + 1);
    window.scrollTo({ top: 0 });
  };

  const back = () => {
    setErrors({});
    setStep(step - 1);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="flex items-baseline justify-between text-sm text-muted-foreground">
          <span>
            Step {step + 1} of {STEPS.length}
          </span>
          <button type="button" onClick={loadDemo} className="underline underline-offset-4 hover:text-foreground">
            {isDemo ? "Example loaded" : "Fill with an example"}
          </button>
        </div>
        <Progress value={((step + 1) / STEPS.length) * 100} aria-label="Progress" />
        <h2 className="pt-2 text-2xl font-semibold">{STEP_TITLES[step]}</h2>
      </div>

      <form
        className="space-y-8"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          next();
        }}
      >
        <StepComponent draft={draft} update={update} errors={errors} />

        <div className="flex items-center justify-between border-t pt-6">
          <Button type="button" variant="ghost" size="xl" onClick={back} disabled={step === 0}>
            <ArrowLeft /> Back
          </Button>
          <Button type="submit" size="xl">
            {isLast ? "See my results" : "Next"} <ArrowRight />
          </Button>
        </div>
      </form>
    </div>
  );
}
