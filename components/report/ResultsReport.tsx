"use client";

import { AssumptionsList } from "@/components/layout/AssumptionsExpander";
import { ANSWERS } from "@/components/results/EotCheck";
import { ROWS } from "@/components/results/OptionsTable";
import { EOT_QUESTIONS } from "@/lib/engine/eot";
import type { EotAnswers, Results, Snapshot } from "@/lib/engine/types";
import { formatMoney, formatRange } from "@/lib/format";
import {
  FAMILY_INTEREST,
  INDUSTRIES,
  PRIORITY_LABELS,
  PROVINCES,
  YEARS_TO_EXIT,
  type Choice,
} from "@/lib/snapshot/questions";
import { FigureRow, KeyValueGrid, ReportDocument, ReportNotice, ReportSection, ReportTable } from "./Report";

const labelOf = <T extends string>(choices: Choice<T>[], value: T | string) =>
  choices.find((c) => c.value === value)?.label ?? String(value);

/** The printed /results page: an exit options report for the owner's accountant. */
export function ResultsReport({
  snapshot,
  results,
  eotAnswers,
  isExample,
}: {
  snapshot: Snapshot;
  results: Results;
  eotAnswers: EotAnswers;
  isExample: boolean;
}) {
  const name = snapshot.businessName?.trim() || "Your business";
  const { readiness, valuation, eot, options, bestMatch } = results;
  const best = options.find((o) => o.id === bestMatch);
  const outside = options.find((o) => o.id === "canadian");
  const gain =
    best?.afterTax !== undefined && outside?.afterTax !== undefined && best.id !== "canadian"
      ? best.afterTax - outside.afterTax
      : 0;
  const priced = options.filter((o) => o.afterTax !== undefined && o.status !== "unavailable");
  const maxAfterTax = Math.max(...priced.map((o) => o.afterTax as number), 1);
  const bestColumn = options.findIndex((o) => o.id === bestMatch) + 1;

  return (
    <ReportDocument
      kind="Exit planning report"
      title="Exit Options Report"
      subtitle={`${labelOf(INDUSTRIES, snapshot.industry)} · ${labelOf(PROVINCES, snapshot.province)} · ${snapshot.employees} employees · founded ${snapshot.yearFounded}`}
      preparedFor={name}
      isExample={isExample}
    >
      <ReportSection number={1} title="Summary" keepTogether>
        <FigureRow
          figures={[
            {
              label: "Estimated value",
              value: formatRange(valuation.low, valuation.high),
              note: `Midpoint ${formatMoney(valuation.midpoint)}`,
            },
            { label: "Readiness to sell", value: `${readiness.score} / 100`, note: readiness.bandLabel },
            ...(best?.afterTax !== undefined
              ? [{ label: "Best match, after tax", value: formatMoney(best.afterTax), note: best.name }]
              : []),
          ]}
        />
        {best && (
          <p>
            Based on the priorities you ranked ({snapshot.priorities.map((p) => PRIORITY_LABELS[p].toLowerCase()).join(", ")}),
            the option that fits best is to <strong>{best.name.charAt(0).toLowerCase() + best.name.slice(1)}</strong>
            {best.afterTax !== undefined && <>, which could leave you about {formatMoney(best.afterTax)} after tax</>}
            {gain > 0 && <>, roughly {formatMoney(gain)} more than selling to an outside buyer</>}.
          </p>
        )}
        <KeyValueGrid
          items={[
            ["Industry", labelOf(INDUSTRIES, snapshot.industry)],
            ["Province or territory", labelOf(PROVINCES, snapshot.province)],
            ["Annual revenue", formatMoney(snapshot.revenue)],
            ["Profit before owner's pay (SDE)", formatMoney(snapshot.sde)],
            ["Equipment and inventory", formatMoney(snapshot.tangibleAssets)],
            ["Employees", snapshot.employees],
            ["Owner's age", snapshot.ownerAge],
            ["Planned exit", labelOf(YEARS_TO_EXIT, String(snapshot.yearsToExit))],
            ["Family member interested", labelOf(FAMILY_INTEREST, snapshot.familyInterest)],
            ["Year founded", snapshot.yearFounded],
          ]}
        />
      </ReportSection>

      <ReportSection number={2} title="Exit options compared">
        <ReportTable
          highlightColumn={bestColumn}
          colClassNames={["w-[15%]"]}
          head={[
            "",
            ...options.map((o) => (
              <span key={o.id} className="block">
                {o.name}
                {o.id === bestMatch && (
                  <span className="block text-[7.5pt] font-normal text-primary">Best match for your priorities</span>
                )}
                {o.status !== "available" && o.statusNote && (
                  <span className="block text-[7.5pt] font-normal text-neutral-600">{o.statusNote}</span>
                )}
              </span>
            )),
          ]}
          rows={ROWS.map((row) => [
            row.label,
            ...options.map((o) => (
              <span key={o.id} className={row.emphasis ? "font-semibold" : undefined}>
                {row.render(o)}
              </span>
            )),
          ])}
        />
        <p className="text-[8pt] text-neutral-600">
          Options are ordered by how well they fit your priorities, best match first. If you sell to your employees, you
          may also be able to use your lifetime exemption; ask your accountant.
        </p>

        {priced.length > 0 && (
          <figure className="break-inside-avoid space-y-1 pt-1">
            <figcaption className="text-[8pt] font-semibold">Figure 1. Estimated after-tax proceeds by option</figcaption>
            {[...priced]
              .sort((a, b) => (b.afterTax as number) - (a.afterTax as number))
              .map((o) => (
                <div key={o.id} className="grid grid-cols-[12rem_1fr_4rem] items-center gap-2 text-[8pt]">
                  <span>{o.name.replace(/ or a large company/, "")}</span>
                  <span className="h-2.5 bg-neutral-200 [print-color-adjust:exact]">
                    <span
                      className={
                        o.id === bestMatch
                          ? "block h-full bg-primary [print-color-adjust:exact]"
                          : "block h-full bg-neutral-500 [print-color-adjust:exact]"
                      }
                      style={{ width: `${((o.afterTax as number) / maxAfterTax) * 100}%` }}
                    />
                  </span>
                  <span className="text-right font-semibold tabular-nums">{formatMoney(o.afterTax as number)}</span>
                </div>
              ))}
          </figure>
        )}
      </ReportSection>

      <ReportSection number={3} title="Readiness to sell" keepTogether>
        <p>
          <strong>
            {readiness.score} out of 100 ({readiness.bandLabel.toLowerCase()}).
          </strong>{" "}
          {readiness.runwayNote}
        </p>
        <div className="grid grid-cols-[2fr_3fr] gap-5">
          <ReportTable
            head={["Factor", "Score", "Max"]}
            colClassNames={["", "w-12 text-right tabular-nums", "w-12 text-right tabular-nums"]}
            rows={readiness.factors.map((f) => [f.label, f.points, f.max])}
          />
          <div className="space-y-1">
            <p className="text-[8.5pt] font-semibold">Changes that would raise the score most</p>
            <ol className="space-y-1.5 text-[8.5pt]">
              {readiness.topFixes.map((fix, i) => (
                <li key={fix.factor} className="grid grid-cols-[1.1rem_1fr_3.2rem] gap-1">
                  <span className="tabular-nums">{i + 1}.</span>
                  <span>
                    <strong>{fix.label}.</strong> {fix.reason}
                  </span>
                  <span className="text-right font-semibold text-primary tabular-nums">+{fix.gain} pts</span>
                </li>
              ))}
              {readiness.topFixes.length === 0 && <li>No major gaps. Keep your records and processes up to date.</li>}
            </ol>
          </div>
        </div>
      </ReportSection>

      <ReportSection number={4} title="Estimated value" keepTogether>
        <ReportTable
          head={["Item", "Estimate"]}
          colClassNames={["w-1/2", "tabular-nums"]}
          rows={[
            ["Profit before owner's pay (SDE)", formatMoney(snapshot.sde)],
            ["Industry multiple, adjusted for readiness", `${valuation.multiple.toFixed(2)}×`],
            ["Midpoint estimate", <strong key="m">{formatMoney(valuation.midpoint)}</strong>],
            ["Likely range (±15%)", formatRange(valuation.low, valuation.high)],
          ]}
        />
        <p className="text-[8pt] text-neutral-600">
          Seller&apos;s discretionary earnings (SDE) is profit plus the owner&apos;s own pay, perks and one-time costs.
          A Chartered Business Valuator (CBV) can give you a formal, independent value.
        </p>
      </ReportSection>

      <ReportSection number={5} title="Selling to your employees: EOT eligibility" keepTogether>
        <p>
          <strong>Result: {eot.label}.</strong> An Employee Ownership Trust buys the company on behalf of its employees
          and pays you over time from company profits. Up to $10M of your gain can be tax-free if the conditions are met.
        </p>
        <ReportTable
          head={["#", "Question", "Your answer"]}
          colClassNames={["w-6 tabular-nums", "", "w-24 whitespace-nowrap"]}
          rows={EOT_QUESTIONS.map((q, i) => [
            i + 1,
            q.text,
            ANSWERS.find((a) => a.value === eotAnswers[q.id])?.label ?? "Not answered",
          ])}
        />
      </ReportSection>

      <ReportSection number={6} title="Assumptions and limitations" keepTogether>
        <AssumptionsList snapshot={snapshot} />
      </ReportSection>

      <ReportNotice />
    </ReportDocument>
  );
}
