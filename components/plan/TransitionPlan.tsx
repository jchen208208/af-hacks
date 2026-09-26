"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AssumptionsExpander } from "@/components/layout/AssumptionsExpander";
import { Disclaimer } from "@/components/layout/Disclaimer";
import { NeedsSnapshot } from "@/components/layout/NeedsSnapshot";
import { PageIntro } from "@/components/layout/PageIntro";
import { PlaceholderBadge } from "@/components/layout/Placeholder";
import { PrintButton } from "@/components/layout/PrintButton";
import { runEngine, runPlan } from "@/lib/engine";
import type { OptionId, Snapshot } from "@/lib/engine/types";
import { formatMoney } from "@/lib/format";
import { useSnapshot } from "@/lib/state/SnapshotContext";
import { AdvisorCards } from "./AdvisorCards";
import { Checklist } from "./Checklist";
import { Timeline } from "./Timeline";

export const PLAN_TITLES: Record<OptionId, string> = {
  family: "passing it to family",
  canadian: "selling to a Canadian buyer",
  pe: "selling to private equity or a large company",
  eot: "selling to your employees",
  winddown: "winding down",
};

function PlanBody({ option, snapshot }: { option: OptionId; snapshot: Snapshot }) {
  const { eotAnswers } = useSnapshot();
  const results = runEngine(snapshot, eotAnswers);
  const steps = runPlan(option, snapshot);
  const chosen = results.options.find((o) => o.id === option);

  // TODO(Phase 4): template summary built from engine output; Phase 6 swaps in the AI narrative.
  const summary = chosen?.afterTax
    ? `Based on your answers, ${PLAN_TITLES[option]} could leave you with about ${formatMoney(chosen.afterTax)} after tax. Your readiness score is ${results.readiness.score} out of 100, so the first steps below focus on the changes that will make the biggest difference to buyers.`
    : `This plan walks you through ${PLAN_TITLES[option]}, starting with the changes that will make the biggest difference.`;

  return (
    <div className="mx-auto max-w-4xl space-y-12 px-4 py-12 sm:px-6">
      <div className="space-y-6">
        <Button asChild variant="ghost" size="lg" className="no-print -ml-2 text-base">
          <Link href="/results#options">
            <ArrowLeft /> Back to exit options
          </Link>
        </Button>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <PageIntro eyebrow="Transition plan" title={`Your plan: ${PLAN_TITLES[option]}`} />
          <div className="flex items-center gap-3">
            <PlaceholderBadge phase={4} />
            <PrintButton />
          </div>
        </div>
        <p className="rounded-xl bg-secondary px-6 py-5 text-lg leading-relaxed text-secondary-foreground">{summary}</p>
        <Disclaimer />
      </div>

      <section aria-labelledby="timeline-title" className="space-y-6">
        <h2 id="timeline-title" className="text-2xl font-semibold">
          Year by year
        </h2>
        <Timeline steps={steps} />
      </section>

      <section aria-labelledby="checklist-title" className="space-y-6">
        <h2 id="checklist-title" className="text-2xl font-semibold">
          Your checklist
        </h2>
        <Checklist option={option} steps={steps} />
      </section>

      <section aria-labelledby="advisors-title" className="space-y-6">
        <h2 id="advisors-title" className="text-2xl font-semibold">
          Who to talk to
        </h2>
        <AdvisorCards option={option} />
      </section>

      <AssumptionsExpander />
    </div>
  );
}

export function TransitionPlan({ option }: { option: OptionId }) {
  return <NeedsSnapshot>{(snapshot) => <PlanBody option={option} snapshot={snapshot} />}</NeedsSnapshot>;
}
