import Link from "next/link";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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

function PlanButton({ option }: { option: ExitOption }) {
  if (option.status === "unavailable") return null;
  return (
    <Button asChild size="lg" variant="outline" className="no-print w-full text-base whitespace-normal">
      <Link href={`/plan?option=${option.id}`}>Build my plan</Link>
    </Button>
  );
}

function BestMatchBadge() {
  return (
    <Badge className="gap-1 text-sm">
      <Star className="size-3.5 fill-current" /> Best match for you
    </Badge>
  );
}

/** Desktop: options as columns, side by side. Mobile: stacked cards. (plan 6.3 C) */
export function OptionsTable({ options, bestMatch }: { options: ExitOption[]; bestMatch: OptionId }) {
  return (
    <>
      <div className="hidden overflow-x-auto rounded-xl border bg-card lg:block">
        <table className="w-full table-fixed border-collapse text-base">
          <caption className="sr-only">Exit options compared side by side</caption>
          <thead>
            <tr>
              <th scope="col" className="w-44 p-4" />
              {options.map((o) => (
                <th
                  key={o.id}
                  scope="col"
                  className={cn(
                    "space-y-2 p-4 text-left align-top font-heading text-lg font-semibold",
                    o.id === bestMatch && "bg-secondary",
                    o.status === "unavailable" && "text-muted-foreground",
                  )}
                >
                  {o.id === bestMatch && <BestMatchBadge />}
                  <div>{o.name}</div>
                  {o.statusNote && <div className="font-sans text-sm font-normal text-muted-foreground">{o.statusNote}</div>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.label} className="border-t">
                <th scope="row" className="p-4 text-left align-top text-sm font-semibold text-muted-foreground">
                  {row.label}
                </th>
                {options.map((o) => (
                  <td
                    key={o.id}
                    className={cn(
                      "p-4 align-top",
                      row.emphasis && "font-heading text-2xl font-semibold",
                      o.id === bestMatch && "bg-secondary",
                      o.status === "unavailable" && "text-muted-foreground opacity-60",
                    )}
                  >
                    {row.render(o)}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="no-print border-t">
              <td />
              {options.map((o) => (
                <td key={o.id} className={cn("p-4", o.id === bestMatch && "bg-secondary")}>
                  <PlanButton option={o} />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 lg:hidden">
        {options.map((o) => (
          <Card
            key={o.id}
            className={cn(
              "print-break-avoid",
              o.id === bestMatch && "ring-2 ring-primary",
              o.status === "unavailable" && "opacity-60",
            )}
          >
            <CardHeader className="space-y-2">
              {o.id === bestMatch && <BestMatchBadge />}
              <CardTitle className="text-xl">{o.name}</CardTitle>
              {o.statusNote && <p className="text-sm text-muted-foreground">{o.statusNote}</p>}
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-base">
                {ROWS.map((row) => (
                  <div key={row.label} className="contents">
                    <dt className="text-muted-foreground">{row.label}</dt>
                    <dd className={cn(row.emphasis && "font-heading text-xl font-semibold")}>{row.render(o)}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
            {o.status !== "unavailable" && (
              <CardFooter>
                <PlanButton option={o} />
              </CardFooter>
            )}
          </Card>
        ))}
      </div>
    </>
  );
}
