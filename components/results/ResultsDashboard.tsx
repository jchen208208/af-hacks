"use client";

import Link from "next/link";
import { AssumptionsExpander } from "@/components/layout/AssumptionsExpander";
import { Disclaimer } from "@/components/layout/Disclaimer";
import { NeedsSnapshot } from "@/components/layout/NeedsSnapshot";
import { PageIntro } from "@/components/layout/PageIntro";
import { PlaceholderBadge } from "@/components/layout/Placeholder";
import { PrintButton } from "@/components/layout/PrintButton";
import { runEngine } from "@/lib/engine";
import type { Results, Snapshot } from "@/lib/engine/types";
import { formatMoney } from "@/lib/format";
import { useSnapshot } from "@/lib/state/SnapshotContext";
import { AfterTaxChart } from "./AfterTaxChart";
import { EotCheck } from "./EotCheck";
import { OptionsTable } from "./OptionsTable";
import { ReadinessSection } from "./ReadinessSection";
import { ValueRange } from "./ValueRange";

const SECTIONS = [
  { id: "options", label: "Exit options" },
  { id: "readiness", label: "Readiness" },
  { id: "value", label: "Value" },
  { id: "eot", label: "Selling to employees" },
];

function Section({ id, title, intro, children }: { id: string; title: string; intro?: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24 space-y-6 border-t py-12">
      <div className="space-y-2">
        <h2 id={`${id}-title`} className="text-2xl font-semibold sm:text-3xl">
          {title}
        </h2>
        {intro && <p className="max-w-2xl text-lg text-muted-foreground">{intro}</p>}
      </div>
      {children}
    </section>
  );
}

/** One-line headline comparing the best match to selling to an outside buyer. */
function Headline({ results }: { results: Results }) {
  const best = results.options.find((o) => o.id === results.bestMatch);
  const outside = results.options.find((o) => o.id === "canadian");
  if (!best || best.afterTax === undefined || !outside?.afterTax || best.id === "canadian") return null;
  const diff = best.afterTax - outside.afterTax;
  if (diff <= 0) return null;
  return (
    <p className="rounded-xl bg-secondary px-6 py-5 text-xl leading-relaxed text-secondary-foreground">
      <strong>{best.name}</strong> could leave you about{" "}
      <strong className="font-heading text-2xl">{formatMoney(diff)} more</strong> than selling to an outside
      buyer.
    </p>
  );
}

function Dashboard({ snapshot }: { snapshot: Snapshot }) {
  const { eotAnswers, isDemo } = useSnapshot();
  const results = runEngine(snapshot, eotAnswers);
  const name = snapshot.businessName || "your business";

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-6 pb-8">
        <PageIntro eyebrow={isDemo ? "Example" : "Your results"} title={`Exit options for ${name}`}>
          Every realistic way to step away, side by side, with what you&apos;d keep after tax.
        </PageIntro>
        <div className="flex items-center gap-3">
          <PlaceholderBadge phase={1} />
          <PrintButton />
        </div>
      </div>

      <nav aria-label="Sections" className="no-print sticky top-0 z-10 -mx-4 mb-4 overflow-x-auto bg-background/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <ul className="flex gap-2">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <Link href={`#${s.id}`} className="block rounded-full border px-4 py-2 text-base whitespace-nowrap hover:bg-muted">
                {s.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <Disclaimer />

      <Section id="options" title="Your exit options">
        <Headline results={results} />
        <OptionsTable options={results.options} bestMatch={results.bestMatch} />
        <AfterTaxChart options={results.options} bestMatch={results.bestMatch} />
        <p className="text-base text-muted-foreground">
          Selling to employees? You may also be able to use your lifetime exemption — ask your accountant.
        </p>
      </Section>

      <Section id="readiness" title="How ready is your business to sell?" intro="Buyers pay more for a business that runs well without its owner. Here's where you stand today.">
        <ReadinessSection readiness={results.readiness} />
      </Section>

      <Section id="value" title="What your business may be worth">
        <ValueRange valuation={results.valuation} />
      </Section>

      <Section id="eot" title="Could you sell to your employees?" intro="Six quick questions about the Employee Ownership Trust rules.">
        <EotCheck result={results.eot} />
      </Section>

      <div className="space-y-4 border-t pt-12">
        <AssumptionsExpander />
        <Disclaimer />
      </div>
    </div>
  );
}

export function ResultsDashboard() {
  return <NeedsSnapshot>{(snapshot) => <Dashboard snapshot={snapshot} />}</NeedsSnapshot>;
}
