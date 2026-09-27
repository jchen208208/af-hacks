"use client";

// Print-only document building blocks. The website layout is hidden in print and these
// render instead, so the printout reads like a professional report: a letterhead,
// numbered sections, ruled tables, black text with one restrained accent, and a
// running page footer (set with @page margin boxes in globals.css).

import { DISCLAIMER_TEXT } from "@/components/layout/Disclaimer";
import { cn } from "@/lib/utils";

const PREPARED_DATE = () =>
  new Date().toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" });

/** The whole printed document. Hidden on screen. */
export function ReportDocument({
  kind,
  title,
  subtitle,
  preparedFor,
  isExample,
  children,
}: {
  kind: string;
  title: string;
  subtitle?: string;
  preparedFor: string;
  isExample?: boolean;
  children: React.ReactNode;
}) {
  return (
    <article className="hidden font-sans text-[9.5pt] leading-snug text-neutral-900 print:block">
      <header className="flex items-end justify-between gap-6 border-b-2 border-primary pb-2">
        <div>
          <p className="font-heading text-[15pt] leading-none font-semibold tracking-tight text-primary">Handover</p>
          <p className="mt-1 text-[7.5pt] tracking-[0.14em] text-neutral-500 uppercase">{kind}</p>
        </div>
        <dl className="grid grid-cols-[auto_auto] gap-x-3 text-right text-[8pt] text-neutral-600">
          <dt>Prepared for</dt>
          <dd className="font-semibold text-neutral-900">{preparedFor}</dd>
          <dt>Date</dt>
          <dd className="text-neutral-900">{PREPARED_DATE()}</dd>
          {isExample && (
            <>
              <dt>Status</dt>
              <dd className="text-neutral-900">Illustrative example</dd>
            </>
          )}
        </dl>
      </header>

      <div className="mt-5 mb-4">
        <h1 className="font-heading text-[20pt] leading-tight font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-[9.5pt] text-neutral-600">{subtitle}</p>}
      </div>

      <div className="space-y-5">{children}</div>
    </article>
  );
}

/** A numbered section with a ruled heading. */
export function ReportSection({
  number,
  title,
  children,
  keepTogether = false,
  className,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
  keepTogether?: boolean;
  className?: string;
}) {
  return (
    <section className={cn("space-y-2", keepTogether && "break-inside-avoid", className)}>
      <h2 className="flex items-baseline gap-2 border-b border-neutral-300 pb-1 font-heading text-[12pt] font-semibold tracking-tight break-after-avoid">
        <span className="text-primary tabular-nums">{number}.</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

/** Border colours for the report's boxed tables: a darker frame, lighter inner grid lines. */
const FRAME = "border-neutral-600";
const GRID = "border-neutral-400";

/** A small, fully boxed data table. `head` is the header row; rows are arrays of cells. */
export function ReportTable({
  head,
  rows,
  colClassNames = [],
  className,
  highlightColumn,
}: {
  head: React.ReactNode[];
  rows: React.ReactNode[][];
  colClassNames?: string[];
  className?: string;
  /** Column index (in `head`) to tint lightly, e.g. the best-match option. */
  highlightColumn?: number;
}) {
  return (
    <table className={cn("w-full border-collapse border text-[8.5pt] leading-snug", FRAME, className)}>
      <thead>
        <tr className="bg-neutral-100 [print-color-adjust:exact]">
          {head.map((h, i) => (
            <th
              key={i}
              scope="col"
              className={cn(
                "border border-b-2 px-2 py-1 text-left align-bottom font-semibold",
                GRID,
                "border-b-neutral-600",
                colClassNames[i],
                i === highlightColumn && "bg-secondary",
              )}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, r) => (
          <tr key={r} className="break-inside-avoid">
            {row.map((cell, c) => {
              const Cell = c === 0 ? "th" : "td";
              return (
                <Cell
                  key={c}
                  scope={c === 0 ? "row" : undefined}
                  className={cn(
                    "border px-2 py-1 text-left align-top",
                    GRID,
                    c === 0 && "font-semibold",
                    colClassNames[c],
                    c === highlightColumn && "bg-secondary/60 [print-color-adjust:exact]",
                  )}
                >
                  {cell}
                </Cell>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Label/value pairs in two columns, e.g. the business profile. */
export function KeyValueGrid({ items }: { items: [string, React.ReactNode][] }) {
  return (
    // Frame on the outside; each cell draws its own right and bottom lines so the grid closes up.
    <dl className={cn("grid grid-cols-2 border-t border-l text-[8.5pt]", FRAME)}>
      {items.map(([k, v], i) => (
        <div
          key={k}
          className={cn(
            "flex justify-between gap-4 border-r border-b px-2 py-1",
            GRID,
            i % 2 === 1 && "border-r-neutral-600",
            i >= items.length - 2 && "border-b-neutral-600",
          )}
        >
          <dt className="text-neutral-600">{k}</dt>
          <dd className="text-right font-semibold">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Headline figures in a boxed row. */
export function FigureRow({ figures }: { figures: { label: string; value: string; note?: string }[] }) {
  return (
    <div className={cn("grid auto-cols-fr grid-flow-col border", FRAME)}>
      {figures.map((f, i) => (
        <div key={f.label} className={cn("px-3 py-2", i > 0 && cn("border-l", GRID))}>
          <p className="text-[7.5pt] tracking-[0.08em] text-neutral-600 uppercase">{f.label}</p>
          <p className="font-heading text-[14pt] leading-tight font-semibold text-primary">{f.value}</p>
          {f.note && <p className="text-[8pt] text-neutral-600">{f.note}</p>}
        </div>
      ))}
    </div>
  );
}

/** Closing "Important notice" block with the required disclaimer (plan section 9). */
export function ReportNotice({ extra }: { extra?: React.ReactNode }) {
  return (
    <section className="break-inside-avoid border-t border-neutral-400 pt-2 text-[7.5pt] leading-snug text-neutral-600">
      <p>
        <strong className="font-semibold text-neutral-900">Important notice. </strong>
        {DISCLAIMER_TEXT} {extra}
      </p>
    </section>
  );
}
