"use client";

import type { SnapshotDraft } from "@/lib/state/SnapshotContext";
import type { Priority } from "@/lib/engine/types";
import {
  DEFAULT_PRIORITIES,
  DEFAULT_SHARES_COST_BASE,
  FAMILY_INTEREST,
  INDUSTRIES,
  MANAGERS,
  PRIORITY_LABELS,
  PROCESSES,
  PROVINCES,
  RECORDS,
  RUN_WITHOUT_OWNER,
  TOP_CUSTOMER,
  YEARS_TO_EXIT,
} from "@/lib/snapshot/questions";
import { ChoiceField, NumberField, RankField, SelectField, TextField } from "./fields";

/** Two fields side by side on wider screens. */
const PAIR = "grid gap-9 sm:grid-cols-2";

export interface StepProps {
  draft: SnapshotDraft;
  update: (patch: SnapshotDraft) => void;
  errors: Record<string, string>;
}

export function StepBusiness({ draft, update, errors }: StepProps) {
  return (
    <>
      <TextField label="Business name" hint="Optional" value={draft.businessName} onChange={(v) => update({ businessName: v })} />
      <div className={PAIR}>
        <SelectField label="Industry" choices={INDUSTRIES} value={draft.industry} onChange={(v) => update({ industry: v })} error={errors.industry} />
        <SelectField label="Province or territory" choices={PROVINCES} value={draft.province} onChange={(v) => update({ province: v })} error={errors.province} />
      </div>
      <div className={PAIR}>
        <NumberField label="Year founded" placeholder="e.g. 1991" value={draft.yearFounded} onChange={(v) => update({ yearFounded: v })} error={errors.yearFounded} />
        <NumberField label="Number of employees" value={draft.employees} onChange={(v) => update({ employees: v })} error={errors.employees} />
      </div>
      <NumberField label="Annual revenue" prefix="$" hint="Total sales last year" value={draft.revenue} onChange={(v) => update({ revenue: v })} error={errors.revenue} />
    </>
  );
}

export function StepNumbers({ draft, update, errors }: StepProps) {
  return (
    <>
      <NumberField
        label="Annual profit before your pay and taxes"
        prefix="$"
        help="Accountants call this seller's discretionary earnings (SDE): your profit plus your own salary, perks and one-time costs, before income tax. It's roughly what a new owner could take home."
        value={draft.sde}
        onChange={(v) => update({ sde: v })}
        error={errors.sde}
      />
      <NumberField
        label="Approximate value of equipment and inventory"
        prefix="$"
        value={draft.tangibleAssets}
        onChange={(v) => update({ tangibleAssets: v })}
        error={errors.tangibleAssets}
      />
      <div className="space-y-3">
        <NumberField
          label="What you originally paid for your shares"
          prefix="$"
          hint="Most owners who started their company paid a nominal amount like $100."
          value={draft.sharesCostBase}
          onChange={(v) => update({ sharesCostBase: v })}
          error={errors.sharesCostBase}
        />
        <button
          type="button"
          className="rounded-md text-base font-semibold text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          onClick={() => update({ sharesCostBase: DEFAULT_SHARES_COST_BASE })}
        >
          I&apos;m not sure — use $100
        </button>
      </div>
    </>
  );
}

export function StepOperations({ draft, update, errors }: StepProps) {
  return (
    <>
      <ChoiceField label="How are your financial records kept?" choices={RECORDS} value={draft.records} onChange={(v) => update({ records: v })} error={errors.records} />
      <ChoiceField label="Could the business run for 4 weeks without you?" columns={3} choices={RUN_WITHOUT_OWNER} value={draft.runWithoutOwner} onChange={(v) => update({ runWithoutOwner: v })} error={errors.runWithoutOwner} />
      <ChoiceField
        label="How many people could run day-to-day operations?"
        columns={3}
        choices={MANAGERS}
        value={draft.managers === undefined ? undefined : (String(draft.managers) as "0" | "1" | "2")}
        onChange={(v) => update({ managers: Number(v) as 0 | 1 | 2 })}
        error={errors.managers}
      />
      <ChoiceField label="How much of your revenue comes from your largest customer?" columns={4} choices={TOP_CUSTOMER} value={draft.topCustomerShare} onChange={(v) => update({ topCustomerShare: v })} error={errors.topCustomerShare} />
      <ChoiceField label="How much of how you work is written down?" columns={3} choices={PROCESSES} value={draft.processes} onChange={(v) => update({ processes: v })} error={errors.processes} />
    </>
  );
}

export function StepOwner({ draft, update, errors }: StepProps) {
  return (
    <>
      <NumberField label="Your age" value={draft.ownerAge} onChange={(v) => update({ ownerAge: v })} error={errors.ownerAge} />
      <ChoiceField
        label="When would you like to step away?"
        columns={3}
        choices={YEARS_TO_EXIT}
        value={draft.yearsToExit === undefined ? undefined : (String(draft.yearsToExit) as "0" | "1" | "2" | "3" | "5")}
        onChange={(v) => update({ yearsToExit: Number(v) as 0 | 1 | 2 | 3 | 5 })}
        error={errors.yearsToExit}
      />
      <ChoiceField label="Is a family member interested in taking over?" columns={3} choices={FAMILY_INTEREST} value={draft.familyInterest} onChange={(v) => update({ familyInterest: v })} error={errors.familyInterest} />
      <RankField<Priority>
        label="What matters most to you?"
        hint="Put the most important at the top."
        labels={PRIORITY_LABELS}
        value={draft.priorities ?? DEFAULT_PRIORITIES}
        onChange={(v) => update({ priorities: v })}
      />
    </>
  );
}
