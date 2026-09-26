import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

export const DISCLAIMER_TEXT =
  "Handover gives planning estimates only. It is not tax, legal, financial or valuation advice. Numbers use simplified assumptions (see Assumptions). Talk to a CPA, a business lawyer and a Chartered Business Valuator before making decisions.";

/** Required on every screen that shows money, and in print (plan section 9). */
export function Disclaimer({ className }: { className?: string }) {
  return (
    <div
      role="note"
      className={cn(
        "print-break-avoid flex gap-3 rounded-r-2xl border-l-4 border-primary bg-secondary/70 px-5 py-4 text-sm leading-relaxed text-muted-foreground print:border print:border-l-4 print:bg-transparent",
        className,
      )}
    >
      <Info className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
      <p>
        <strong className="font-semibold text-foreground">Planning estimates only. </strong>
        {DISCLAIMER_TEXT.replace("Handover gives planning estimates only. ", "")}
      </p>
    </div>
  );
}
