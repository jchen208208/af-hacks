"use client";

import { CheckCircle2, CircleHelp, XCircle } from "lucide-react";
import { HeroBackdrop } from "@/components/layout/HeroBackdrop";
import { EOT_QUESTIONS } from "@/lib/engine/eot";
import type { EotAnswer, EotResult } from "@/lib/engine/types";
import { useSnapshot } from "@/lib/state/SnapshotContext";
import { cn } from "@/lib/utils";

export const ANSWERS: { value: EotAnswer; label: string }[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "unsure", label: "Not sure" },
];

// No amber/yellow text: "needs review" uses a neutral treatment.
const STATUS_STYLE = {
  likely: { icon: CheckCircle2, className: "border-primary/30 bg-secondary text-secondary-foreground", iconClass: "text-primary" },
  review: { icon: CircleHelp, className: "border-border bg-card text-foreground", iconClass: "text-muted-foreground" },
  unlikely: { icon: XCircle, className: "border-destructive/30 bg-destructive/5 text-foreground", iconClass: "text-destructive" },
};

export function EotCheck({ result }: { result: EotResult }) {
  const { eotAnswers, setEotAnswer } = useSnapshot();
  const status = STATUS_STYLE[result.status];
  const answered = EOT_QUESTIONS.filter((q) => eotAnswers[q.id]).length;

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1fr_1.4fr]">
      <aside className="relative isolate overflow-hidden rounded-2xl bg-hero p-6 text-hero-foreground shadow-sm sm:p-8 lg:sticky lg:top-24 print:static print:rounded-none print:bg-transparent print:p-0 print:text-foreground">
        <HeroBackdrop variant="page" />
        {/* Print condenses this box to a heading and three short lines to keep /results at 3 pages. */}
        <div className="relative space-y-4 print:space-y-1">
          <p className="text-sm font-semibold tracking-[0.12em] text-highlight uppercase print:hidden">
            What is an EOT?
          </p>
          <h3 className="font-heading text-2xl leading-snug font-semibold print:text-lg">An Employee Ownership Trust</h3>
          <p className="text-base leading-relaxed text-hero-muted print:text-sm print:text-foreground">
            It buys your company on behalf of your employees. The company&apos;s future profits pay you out over
            time.
          </p>
          <p className="border-y border-white/15 py-4 print:border-0 print:py-0 print:text-sm">
            <span className="block font-heading text-5xl font-semibold text-highlight print:inline print:font-sans print:text-sm print:text-foreground">
              $10M
            </span>
            <span className="text-base text-hero-muted print:text-sm print:text-foreground"> of your gain can be tax-free</span>
          </p>
          <p className="text-base leading-relaxed text-hero-muted print:text-sm print:text-muted-foreground">
            Your employees don&apos;t pay up front. The trust usually pays you over several years from company
            profits, often with help from a bank or vendor financing.
          </p>
        </div>
      </aside>

      <div className="space-y-4">
        <div
          role="status"
          className={cn("flex items-center gap-3 rounded-2xl border px-5 py-4 shadow-sm", status.className)}
        >
          <status.icon className={cn("size-7 shrink-0", status.iconClass)} aria-hidden />
          <div>
            <p className="font-heading text-xl font-semibold">{result.label}</p>
            <p className="text-sm text-muted-foreground">
              {answered} of {EOT_QUESTIONS.length} questions answered
            </p>
          </div>
        </div>
        <ol className="space-y-3 print:space-y-2">
          {EOT_QUESTIONS.map((q, i) => (
            <li key={q.id} className="print-break-avoid space-y-3 rounded-2xl border bg-card p-5 shadow-sm print:rounded-none print:border-0 print:p-0 print:shadow-none">
              <p className="flex gap-3 text-base leading-relaxed print:leading-snug">
                <span
                  aria-hidden
                  className="grid size-7 shrink-0 place-items-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground"
                >
                  {i + 1}
                </span>
                <span>
                  {q.text}
                  {/* Print shows just the chosen answer, on the same line, instead of three buttons. */}
                  <span className="hidden print:inline">
                    {" "}
                    <strong className="font-semibold">
                      {ANSWERS.find((a) => a.value === eotAnswers[q.id])?.label ?? "Not answered"}
                    </strong>
                  </span>
                </span>
              </p>
              <div role="radiogroup" aria-label={q.text} className="flex flex-wrap gap-2 sm:pl-10 print:hidden">
                {ANSWERS.map((a) => {
                  const checked = eotAnswers[q.id] === a.value;
                  return (
                    <button
                      key={a.value}
                      type="button"
                      role="radio"
                      aria-checked={checked}
                      onClick={() => setEotAnswer(q.id, a.value)}
                      className={cn(
                        "min-h-11 rounded-full border px-5 py-2 text-base font-semibold transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                        checked
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background hover:border-primary/40 hover:bg-secondary hover:text-secondary-foreground",
                      )}
                    >
                      {a.label}
                    </button>
                  );
                })}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
