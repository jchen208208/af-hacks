"use client";

import { ADVISORS, CALLOUTS } from "@/components/plan/AdvisorCards";
import type { ExitOption, OptionId, PlanStep, Results, Snapshot } from "@/lib/engine/types";
import { formatMoney } from "@/lib/format";
import { YEARS_TO_EXIT } from "@/lib/snapshot/questions";
import { FigureRow, ReportDocument, ReportNotice, ReportSection, ReportTable } from "./Report";

/** A printed checkbox: an empty square, or one with a tick for steps already done. */
function Box({ checked }: { checked: boolean }) {
  return (
    <span className="mt-[1px] grid size-[9pt] shrink-0 place-items-center border border-neutral-500 text-[7pt] leading-none font-bold text-primary">
      {checked ? "✓" : ""}
    </span>
  );
}

/** The printed /plan page: a transition plan document for the chosen exit option. */
export function PlanReport({
  option,
  chosen,
  snapshot,
  results,
  steps,
  summary,
  done,
  isExample,
}: {
  option: OptionId;
  chosen: ExitOption | undefined;
  snapshot: Snapshot;
  results: Results;
  steps: PlanStep[];
  summary: string;
  done: Record<string, boolean>;
  isExample: boolean;
}) {
  const name = snapshot.businessName?.trim() || "Your business";
  const runway = YEARS_TO_EXIT.find((c) => c.value === String(snapshot.yearsToExit))?.label ?? "";
  const callout = CALLOUTS[option];
  const doneCount = steps.filter((s) => done[s.id]).length;

  return (
    <ReportDocument
      kind="Transition plan"
      title={`Transition Plan: ${chosen?.name ?? "Your exit"}`}
      subtitle={`${name} · planned exit: ${runway.toLowerCase()}`}
      preparedFor={name}
      isExample={isExample}
    >
      <ReportSection number={1} title="Summary" keepTogether>
        <p>{summary}</p>
        {chosen && (
          <FigureRow
            figures={[
              {
                label: "Estimated after tax",
                value: chosen.afterTax !== undefined ? formatMoney(chosen.afterTax) : "Not estimated",
              },
              { label: "Time to complete", value: chosen.time },
              { label: "Employees", value: chosen.employees.replace(/ — .*/, "") },
              { label: "Readiness today", value: `${results.readiness.score} / 100` },
            ]}
          />
        )}
        {chosen?.statusNote && (
          <p className="text-[8.5pt]">
            <strong>Note:</strong> {chosen.statusNote}
          </p>
        )}
      </ReportSection>

      <ReportSection number={2} title="Steps and timing">
        <ReportTable
          head={["#", "When", "Step"]}
          colClassNames={["w-6 tabular-nums", "w-[22%]", ""]}
          rows={steps.map((s, i) => [
            i + 1,
            <span key="w" className="font-semibold">
              {s.when}
              {s.id.startsWith("fix-") && (
                <span className="block text-[7.5pt] font-normal text-neutral-600">Readiness fix</span>
              )}
            </span>,
            <span key="s">
              <strong>{s.title}.</strong> {s.detail}
            </span>,
          ])}
        />
      </ReportSection>

      <ReportSection number={3} title="Checklist" keepTogether>
        <p className="text-[8.5pt] text-neutral-600">
          {doneCount} of {steps.length} steps done as of the date of this plan.
        </p>
        <ul className="grid grid-cols-2 gap-x-6 gap-y-1 text-[8.5pt]">
          {steps.map((s) => (
            <li key={s.id} className="flex gap-2">
              <Box checked={!!done[s.id]} />
              <span>{s.title}</span>
            </li>
          ))}
        </ul>
      </ReportSection>

      <ReportSection number={4} title="Who to talk to" keepTogether>
        <ReportTable
          head={["Advisor", "How they help with this plan"]}
          colClassNames={["w-[40%]", ""]}
          rows={ADVISORS.map((a) => [a.title, a.body[option]])}
        />
        <p className="text-[8.5pt]">
          <strong>{callout.lead}</strong> {callout.text}
        </p>
      </ReportSection>

      <ReportNotice />
    </ReportDocument>
  );
}
