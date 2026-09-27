"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AssumptionsExpander } from "@/components/layout/AssumptionsExpander";
import { Disclaimer } from "@/components/layout/Disclaimer";
import { NeedsSnapshot } from "@/components/layout/NeedsSnapshot";
import { PageHero, heroButtonClass } from "@/components/layout/PageHero";
import { PrintButton } from "@/components/layout/PrintButton";
import { PlanReport } from "@/components/report/PlanReport";
import { runEngine, runPlan } from "@/lib/engine";
import type { ExitOption, OptionId, Snapshot } from "@/lib/engine/types";
import { formatMoney } from "@/lib/format";
import { planSummary } from "@/lib/narrative/template";
import { useSnapshot } from "@/lib/state/SnapshotContext";
import { cn } from "@/lib/utils";
import { AdvisorCards } from "./AdvisorCards";
import { Checklist, useChecklist } from "./Checklist";
import { Timeline } from "./Timeline";

export const PLAN_TITLES: Record<OptionId, string> = {
  family: "passing it to family",
  canadian: "selling to a Canadian buyer",
  pe: "selling to private equity or a large company",
  eot: "selling to your employees",
  winddown: "winding down",
};

/** Section heading in the landing's style: green uppercase eyebrow over a serif h2. */
function SectionHeading({ id, eyebrow, title }: { id: string; eyebrow: string; title: string }) {
  return (
    <div className="space-y-2 print:space-y-0">
      <p className="text-sm font-semibold tracking-[0.12em] text-primary uppercase print:hidden">{eyebrow}</p>
      <h2 id={id} className="text-3xl font-semibold sm:text-4xl print:text-xl">
        {title}
      </h2>
    </div>
  );
}

/** Dark band of key facts for the chosen option, in the landing stats style. */
function KeyFacts({ option }: { option: ExitOption }) {
  // Unavailable options have no numbers: say so plainly (the note below says why) instead of a bare dash.
  const { afterTax } = option;
  const estimated = afterTax !== undefined;
  const facts = [
    {
      value: estimated ? formatMoney(afterTax) : "Not estimated",
      label: estimated ? "estimated after tax to you" : "after tax to you — see the note below",
      big: estimated,
    },
    { value: option.time, label: "time to complete" },
    { value: option.employees, label: "what happens to your employees" },
  ];
  return (
    <section
      aria-label="Key facts for this option"
      className="bg-band text-hero-foreground print:border-y print:bg-transparent print:text-foreground"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 print:px-0">
        <ul className="grid divide-y divide-white/15 sm:grid-cols-3 sm:divide-x sm:divide-y-0 print:grid-cols-3 print:divide-y-0">
          {facts.map((f) => (
            <li
              key={f.label}
              className="flex flex-col justify-end gap-1.5 py-7 sm:px-8 sm:py-10 sm:first:pl-0 sm:last:pr-0 print:px-3 print:py-2 print:first:pl-0"
            >
              <p
                className={cn(
                  "font-heading leading-tight font-semibold text-balance text-highlight print:text-primary",
                  f.big ? "text-5xl sm:text-6xl print:text-3xl" : "text-2xl sm:text-3xl print:text-lg",
                )}
              >
                {f.value}
              </p>
              <p className="text-base text-hero-muted print:text-sm print:text-muted-foreground">{f.label}</p>
            </li>
          ))}
        </ul>
        {option.statusNote && (
          <p className="border-t border-white/15 py-4 text-base text-hero-muted print:border-0 print:py-1 print:text-foreground">
            <strong className="font-semibold text-hero-foreground print:text-foreground">Note: </strong>
            {option.statusNote}
          </p>
        )}
      </div>
    </section>
  );
}

function PlanBody({ option, snapshot }: { option: OptionId; snapshot: Snapshot }) {
  const { eotAnswers, showingExample } = useSnapshot();
  const results = runEngine(snapshot, eotAnswers);
  const steps = runPlan(option, snapshot, eotAnswers);
  const chosen = results.options.find((o) => o.id === option);
  const { done, toggle } = useChecklist(option);

  // Template summary from engine output (Phase 6 can swap in the AI narrative, keeping this as the fallback).
  const summary = planSummary(option, snapshot, results);

  return (
    <>
      {/* Print shows a document-style report instead of the web page. */}
      <PlanReport
        option={option}
        chosen={chosen}
        snapshot={snapshot}
        results={results}
        steps={steps}
        summary={summary}
        done={done}
        isExample={showingExample}
      />
      <div className="print:hidden">
        <PageHero
          eyebrow="Transition plan"
          title={<span className="print:block print:text-3xl">Your plan: {PLAN_TITLES[option]}</span>}
          actions={
            <>
              <Button asChild variant="ghost" size="xl" className={heroButtonClass.outline}>
                <Link href="/results#options">
                  <ArrowLeft /> Back to exit options
                </Link>
              </Button>
              <PrintButton className={heroButtonClass.outline} />
            </>
          }
        >
          {/* Title and summary are smaller in print so the plan stays on 2 pages (block so the
              smaller line height applies instead of the hero's). */}
          <span className="print:block print:text-base print:leading-snug">{summary}</span>
        </PageHero>

        {chosen && <KeyFacts option={chosen} />}

        <div className="mx-auto max-w-6xl space-y-16 px-4 py-14 sm:px-6 print:space-y-5 print:px-0 print:py-4">
          <Disclaimer />

          <section aria-labelledby="timeline-title" className="space-y-8 print:space-y-3">
            <SectionHeading id="timeline-title" eyebrow="Your timeline" title="Step by step" />
            <div className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8 print:rounded-none print:border-0 print:p-0 print:shadow-none">
              <Timeline steps={steps} />
            </div>
          </section>

          <section aria-labelledby="checklist-title" className="space-y-8 print:space-y-3">
            <SectionHeading id="checklist-title" eyebrow="Track your progress" title="Your checklist" />
            <Checklist steps={steps} done={done} onToggle={toggle} />
          </section>

          <section aria-labelledby="advisors-title" className="space-y-8 print:space-y-3">
            <SectionHeading id="advisors-title" eyebrow="Your team" title="Who to talk to" />
            <AdvisorCards option={option} />
          </section>

          <AssumptionsExpander />
        </div>
      </div>
    </>
  );
}

export function TransitionPlan({ option }: { option: OptionId }) {
  return <NeedsSnapshot kind="plan">{(snapshot) => <PlanBody option={option} snapshot={snapshot} />}</NeedsSnapshot>;
}
