import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { ReadinessResult } from "@/lib/engine/types";

/** Semicircle gauge, 0–100. */
export function ReadinessDial({ score, bandLabel }: { score: number; bandLabel: string }) {
  const r = 80;
  const arc = Math.PI * r;
  const filled = (Math.min(100, Math.max(0, score)) / 100) * arc;
  return (
    <figure className="flex flex-col items-center" aria-label={`Readiness score ${score} out of 100: ${bandLabel}`}>
      <svg viewBox="0 0 200 115" className="w-64" role="img" aria-hidden>
        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="var(--muted)" strokeWidth="16" strokeLinecap="round" />
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="var(--primary)"
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={`${filled} ${arc}`}
        />
        <text x="100" y="92" textAnchor="middle" className="fill-foreground font-heading text-[40px] font-semibold">
          {score}
        </text>
        <text x="100" y="110" textAnchor="middle" className="fill-muted-foreground text-[11px]">
          out of 100
        </text>
      </svg>
      <figcaption className="mt-2 rounded-full bg-secondary px-4 py-1 text-base font-semibold text-secondary-foreground">
        {bandLabel}
      </figcaption>
    </figure>
  );
}

export function ReadinessSection({ readiness }: { readiness: ReadinessResult }) {
  return (
    <div className="space-y-8">
      <div className="grid gap-8 md:grid-cols-[auto_1fr] md:items-center">
        <ReadinessDial score={readiness.score} bandLabel={readiness.bandLabel} />
        <ul className="space-y-4">
          {readiness.factors.map((f) => (
            <li key={f.factor} className="space-y-1">
              <div className="flex justify-between text-base">
                <span>{f.label}</span>
                <span className="text-muted-foreground tabular-nums">
                  {f.points} / {f.max}
                </span>
              </div>
              <Progress value={(f.points / f.max) * 100} aria-label={`${f.label}: ${f.points} of ${f.max}`} />
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-3">
        <h3 className="text-xl font-semibold">Your top 3 fixes</h3>
        <div className="grid gap-4 md:grid-cols-3">
          {readiness.topFixes.map((fix) => (
            <Card key={fix.factor} className="print-break-avoid">
              <CardHeader>
                <p className="flex items-center gap-1 font-heading text-2xl font-semibold text-primary">
                  <TrendingUp className="size-5" /> +{fix.gain} points
                </p>
                <CardTitle className="text-lg">{fix.label}</CardTitle>
              </CardHeader>
              <CardContent className="text-base text-muted-foreground">{fix.reason}</CardContent>
            </Card>
          ))}
        </div>
        <p className="text-base text-muted-foreground">{readiness.runwayNote}</p>
      </div>
    </div>
  );
}
