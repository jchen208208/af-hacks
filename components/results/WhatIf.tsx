"use client";

import { ArrowRight, RotateCcw, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { READINESS_FACTORS } from "@/lib/config/assumptions";
import { runEngine } from "@/lib/engine";
import type { EotAnswers, Results, Snapshot } from "@/lib/engine/types";
import { applyWhatIf, fixAnswers, WHATIF_FIELDS, type WhatIfAnswers, type WhatIfFactor } from "@/lib/engine/whatif";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";

type Choice = { value: string; label: string };

/** Short answer labels, worst to best, so moving right always helps. */
const CHOICES: Record<WhatIfFactor, Choice[]> = {
  records: [
    { value: "messy", label: "Messy or behind" },
    { value: "bookkeeping", label: "Bookkeeping only" },
    { value: "review", label: "Accountant-reviewed" },
    { value: "audited", label: "Accountant-prepared" },
  ],
  ownerDependence: [
    { value: "no", label: "No" },
    { value: "mostly", label: "Mostly" },
    { value: "yes", label: "Yes" },
  ],
  management: [
    { value: "0", label: "Nobody yet" },
    { value: "1", label: "1 person" },
    { value: "2", label: "2 or more" },
  ],
  customerConcentration: [
    { value: "gt50", label: "More than 50%" },
    { value: "25to50", label: "25–50%" },
    { value: "10to25", label: "10–25%" },
    { value: "lt10", label: "Less than 10%" },
  ],
  processes: [
    { value: "few", label: "Very little" },
    { value: "some", label: "Some things" },
    { value: "most", label: "Most things" },
  ],
};

/** The question each factor asks, in the owner's words. */
const QUESTIONS: Record<WhatIfFactor, string> = {
  records: "Your financial records",
  ownerDependence: "Could it run for a month without you?",
  management: "People who could run it day to day",
  customerConcentration: "Biggest customer's share of sales",
  processes: "How much is written down",
};

const FACTORS = Object.keys(WHATIF_FIELDS) as WhatIfFactor[];

function signed(delta: number, format: (n: number) => string): string {
  const shown = format(Math.abs(delta));
  if (shown === format(0)) return "No change";
  return `${delta > 0 ? "+" : "−"}${shown}`;
}

function FactorChoice({
  factor,
  snapshot,
  scenario,
  points,
  onChange,
}: {
  factor: WhatIfFactor;
  snapshot: Snapshot;
  scenario: Snapshot;
  points: number;
  onChange: (value: string) => void;
}) {
  const field = WHATIF_FIELDS[factor];
  const today = String(snapshot[field]);
  const current = String(scenario[field]);
  return (
    <fieldset className="space-y-3">
      <legend className="flex w-full justify-between gap-4 text-base">
        <span className="font-semibold">{QUESTIONS[factor]}</span>
        <span className="shrink-0 font-semibold text-muted-foreground tabular-nums">
          {points} / {READINESS_FACTORS[factor].max}
          <span className="sr-only"> points</span>
        </span>
      </legend>
      <div className="flex flex-wrap gap-2">
        {CHOICES[factor].map((c) => (
          <label key={c.value} className="cursor-pointer">
            <input
              type="radio"
              name={`whatif-${factor}`}
              value={c.value}
              checked={current === c.value}
              onChange={() => onChange(c.value)}
              className="peer sr-only"
            />
            <span
              className={cn(
                "flex items-center gap-2 rounded-full border px-4 py-2 text-base transition-colors",
                "border-border bg-background hover:border-primary/60",
                "peer-checked:border-hero peer-checked:bg-hero peer-checked:text-hero-foreground",
                "peer-focus-visible:ring-3 peer-focus-visible:ring-primary/40",
              )}
            >
              {c.label}
              {c.value === today && (
                <span className="rounded-full bg-current/15 px-2 text-sm font-semibold">today</span>
              )}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

interface Row {
  label: string;
  short: string;
  today: string;
  whatIf: string;
  delta: string;
  note?: string;
}

function readoutRows(today: Results, whatIf: Results): Row[] {
  const bestToday = today.options[0];
  const bestWhatIf = whatIf.options[0];
  const bandToday = today.readiness.bandLabel;
  const bandWhatIf = whatIf.readiness.bandLabel;
  const rows: Row[] = [
    {
      label: "Readiness score",
      short: "Score",
      today: String(today.readiness.score),
      whatIf: String(whatIf.readiness.score),
      delta: signed(whatIf.readiness.score - today.readiness.score, (n) => `${n} points`),
      note: bandToday === bandWhatIf ? bandWhatIf : `${bandToday} → ${bandWhatIf}`,
    },
    {
      label: "Value (midpoint)",
      short: "Value",
      today: formatMoney(today.valuation.midpoint),
      whatIf: formatMoney(whatIf.valuation.midpoint),
      delta: signed(whatIf.valuation.midpoint - today.valuation.midpoint, formatMoney),
    },
  ];
  if (bestToday.afterTax !== undefined && bestWhatIf.afterTax !== undefined) {
    rows.push({
      label: "What you'd keep after tax",
      short: "You keep",
      today: formatMoney(bestToday.afterTax),
      whatIf: formatMoney(bestWhatIf.afterTax),
      delta: signed(bestWhatIf.afterTax - bestToday.afterTax, formatMoney),
      note: bestWhatIf.id === bestToday.id ? bestWhatIf.name : `Best match changes to ${bestWhatIf.name}`,
    });
  }
  return rows;
}

/** Desktop: today → what if, one figure per row. */
function Readout({ rows }: { rows: Row[] }) {
  return (
    <div className="rounded-2xl bg-hero p-8 text-hero-foreground shadow-sm">
      <div className="flex justify-between text-sm font-semibold tracking-[0.12em] text-hero-muted uppercase">
        <span>Today</span>
        <span>What if</span>
      </div>
      <dl className="divide-y divide-white/15">
        {rows.map((r) => (
          <div key={r.label} className="space-y-1.5 py-5 last:pb-0">
            <dt className="flex justify-between gap-3 text-base">
              <span className="font-semibold">{r.label}</span>
              <span className="shrink-0 font-semibold text-highlight">{r.delta}</span>
            </dt>
            <dd className="flex items-baseline justify-between gap-3">
              <span className="font-heading text-2xl font-semibold text-hero-muted tabular-nums">{r.today}</span>
              <span className="flex items-baseline gap-3">
                <ArrowRight className="size-5 self-center text-hero-muted" aria-label="becomes" />
                <span className="font-heading text-4xl font-semibold text-highlight tabular-nums">{r.whatIf}</span>
              </span>
            </dd>
            {r.note && <dd className="text-right text-base text-hero-muted">{r.note}</dd>}
          </div>
        ))}
      </dl>
    </div>
  );
}

/** Phones: a compact bar of what-if figures that stays at the bottom of the screen while the answers scroll by. */
function ReadoutBar({ rows }: { rows: Row[] }) {
  return (
    <dl className="grid grid-cols-3 divide-x divide-white/15 rounded-2xl bg-hero py-3 text-hero-foreground shadow-[0_-8px_24px_-12px_rgb(0_0_0/0.45)]">
      {rows.map((r) => (
        <div key={r.label} className="flex flex-col items-center gap-0.5 px-2 text-center">
          <dt className="text-sm font-semibold text-hero-muted">
            {r.short}
            <span className="sr-only">, was {r.today}</span>
          </dt>
          <dd className="font-heading text-2xl font-semibold text-highlight tabular-nums">{r.whatIf}</dd>
          <dd className="text-sm font-semibold">{r.delta}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Try different readiness answers and see the score, value and after-tax figure move. The rest of the page keeps the owner's real answers. */
export function WhatIf({ snapshot, eotAnswers, results }: { snapshot: Snapshot; eotAnswers: EotAnswers; results: Results }) {
  const [answers, setAnswers] = useState<WhatIfAnswers>({});
  const scenario = applyWhatIf(snapshot, answers);
  const whatIf = runEngine(scenario, eotAnswers);
  const rows = readoutRows(results, whatIf);
  const points = Object.fromEntries(whatIf.readiness.factors.map((f) => [f.factor, f.points]));

  const topFixes = results.readiness.topFixes;
  const fixes = fixAnswers(topFixes.map((f) => f.factor));
  const changed = FACTORS.some((f) => scenario[WHATIF_FIELDS[f]] !== snapshot[WHATIF_FIELDS[f]]);

  const setFactor = (factor: WhatIfFactor, value: string) => {
    const field = WHATIF_FIELDS[factor];
    setAnswers((a) => ({ ...a, [field]: field === "managers" ? Number(value) : value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        {topFixes.length > 0 && (
          <Button size="xl" onClick={() => setAnswers(fixes)}>
            <Sparkles aria-hidden /> Try my top {topFixes.length === 1 ? "fix" : `${topFixes.length} fixes`}
          </Button>
        )}
        <Button size="xl" variant="outline" onClick={() => setAnswers({})} disabled={!changed}>
          <RotateCcw aria-hidden /> Back to my answers
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        <div className="space-y-7 rounded-2xl border bg-card p-5 shadow-sm sm:p-8">
          {FACTORS.map((factor) => (
            <FactorChoice
              key={factor}
              factor={factor}
              snapshot={snapshot}
              scenario={scenario}
              points={points[factor]}
              onChange={(v) => setFactor(factor, v)}
            />
          ))}
        </div>
        <div className="hidden lg:sticky lg:top-24 lg:block">
          <Readout rows={rows} />
        </div>
      </div>

      <div className="sticky bottom-3 z-10 lg:hidden">
        <ReadoutBar rows={rows} />
      </div>

      <p className="sr-only" aria-live="polite">
        {changed
          ? `What if: readiness ${whatIf.readiness.score}, value ${formatMoney(whatIf.valuation.midpoint)}` +
            (whatIf.options[0].afterTax !== undefined ? `, you'd keep ${formatMoney(whatIf.options[0].afterTax)}.` : ".")
          : ""}
      </p>
    </div>
  );
}
