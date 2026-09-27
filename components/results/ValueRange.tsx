import { BadgeCheck } from "lucide-react";
import { VALUE_RANGE_SPREAD } from "@/lib/config/assumptions";
import type { ValuationResult } from "@/lib/engine/types";
import { formatMoney, formatRange } from "@/lib/format";

export function ValueRange({ valuation, sde }: { valuation: ValuationResult; sde?: number }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
      <div className="space-y-6 rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
        <div className="space-y-2">
          <p className="text-lg text-muted-foreground">Your business is likely worth</p>
          <p className="font-heading text-4xl leading-tight font-semibold text-primary sm:text-5xl">
            {formatRange(valuation.low, valuation.high)}
          </p>
        </div>

        {/* Low – midpoint – high, drawn as a simple range bar. */}
        <div aria-hidden className="space-y-2">
          <div className="relative h-3 rounded-full bg-secondary">
            <div className="absolute inset-y-0 left-[8%] right-[8%] rounded-full bg-primary/70" />
            <div className="absolute top-1/2 left-1/2 size-5 -translate-1/2 rounded-full border-4 border-card bg-hero shadow" />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{formatMoney(valuation.low)}</span>
            <span className="font-semibold text-foreground">Midpoint {formatMoney(valuation.midpoint)}</span>
            <span>{formatMoney(valuation.high)}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4 rounded-2xl bg-secondary/70 p-6 sm:p-8">
        <h3 className="font-heading text-xl font-semibold">How we worked it out</h3>
        <ol className="space-y-3 text-base leading-relaxed">
          <li>
            <span className="font-semibold">Profit before your pay</span>
            {sde !== undefined && <> ({formatMoney(sde)})</>} × <span className="font-semibold">{valuation.multiple.toFixed(2)}×</span>, a
            typical multiple for your industry adjusted for how ready your business is.
          </li>
          <li>
            That gives a midpoint of <span className="font-semibold">{formatMoney(valuation.midpoint)}</span>, and a range
            of ±{VALUE_RANGE_SPREAD * 100}% around it.
          </li>
        </ol>
        <p className="flex gap-2 border-t border-primary/15 pt-4 text-base leading-relaxed text-muted-foreground">
          <BadgeCheck className="mt-1 size-5 shrink-0 text-primary" aria-hidden />
          <span>
            For a firm number, talk to a Chartered Business Valuator (CBV), a professional who values
            companies.
          </span>
        </p>
      </div>
    </div>
  );
}
