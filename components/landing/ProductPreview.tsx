import { Star } from "lucide-react";
import { ReadinessDial } from "@/components/results/ReadinessSection";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";

// Example values for the demo persona (plan section 8). Illustration only — not engine output.
const COLUMNS = [
  { name: "Outside buyer", price: 4_849_200, tax: 963_299, afterTax: 3_885_901, jobs: "Usually kept" },
  { name: "Your employees", price: 4_849_200, tax: 0, afterTax: 4_849_200, jobs: "Kept, and they become owners", best: true },
  { name: "Private equity", price: 5_334_120, tax: 1_093_088, afterTax: 4_241_032, jobs: "At risk" },
];

const BARS = [
  { name: "Employees (EOT)", value: 4_849_200, best: true },
  { name: "Private equity", value: 4_241_032 },
  { name: "Outside buyer", value: 3_885_901 },
  { name: "Wind down", value: 540_000 },
];

function WindowChrome({ title, className, children }: { title: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("overflow-hidden rounded-xl bg-card text-card-foreground shadow-2xl ring-1 ring-black/10", className)}>
      <div className="flex items-center gap-2 border-b bg-muted/70 px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-[oklch(0.8_0.02_95)]" />
        <span className="size-2.5 rounded-full bg-[oklch(0.8_0.02_95)]" />
        <span className="size-2.5 rounded-full bg-[oklch(0.8_0.02_95)]" />
        <span className="ml-2 truncate text-xs text-muted-foreground">{title}</span>
      </div>
      {children}
    </div>
  );
}

function ComparisonMock() {
  const rows = [
    { label: "Price", render: (c: (typeof COLUMNS)[number]) => formatMoney(c.price) },
    { label: "Estimated tax", render: (c: (typeof COLUMNS)[number]) => formatMoney(c.tax) },
    { label: "After-tax to you", render: (c: (typeof COLUMNS)[number]) => formatMoney(c.afterTax), strong: true },
    { label: "Employees", render: (c: (typeof COLUMNS)[number]) => c.jobs },
  ];
  return (
    <WindowChrome title="Handover · Exit options">
      <div className="space-y-3 p-4 sm:p-5">
        <p className="font-heading text-base font-semibold sm:text-lg">Exit options for Mancini Precision Machining</p>
        <div className="grid grid-cols-[5.5rem_repeat(3,1fr)] text-[0.7rem] leading-snug sm:grid-cols-[7rem_repeat(3,1fr)] sm:text-xs">
          <div />
          {COLUMNS.map((c) => (
            <div key={c.name} className={cn("space-y-1 rounded-t-lg px-2 pt-2 pb-1 font-semibold", c.best && "bg-secondary")}>
              {c.best && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary px-1.5 py-0.5 text-[0.6rem] text-primary-foreground">
                  <Star className="size-2.5 fill-current" /> Best match
                </span>
              )}
              <div>{c.name}</div>
            </div>
          ))}
          {rows.map((row, r) => (
            <div key={row.label} className="contents">
              <div className="border-t py-2 pr-2 text-muted-foreground">{row.label}</div>
              {COLUMNS.map((c) => (
                <div
                  key={c.name}
                  className={cn(
                    "border-t px-2 py-2",
                    row.strong && "font-heading text-sm font-semibold sm:text-base",
                    c.best && "bg-secondary",
                    c.best && r === rows.length - 1 && "rounded-b-lg",
                  )}
                >
                  {row.render(c)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </WindowChrome>
  );
}

function ReadinessMock() {
  return (
    <div className="rounded-xl bg-card p-4 text-card-foreground shadow-2xl ring-1 ring-black/10 [&_figcaption]:text-sm [&_svg]:w-40">
      <p className="mb-1 text-center text-xs font-semibold tracking-wide text-muted-foreground uppercase">Readiness</p>
      <ReadinessDial score={66} bandLabel="Getting there" />
    </div>
  );
}

function BarsMock() {
  const max = Math.max(...BARS.map((b) => b.value));
  return (
    <div className="w-64 space-y-2.5 rounded-xl bg-card p-4 text-card-foreground shadow-2xl ring-1 ring-black/10">
      <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">After-tax to you</p>
      {BARS.map((b) => (
        <div key={b.name} className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>{b.name}</span>
            <span className="font-semibold">{formatMoney(b.value)}</span>
          </div>
          <div className="h-2.5 rounded-full bg-muted">
            <div
              className={cn("h-full rounded-full", b.best ? "bg-primary" : "bg-chart-3")}
              style={{ width: `${(b.value / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Floating app-screen mockups for the hero's foreground. Decorative; described by a hidden caption. */
export function ProductPreview() {
  return (
    <figure className="relative mx-auto w-full max-w-xl lg:max-w-none">
      <figcaption className="sr-only">
        Example results for a sample business: selling to employees leaves about $4.85 million after tax,
        compared with about $3.89 million from an outside buyer.
      </figcaption>
      <div aria-hidden className="relative pt-6 pb-10 sm:pb-36 lg:pt-16">
        <div className="absolute -top-2 right-0 z-0 hidden rotate-[3deg] sm:block lg:-top-4 lg:-right-10">
          <BarsMock />
        </div>
        <div className="relative z-10 lg:mr-[-3rem] xl:mr-[-5rem]">
          <ComparisonMock />
        </div>
        <div className="absolute bottom-0 -left-4 z-20 hidden -rotate-[3deg] sm:block lg:-left-10">
          <ReadinessMock />
        </div>
      </div>
    </figure>
  );
}
