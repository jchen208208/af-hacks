import type { Results } from "@/lib/engine/types";
import { formatMoney, formatRange } from "@/lib/format";

interface Figure {
  label: string;
  value: string;
  detail: string;
}

/** Dark-green band of headline numbers under the page hero, in the landing stats style. */
export function KeyFigures({ results }: { results: Results }) {
  const best = results.options.find((o) => o.id === results.bestMatch);
  const outside = results.options.find((o) => o.id === "canadian");
  const gain =
    best?.afterTax !== undefined && outside?.afterTax !== undefined && best.id !== "canadian"
      ? best.afterTax - outside.afterTax
      : 0;

  const figures: Figure[] = [
    {
      label: "Your business is likely worth",
      value: formatRange(results.valuation.low, results.valuation.high),
      detail: `Midpoint estimate ${formatMoney(results.valuation.midpoint)}`,
    },
    {
      label: "Readiness to sell",
      value: `${results.readiness.score} / 100`,
      detail: results.readiness.bandLabel,
    },
  ];
  if (best?.afterTax !== undefined) {
    figures.push({
      label: `Best match: ${best.name}`,
      value: formatMoney(best.afterTax),
      detail:
        gain > 0
          ? `After tax — about ${formatMoney(gain)} more than selling to an outside buyer`
          : "Estimated after tax to you",
    });
  }

  return (
    <section
      aria-label="Key figures"
      className="bg-band text-hero-foreground"
    >
      <dl className="mx-auto grid max-w-6xl divide-y divide-white/15 px-4 sm:px-6 md:grid-cols-3 md:divide-x md:divide-y-0">
        {figures.map((f) => (
          <div key={f.label} className="flex flex-col gap-2 py-7 md:px-8 md:py-10 md:first:pl-0 md:last:pr-0">
            <dt className="text-base font-semibold text-hero-muted">{f.label}</dt>
            <dd className="font-heading text-4xl leading-tight font-semibold text-highlight lg:text-5xl">
              {f.value}
            </dd>
            <dd className="text-base leading-snug text-hero-muted">{f.detail}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
