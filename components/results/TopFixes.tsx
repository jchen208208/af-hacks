import { TrendingUp } from "lucide-react";
import type { ReadinessFix } from "@/lib/engine/types";

/** The fixes that would raise the readiness score the most, as numbered cards. */
export function TopFixes({ fixes }: { fixes: ReadinessFix[] }) {
  if (fixes.length === 0) {
    return (
      <p className="text-lg text-muted-foreground">
        Nothing to fix: every factor buyers look at is already at full marks.
      </p>
    );
  }
  return (
    <ol className="grid gap-5 md:grid-cols-3">
      {fixes.map((fix, i) => (
        <li key={fix.factor} className="space-y-3 rounded-2xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-base font-semibold text-secondary-foreground">
              <TrendingUp className="size-4" aria-hidden /> +{fix.gain} points
            </span>
            <span className="font-heading text-4xl font-semibold text-primary/25" aria-hidden>
              {i + 1}
            </span>
          </div>
          <h3 className="font-heading text-xl leading-snug font-semibold">{fix.label}</h3>
          <p className="text-base leading-relaxed text-muted-foreground">{fix.reason}</p>
        </li>
      ))}
    </ol>
  );
}
