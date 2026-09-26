import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  EOT_EXEMPTION,
  INCLUSION_RATE,
  LCGE,
  SDE_MULTIPLES,
  TOP_RATE,
  VALUE_RANGE_SPREAD,
  WINDDOWN_RECOVERY,
} from "@/lib/config/assumptions";
import { formatMoney } from "@/lib/format";

// TODO(Phase 5): list every config value with its source link.
export function AssumptionsExpander() {
  return (
    <Accordion type="single" collapsible className="print-break-avoid rounded-lg border bg-card px-4">
      <AccordionItem value="assumptions" className="border-none">
        <AccordionTrigger className="text-base">Assumptions behind these numbers</AccordionTrigger>
        <AccordionContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          <ul className="list-disc space-y-1 pl-5">
            <li>
              Value = profit before owner&apos;s pay × an industry multiple (e.g. manufacturing{" "}
              {SDE_MULTIPLES.manufacturing.low}×–{SDE_MULTIPLES.manufacturing.high}×), adjusted by your
              readiness score, ±{VALUE_RANGE_SPREAD * 100}%.
            </li>
            <li>Capital gains inclusion rate: {INCLUSION_RATE * 100}%.</li>
            <li>Lifetime Capital Gains Exemption: {formatMoney(LCGE)} per person, assuming your shares qualify.</li>
            <li>Employee Ownership Trust exemption: up to {formatMoney(EOT_EXEMPTION)} of gain (one owner assumed).</li>
            <li>Tax uses the approximate top combined personal rate (Ontario {(TOP_RATE.ON * 100).toFixed(2)}%).</li>
            <li>Wind-down recovers about {WINDDOWN_RECOVERY * 100}% of equipment and inventory value.</li>
          </ul>
          <p>
            Not modelled: alternative minimum tax, the capital-gains reserve, intergenerational transfer
            rules, corporate-level tax on asset sales, multiple shareholders.
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
