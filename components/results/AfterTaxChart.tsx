"use client";

import { useSyncExternalStore } from "react";
import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, XAxis, YAxis } from "recharts";
import type { ExitOption, OptionId } from "@/lib/engine/types";
import { formatMoney } from "@/lib/format";

/** Short axis labels so the chart still reads at phone width. */
const SHORT_NAMES: Record<OptionId, string> = {
  family: "Family",
  canadian: "Canadian buyer",
  pe: "Private equity",
  eot: "Employees (EOT)",
  winddown: "Wind down",
};

/** Phones get a narrower label column (and "Employees" for the EOT) so the bars keep their room. */
const PHONE_QUERY = "(max-width: 639px)";
const subscribePhone = (onChange: () => void) => {
  const mq = window.matchMedia(PHONE_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};

/** Horizontal bars of after-tax money per option; best match in the brand green. */
export function AfterTaxChart({ options, bestMatch }: { options: ExitOption[]; bestMatch: OptionId }) {
  const phone = useSyncExternalStore(subscribePhone, () => window.matchMedia(PHONE_QUERY).matches, () => false);
  const data = options
    .filter((o) => o.afterTax !== undefined && o.status !== "unavailable")
    // Not `id`: Recharts copies data fields onto the bar <path>, which would clash with the page's #eot section.
    .map((o) => ({
      optionId: o.id,
      name: phone && o.id === "eot" ? "Employees" : SHORT_NAMES[o.id],
      afterTax: o.afterTax as number,
    }))
    .sort((a, b) => b.afterTax - a.afterTax);

  return (
    <figure className="space-y-5 rounded-2xl border bg-card p-4 shadow-sm sm:p-8">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <span className="font-heading text-2xl font-semibold">After-tax money to you, by option</span>
        <span className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <span aria-hidden className="size-3 rounded-sm bg-chart-1" /> Best match
          </span>
          <span className="flex items-center gap-2">
            <span aria-hidden className="size-3 rounded-sm bg-chart-3" /> Other options
          </span>
        </span>
      </figcaption>
      <ul className="sr-only">
        {data.map((d) => (
          <li key={d.optionId}>
            {SHORT_NAMES[d.optionId]}: {formatMoney(d.afterTax)}
            {d.optionId === bestMatch && " (best match)"}
          </li>
        ))}
      </ul>
      <div aria-hidden style={{ height: data.length * 60 + 16 }} className="font-sans">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 64, bottom: 0, left: 0 }}>
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="name"
              width={phone ? 138 : 150}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--foreground)", fontSize: phone ? 13 : 14 }}
            />
            <Bar dataKey="afterTax" radius={[0, 8, 8, 0]} barSize={30} isAnimationActive={false}>
              {data.map((d) => (
                <Cell key={d.optionId} fill={d.optionId === bestMatch ? "var(--chart-1)" : "var(--chart-3)"} />
              ))}
              <LabelList
                dataKey="afterTax"
                position="right"
                formatter={(v) => formatMoney(Number(v))}
                style={{ fill: "var(--foreground)", fontSize: 16, fontWeight: 700 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </figure>
  );
}
