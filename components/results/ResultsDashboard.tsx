"use client";

import { AssumptionsExpander } from "@/components/layout/AssumptionsExpander";
import { Disclaimer } from "@/components/layout/Disclaimer";
import { NeedsSnapshot } from "@/components/layout/NeedsSnapshot";
import { PageHero, heroButtonClass } from "@/components/layout/PageHero";
import { PrintButton } from "@/components/layout/PrintButton";
import { ResultsReport } from "@/components/report/ResultsReport";
import { runEngine } from "@/lib/engine";
import type { Snapshot } from "@/lib/engine/types";
import { useSnapshot } from "@/lib/state/SnapshotContext";
import { AfterTaxChart } from "./AfterTaxChart";
import { EotCheck } from "./EotCheck";
import { FacetField, Sheet } from "./FacetField";
import { KeyFigures } from "./KeyFigures";
import { OptionsTable } from "./OptionsTable";
import { ReadinessSection } from "./ReadinessSection";
import { SectionNav, type NavSection } from "./SectionNav";
import { TopFixes } from "./TopFixes";
import { ValueRange } from "./ValueRange";
import { WhatIf } from "./WhatIf";

const SECTIONS: NavSection[] = [
  { id: "options", label: "Exit options" },
  { id: "readiness", label: "Readiness" },
  { id: "value", label: "Value" },
  { id: "fixes", label: "Top fixes" },
  { id: "whatif", label: "What if" },
  { id: "eot", label: "Selling to employees" },
];

function fixesTitle(count: number): string {
  if (count === 0) return "Your top fixes";
  return count === 1 ? "Your top fix" : `Your top ${count} fixes`;
}

/** One section of the continuous results sheet; siblings are split by the sheet's dividers. */
function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="scroll-mt-20 space-y-8 py-12 first:pt-2 sm:py-16 sm:first:pt-2"
    >
      <div className="max-w-3xl space-y-3">
        <p className="text-sm font-semibold tracking-[0.12em] text-primary uppercase">{eyebrow}</p>
        <h2 id={`${id}-title`} className="text-3xl font-semibold sm:text-4xl">
          {title}
        </h2>
        {intro && <p className="text-lg leading-relaxed text-muted-foreground">{intro}</p>}
      </div>
      {children}
    </section>
  );
}

function Dashboard({ snapshot }: { snapshot: Snapshot }) {
  const { eotAnswers, showingExample } = useSnapshot();
  const results = runEngine(snapshot, eotAnswers);
  const name = snapshot.businessName || "your business";

  return (
    <>
      {/* Print shows a document-style report instead of the web page. */}
      <ResultsReport snapshot={snapshot} results={results} eotAnswers={eotAnswers} isExample={showingExample} />
      <div className="print:hidden">
        <PageHero
          eyebrow={showingExample ? "Example" : "Your results"}
          title={`Exit options for ${name}`}
          actions={<PrintButton className={heroButtonClass.outline} />}
        >
          Every realistic way to step away, side by side, with what you&apos;d keep after tax.
        </PageHero>

        <KeyFigures results={results} />

        <SectionNav sections={SECTIONS} />

        {/* Faceted green field; beige sheets float on it for the dense reading. Negative bottom margin lets the
            green run into the footer's top margin so there's no beige strip before the dark footer. */}
        <FacetField className="-mb-16">
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-band to-transparent" />
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-band to-transparent" />

          <div className="mx-auto max-w-6xl px-4 pt-12 pb-24 sm:px-6 sm:pt-16">
            {/* One continuous sheet so the sections read as a single connected page, split only by dividers. */}
            <Sheet className="divide-y p-5 sm:p-10 lg:p-14">
              <Section
                id="options"
                eyebrow="Compare"
                title="Your exit options"
                intro="Price, tax and what you keep — plus what happens to your people and how long it takes."
              >
                <Disclaimer />
                <OptionsTable options={results.options} bestMatch={results.bestMatch} />
                <p className="text-base text-muted-foreground">
                  Selling to employees? You may also be able to use your lifetime exemption — ask your accountant.
                </p>
                <AfterTaxChart options={results.options} bestMatch={results.bestMatch} />
              </Section>

              <Section
                id="readiness"
                eyebrow="Readiness"
                title="How ready is your business to sell?"
                intro="Buyers pay more for a business that runs well without its owner. Here's where you stand today."
              >
                <ReadinessSection readiness={results.readiness} />
              </Section>

              <Section id="value" eyebrow="Value" title="What your business may be worth">
                <ValueRange valuation={results.valuation} sde={snapshot.sde} />
              </Section>

              <Section
                id="fixes"
                eyebrow="Top fixes"
                title={fixesTitle(results.readiness.topFixes.length)}
                intro="The changes that would raise your readiness score the most, and with it what a buyer will pay."
              >
                <TopFixes fixes={results.readiness.topFixes} />
              </Section>

              <Section
                id="whatif"
                eyebrow="What if"
                title="What if you made some changes?"
                intro="Change any answer below and watch your score, value and what you'd keep move. The rest of this page still shows your real answers."
              >
                {/* Keyed so switching between the example and your own answers starts a fresh scenario. */}
                <WhatIf
                  key={showingExample ? "example" : "own"}
                  snapshot={snapshot}
                  eotAnswers={eotAnswers}
                  results={results}
                />
              </Section>

              <Section
                id="eot"
                eyebrow="Employee ownership"
                title="Could you sell to your employees?"
                intro="Six quick questions about the Employee Ownership Trust rules."
              >
                <EotCheck result={results.eot} />
              </Section>

              <div className="space-y-4 pt-12 sm:pt-16">
                <AssumptionsExpander snapshot={snapshot} />
                <Disclaimer />
              </div>
            </Sheet>
          </div>
        </FacetField>
      </div>
    </>
  );
}

export function ResultsDashboard() {
  return <NeedsSnapshot>{(snapshot) => <Dashboard snapshot={snapshot} />}</NeedsSnapshot>;
}
