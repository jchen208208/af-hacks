import { cn } from "@/lib/utils";

export const DISCLAIMER_TEXT =
  "Handover gives planning estimates only. It is not tax, legal, financial or valuation advice. Numbers use simplified assumptions (see Assumptions). Talk to a CPA, a business lawyer and a Chartered Business Valuator before making decisions.";

/** Required on every screen that shows money, and in print (plan section 9). */
export function Disclaimer({ className }: { className?: string }) {
  return (
    <p
      role="note"
      className={cn(
        "print-break-avoid rounded-lg border border-warning/30 bg-warning/5 px-4 py-3 text-sm leading-relaxed text-muted-foreground",
        className,
      )}
    >
      <strong className="font-semibold text-foreground">Planning estimates only. </strong>
      {DISCLAIMER_TEXT.replace("Handover gives planning estimates only. ", "")}
    </p>
  );
}
