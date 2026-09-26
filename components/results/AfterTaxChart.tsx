"use client";

import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, XAxis, YAxis } from "recharts";
import type { ExitOption, OptionId } from "@/lib/engine/types";
import { formatMoney } from "@/lib/format";

/** Horizontal bars of after-tax money per option; best match in the accent colour. */
export function AfterTaxChart({ options, bestMatch }: { options: ExitOption[]; bestMatch: OptionId }) {
  const data = options
    .filter((o) => o.afterTax !== undefined && o.status !== "unavailable")
    .map((o) => ({ id: o.id, name: o.name, afterTax: o.afterTax as number }))
    .sort((a, b) => b.afterTax - a.afterTax);

  return (
    <figure className="print-break-avoid space-y-2">
      <figcaption className="text-lg font-semibold">After-tax money to you, by option</figcaption>
      <div style={{ height: data.length * 64 + 20 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 80, bottom: 0, left: 0 }}>
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="name"
              width={260}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--foreground)", fontSize: 15 }}
            />
            <Bar dataKey="afterTax" radius={[0, 6, 6, 0]} barSize={32} isAnimationActive={false}>
              {data.map((d) => (
                <Cell key={d.id} fill={d.id === bestMatch ? "var(--chart-1)" : "var(--chart-3)"} />
              ))}
              <LabelList
                dataKey="afterTax"
                position="right"
                formatter={(v) => formatMoney(Number(v))}
                style={{ fill: "var(--foreground)", fontSize: 16, fontWeight: 600 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </figure>
  );
}
