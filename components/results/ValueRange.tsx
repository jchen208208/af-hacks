import type { ValuationResult } from "@/lib/engine/types";
import { formatMoney, formatRange } from "@/lib/format";

export function ValueRange({ valuation }: { valuation: ValuationResult }) {
  return (
    <div className="space-y-4">
      <p className="text-xl">
        Your business is likely worth{" "}
        <strong className="block font-heading text-4xl font-semibold text-primary sm:inline sm:text-5xl">
          {formatRange(valuation.low, valuation.high)}
        </strong>
      </p>
      <p className="text-lg text-muted-foreground">
        Midpoint estimate: <strong className="text-foreground">{formatMoney(valuation.midpoint)}</strong>
      </p>
      <p className="max-w-2xl text-base text-muted-foreground">
        We multiplied your profit before owner&apos;s pay by {valuation.multiple.toFixed(2)}×, a typical
        multiple for your industry adjusted for how ready your business is. A Chartered Business Valuator
        (CBV) — a professional who values companies — can give you the real number.
      </p>
    </div>
  );
}
