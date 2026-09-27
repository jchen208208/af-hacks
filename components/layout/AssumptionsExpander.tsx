import { ListChecks } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  EOT_EXEMPTION,
  INCLUSION_RATE,
  LCGE_LABEL,
  SDE_MULTIPLES,
  TOP_RATE,
  VALUE_RANGE_SPREAD,
  WINDDOWN_RECOVERY,
} from "@/lib/config/assumptions";
import type { Snapshot } from "@/lib/engine/types";
import { formatMoney } from "@/lib/format";
import { INDUSTRIES, PROVINCES } from "@/lib/snapshot/questions";

const TITLE = "Assumptions behind these numbers";

type AssumptionsProps = { snapshot: Pick<Snapshot, "industry" | "province"> };

export function AssumptionsList({ snapshot }: AssumptionsProps) {
  const { industry, province } = snapshot;
  const industryLabel = INDUSTRIES.find((c) => c.value === industry)?.label ?? industry;
  const provinceLabel = PROVINCES.find((c) => c.value === province)?.label ?? province;
  return (
    <div className="space-y-3 text-base leading-relaxed text-muted-foreground print:space-y-1 print:text-sm print:leading-snug">
      <ul className="list-disc space-y-1.5 pl-5 marker:text-primary print:space-y-0.5">
        <li>
          Value = profit before owner&apos;s pay × an industry multiple ({industryLabel}:{" "}
          {SDE_MULTIPLES[industry].low}×–{SDE_MULTIPLES[industry].high}×), adjusted by your
          readiness score, ±{VALUE_RANGE_SPREAD * 100}%.
        </li>
        <li>Capital gains inclusion rate: {INCLUSION_RATE * 100}%.</li>
        <li>Lifetime Capital Gains Exemption: {LCGE_LABEL} per person in 2026, assuming your shares qualify.</li>
        <li>Employee Ownership Trust exemption: up to {formatMoney(EOT_EXEMPTION)} of gain (one owner assumed).</li>
        <li>
          Tax uses the approximate top combined personal rate ({provinceLabel}{" "}
          {(TOP_RATE[province] * 100).toFixed(2)}%).
        </li>
        <li>Wind-down recovers about {WINDDOWN_RECOVERY * 100}% of equipment and inventory value.</li>
      </ul>
      <p>
        Not modelled: alternative minimum tax, the capital-gains reserve, intergenerational transfer
        rules, corporate-level tax on asset sales, multiple shareholders.
      </p>
    </div>
  );
}

export function AssumptionsExpander({ snapshot }: AssumptionsProps) {
  return (
    <Accordion type="single" collapsible className="rounded-2xl border bg-card px-6 shadow-sm">
      <AccordionItem value="assumptions" className="border-none">
        <AccordionTrigger className="items-center py-5 font-heading text-lg font-semibold hover:no-underline focus-visible:ring-offset-2">
          <span className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-secondary text-secondary-foreground">
              <ListChecks className="size-5" aria-hidden />
            </span>
            {TITLE}
          </span>
        </AccordionTrigger>
        <AccordionContent className="pb-6">
          <AssumptionsList snapshot={snapshot} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
