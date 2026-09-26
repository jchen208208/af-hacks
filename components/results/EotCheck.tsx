"use client";

import { CheckCircle2, CircleHelp, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EOT_QUESTIONS } from "@/lib/engine/eot";
import type { EotAnswer, EotResult } from "@/lib/engine/types";
import { useSnapshot } from "@/lib/state/SnapshotContext";
import { cn } from "@/lib/utils";

const ANSWERS: { value: EotAnswer; label: string }[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "unsure", label: "Not sure" },
];

const STATUS_STYLE = {
  likely: { icon: CheckCircle2, className: "bg-secondary text-secondary-foreground" },
  review: { icon: CircleHelp, className: "bg-warning/10 text-foreground" },
  unlikely: { icon: XCircle, className: "bg-destructive/10 text-destructive" },
};

export function EotCheck({ result }: { result: EotResult }) {
  const { eotAnswers, setEotAnswer } = useSnapshot();
  const status = STATUS_STYLE[result.status];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
      <Card className="h-fit bg-secondary/50">
        <CardHeader>
          <CardTitle className="text-xl">What is an Employee Ownership Trust?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-base leading-relaxed">
          <p>
            An Employee Ownership Trust (EOT) buys your company on behalf of your employees. The
            company&apos;s future profits pay you out over time. The first $10M of your gain is tax-free.
          </p>
          <p className="text-muted-foreground">
            Your employees don&apos;t pay up front. The trust usually pays you over several years from
            company profits, often with help from a bank or vendor financing.
          </p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div
          role="status"
          className={cn("flex items-center gap-2 rounded-lg px-4 py-3 text-lg font-semibold", status.className)}
        >
          <status.icon className="size-6" /> {result.label}
        </div>
        <ol className="space-y-4">
          {EOT_QUESTIONS.map((q, i) => (
            <li key={q.id} className="space-y-2 rounded-lg border bg-card p-4">
              <p className="text-base">
                <span className="mr-2 font-semibold text-primary">{i + 1}.</span>
                {q.text}
              </p>
              <div role="radiogroup" aria-label={q.text} className="flex flex-wrap gap-2">
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
                        "rounded-md border px-4 py-2 text-base transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                        checked ? "border-primary bg-primary text-primary-foreground" : "bg-background hover:bg-muted",
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
