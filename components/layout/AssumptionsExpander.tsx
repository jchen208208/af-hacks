import { ListChecks } from "lucide-react";
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

const TITLE = "Assumptions behind these numbers";

function AssumptionsList() {
  return (
    <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
      <ul className="list-disc space-y-1.5 pl-5 marker:text-primary">
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
    </div>
  );
}

// TODO(Phase 5): list every config value with its source link.
export function AssumptionsExpander() {
  return (
    <>
      <Accordion type="single" collapsible className="rounded-2xl border bg-card px-6 shadow-sm print:hidden">
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
            <AssumptionsList />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Print always shows the assumptions in full (the accordion is collapsed by default). */}
      <section className="print-break-avoid hidden space-y-2 print:block">
        <h2 className="font-heading text-lg font-semibold text-foreground">{TITLE}</h2>
        <AssumptionsList />
      </section>
    </>
  );
}
