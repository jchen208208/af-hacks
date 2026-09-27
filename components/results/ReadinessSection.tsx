import { Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { ReadinessResult } from "@/lib/engine/types";

/** Semicircle gauge, 0–100. Also used (scaled down) in the landing page mockup. */
export function ReadinessDial({ score, bandLabel }: { score: number; bandLabel: string }) {
  const r = 80;
  const arc = Math.PI * r;
  const filled = (Math.min(100, Math.max(0, score)) / 100) * arc;
  return (
    <figure className="flex flex-col items-center" aria-label={`Readiness score ${score} out of 100: ${bandLabel}`}>
      <svg viewBox="0 0 200 115" className="w-64" role="img" aria-hidden>
        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="var(--secondary)" strokeWidth="16" strokeLinecap="round" />
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
        <text x="100" y="110" textAnchor="middle" className="fill-muted-foreground font-sans text-[11px]">
          out of 100
        </text>
      </svg>
      <figcaption className="mt-2 rounded-full bg-hero px-4 py-1 text-base font-semibold text-hero-foreground">
        {bandLabel}
      </figcaption>
    </figure>
  );
}

const CARD = "rounded-2xl border bg-card p-6 shadow-sm sm:p-8";

export function ReadinessSection({ readiness }: { readiness: ReadinessResult }) {
  return (
    <div className="grid gap-6 md:grid-cols-[auto_1fr]">
      <div className={`${CARD} flex flex-col items-center justify-center gap-4`}>
        <ReadinessDial score={readiness.score} bandLabel={readiness.bandLabel} />
        <p className="flex max-w-64 items-start gap-2 text-center text-sm leading-snug text-muted-foreground">
          <Clock className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
          <span>{readiness.runwayNote}</span>
        </p>
      </div>

      <div className={CARD}>
        <h3 className="mb-5 font-heading text-xl font-semibold">How buyers will see it</h3>
        <ul className="space-y-5">
          {readiness.factors.map((f) => (
            <li key={f.factor} className="space-y-2">
              <div className="flex justify-between gap-4 text-base">
                <span className="font-medium">{f.label}</span>
                <span className="font-semibold text-muted-foreground tabular-nums">
                  {f.points} / {f.max}
                </span>
              </div>
              <Progress
                value={(f.points / f.max) * 100}
                className="h-2.5 bg-secondary"
                aria-label={`${f.label}: ${f.points} of ${f.max}`}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
