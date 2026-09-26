"use client";

import { AssumptionsExpander } from "@/components/layout/AssumptionsExpander";
import { Disclaimer } from "@/components/layout/Disclaimer";
import { NeedsSnapshot } from "@/components/layout/NeedsSnapshot";
import { PageHero, heroButtonClass } from "@/components/layout/PageHero";
import { PrintButton } from "@/components/layout/PrintButton";
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
import { ValueRange } from "./ValueRange";

const SECTIONS: NavSection[] = [
  { id: "options", label: "Exit options" },
  { id: "readiness", label: "Readiness" },
  { id: "value", label: "Value" },
  { id: "eot", label: "Selling to employees" },
];

/** Section whose heading sits directly on the green facet field (white serif title, mint eyebrow). */
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
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24 space-y-8 pt-20 first:pt-14 print:space-y-3 print:pt-6">
      <div className="max-w-3xl space-y-3 print:space-y-1">
        <p className="text-sm font-semibold tracking-[0.12em] text-highlight uppercase print:text-primary">{eyebrow}</p>
        <h2
          id={`${id}-title`}
          className="text-3xl font-semibold text-hero-foreground sm:text-4xl print:text-2xl print:text-foreground"
        >
          {title}
        </h2>
        {intro && <p className="text-lg leading-relaxed text-hero-muted print:text-muted-foreground">{intro}</p>}
      </div>
      {children}
    </section>
  );
}

function Dashboard({ snapshot }: { snapshot: Snapshot }) {
  const { eotAnswers, isDemo } = useSnapshot();
  const results = runEngine(snapshot, eotAnswers);
  const name = snapshot.businessName || "your business";

  return (
    <>
      <PageHero
        eyebrow={isDemo ? "Example" : "Your results"}
        title={`Exit options for ${name}`}
        actions={<PrintButton className={heroButtonClass.outline} />}
      >
        Every realistic way to step away, side by side, with what you&apos;d keep after tax.
      </PageHero>

      <KeyFigures results={results} />

      <SectionNav sections={SECTIONS} />

      {/* Faceted green field; beige sheets float on it for the dense reading. Negative bottom margin lets the
          green run into the footer's top margin so there's no beige strip before the dark footer. */}
      <FacetField className="-mb-16 print:mb-0">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-band to-transparent print:hidden" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-band to-transparent print:hidden" />

        <div className="mx-auto max-w-6xl px-4 pb-24 sm:px-6 print:px-0 print:pb-0">
          <Section
            id="options"
            eyebrow="Compare"
            title="Your exit options"
            intro="Price, tax and what you keep — plus what happens to your people and how long it takes."
          >
            <Sheet className="space-y-6">
              <Disclaimer />
              <OptionsTable options={results.options} bestMatch={results.bestMatch} />
              <p className="text-base text-muted-foreground">
                Selling to employees? You may also be able to use your lifetime exemption — ask your accountant.
              </p>
            </Sheet>
            <AfterTaxChart options={results.options} bestMatch={results.bestMatch} />
          </Section>

          <Section
            id="readiness"
            eyebrow="Readiness"
            title="How ready is your business to sell?"
            intro="Buyers pay more for a business that runs well without its owner. Here's where you stand today."
          >
            <Sheet>
              <ReadinessSection readiness={results.readiness} />
            </Sheet>
          </Section>

          <Section id="value" eyebrow="Value" title="What your business may be worth">
            <Sheet>
              <ValueRange valuation={results.valuation} sde={snapshot.sde} />
            </Sheet>
          </Section>

          <Section
            id="eot"
            eyebrow="Employee ownership"
            title="Could you sell to your employees?"
            intro="Six quick questions about the Employee Ownership Trust rules."
          >
            <Sheet>
              <EotCheck result={results.eot} />
            </Sheet>
          </Section>

          <div className="pt-20 print:pt-6">
            <Sheet className="space-y-4">
              <AssumptionsExpander />
              <Disclaimer />
            </Sheet>
          </div>
        </div>
      </FacetField>
    </>
  );
}

export function ResultsDashboard() {
  return <NeedsSnapshot>{(snapshot) => <Dashboard snapshot={snapshot} />}</NeedsSnapshot>;
}
