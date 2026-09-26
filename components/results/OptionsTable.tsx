import Link from "next/link";
import { ArrowRight, Star, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ExitOption, OptionId } from "@/lib/engine/types";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";

type Row = {
  label: string;
  render: (o: ExitOption) => React.ReactNode;
  emphasis?: boolean;
};

const money = (v: number | undefined) => (v === undefined ? "—" : formatMoney(v));

const ROWS: Row[] = [
  { label: "Price", render: (o) => money(o.price) },
  { label: "Estimated tax", render: (o) => money(o.tax) },
  { label: "After-tax to you", render: (o) => money(o.afterTax), emphasis: true },
  { label: "Tax exemption used", render: (o) => o.exemptionLabel },
  { label: "How you're paid", render: (o) => o.howPaid },
  { label: "Employees", render: (o) => o.employees },
  { label: "Stays Canadian-owned", render: (o) => o.staysCanadian },
  { label: "Time to complete", render: (o) => o.time },
  { label: "Complexity", render: (o) => o.complexity },
];

function PlanButton({ option, isBest }: { option: ExitOption; isBest: boolean }) {
  if (option.status === "unavailable") return null;
  return (
    <Button
      asChild
      size="lg"
      variant={isBest ? "default" : "outline"}
      className="no-print h-auto min-h-12 w-full py-2 text-base whitespace-normal"
    >
      <Link href={`/plan?option=${option.id}`}>
        Build my plan <ArrowRight />
      </Link>
    </Button>
  );
}

function BestMatchBadge({ compact = false }: { compact?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-highlight py-1 font-sans font-semibold text-hero print:border print:border-primary print:bg-transparent print:text-primary",
        // Compact: for the narrow table column — smaller type, and it borrows the cell's side padding.
        compact ? "-mx-2 justify-center gap-1 px-2 text-center text-xs leading-tight" : "gap-1.5 px-3 text-sm whitespace-nowrap",
      )}
    >
      <Star className={cn("shrink-0 fill-current", compact ? "size-3" : "size-3.5")} aria-hidden /> Best match for you
    </span>
  );
}

/** Caution callout for options that need checking (e.g. EOT likely not eligible). No amber text. */
function WarningNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex gap-2 rounded-lg border border-l-4 border-destructive/40 border-l-destructive bg-card px-3 py-2 font-sans text-sm leading-snug font-normal text-foreground">
      <TriangleAlert className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden />
      <span>
        <span className="sr-only">Caution: </span>
        {children}
      </span>
    </p>
  );
}

/** Desktop: options as columns, side by side. Mobile: stacked cards. (plan 6.3 C) */
export function OptionsTable({ options, bestMatch }: { options: ExitOption[]; bestMatch: OptionId }) {
  return (
    <>
      <div className="hidden overflow-hidden rounded-2xl border bg-card shadow-sm lg:block print:block print:rounded-none print:shadow-none">
        <table className="w-full table-fixed border-collapse text-base print:text-sm">
          <caption className="sr-only">Exit options compared side by side</caption>
          <thead>
            <tr>
              <th scope="col" className="w-44 p-4 print:w-32" />
              {options.map((o) => {
                const isBest = o.id === bestMatch;
                return (
                  <th
                    key={o.id}
                    scope="col"
                    className={cn(
                      "p-4 text-left align-top font-heading text-lg leading-snug font-semibold",
                      isBest && "bg-hero text-hero-foreground print:bg-transparent print:text-foreground",
                      o.status === "unavailable" && "bg-muted/60 text-muted-foreground",
                    )}
                  >
                    <div className="space-y-2">
                      <div>{o.name}</div>
                      {isBest && (
                        <div className="flex justify-center">
                          <BestMatchBadge compact />
                        </div>
                      )}
                      {o.status === "unavailable" && o.statusNote && (
                        <div className="font-sans text-sm font-normal">{o.statusNote}</div>
                      )}
                      {o.status === "warning" && o.statusNote && <WarningNote>{o.statusNote}</WarningNote>}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.label} className={cn("border-t", row.emphasis && "bg-secondary/40")}>
                <th scope="row" className="p-4 text-left align-top text-sm font-semibold text-muted-foreground">
                  {row.label}
                </th>
                {options.map((o) => {
                  const isBest = o.id === bestMatch;
                  return (
                    <td
                      key={o.id}
                      className={cn(
                        "p-4 align-top",
                        row.emphasis && "font-heading text-2xl font-semibold print:text-lg",
                        row.emphasis && isBest && "text-primary",
                        isBest && "bg-secondary print:bg-transparent",
                        o.status === "warning" && "bg-destructive/[0.03]",
                        o.status === "unavailable" && "bg-muted/60 text-muted-foreground",
                      )}
                    >
                      {row.render(o)}
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr className="no-print border-t">
              <td />
              {options.map((o) => (
                <td
                  key={o.id}
                  className={cn(
                    "p-4",
                    o.id === bestMatch && "bg-secondary",
                    o.status === "unavailable" && "bg-muted/60",
                  )}
                >
                  <PlanButton option={o} isBest={o.id === bestMatch} />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="grid gap-5 lg:hidden print:hidden">
        {options.map((o) => {
          const isBest = o.id === bestMatch;
          return (
            <article
              key={o.id}
              aria-label={o.name}
              className={cn(
                "print-break-avoid overflow-hidden rounded-2xl border bg-card shadow-sm",
                isBest && "border-primary ring-2 ring-primary",
                o.status === "warning" && "border-destructive/40",
                o.status === "unavailable" && "bg-muted/50 shadow-none",
              )}
            >
              <header
                className={cn(
                  "space-y-2 px-4 pt-5 pb-4 sm:px-5",
                  isBest && "bg-hero text-hero-foreground",
                )}
              >
                <h3 className={cn("font-heading text-xl font-semibold", o.status === "unavailable" && "text-muted-foreground")}>
                  {o.name}
                </h3>
                {isBest && <BestMatchBadge />}
                {o.status === "unavailable" && o.statusNote && (
                  <p className="text-sm text-muted-foreground">{o.statusNote}</p>
                )}
                {o.status === "warning" && o.statusNote && <WarningNote>{o.statusNote}</WarningNote>}
              </header>
              <dl className={cn("grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-x-3 gap-y-2.5 px-4 py-4 text-base sm:grid-cols-[auto_1fr] sm:gap-x-4 sm:px-5", o.status === "unavailable" && "text-muted-foreground")}>
                {ROWS.map((row) => (
                  <div key={row.label} className="contents">
                    <dt className="text-muted-foreground">{row.label}</dt>
                    <dd
                      className={cn(
                        "min-w-0 break-words",
                        row.emphasis && "font-heading text-xl font-semibold",
                        row.emphasis && isBest && "text-primary",
                      )}
                    >
                      {row.render(o)}
                    </dd>
                  </div>
                ))}
              </dl>
              {o.status !== "unavailable" && (
                <div className="border-t px-4 py-4 sm:px-5">
                  <PlanButton option={o} isBest={isBest} />
                </div>
              )}
            </article>
          );
        })}
      </div>
    </>
  );
}
