// Template summary for the transition plan (open item O6). Pure: no React, no network.
// Built only from engine output, so it doubles as the no-API-key fallback for the Phase 6 AI narrative.
// Money always goes through formatMoney (nearest $10K); the page shows the disclaimer, not this text.

import { PE_MIN_READINESS, PE_MIN_SDE } from "@/lib/config/assumptions";
import type { ExitOption, OptionId, Results, Snapshot } from "@/lib/engine/types";
import { formatMoney } from "@/lib/format";

/** Differences smaller than this round to $0 on screen, so they aren't worth mentioning. */
const MEANINGFUL_GAP = 10_000;

const RUNWAY: Record<Snapshot["yearsToExit"], string> = {
  0: "under a year",
  1: "about a year",
  2: "about 2 years",
  3: "3–4 years",
  5: "5 or more years",
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const lowerFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

/** "your 22 employees" / "your one employee"; undefined when there's no staff to talk about. */
function staff(n: number): string | undefined {
  if (n <= 0) return undefined;
  return n === 1 ? "your one employee" : `your ${n} employees`;
}

/** How much more `a` leaves than `b` after tax, or 0 when either is missing or the gap is too small to show. */
function gap(a: ExitOption | undefined, b: ExitOption | undefined): number {
  if (a?.afterTax === undefined || b?.afterTax === undefined) return 0;
  const diff = a.afterTax - b.afterTax;
  return diff >= MEANINGFUL_GAP ? diff : 0;
}

/** EOT with its exemption applied (not unavailable, not "may not qualify"). */
const eotWithExemption = (o: ExitOption | undefined) => o?.status === "available";

function readinessSentence(results: Results): string {
  const { score, topFixes } = results.readiness;
  const fix = topFixes[0];
  if (!fix) {
    return `Your readiness score is ${score} out of 100 and the main readiness items are already in good shape, so the plan can go straight to the main steps.`;
  }
  return `Your readiness score is ${score} out of 100, so the plan starts with the change that will make the biggest difference: ${lowerFirst(fix.label)} (+${fix.gain} points).`;
}

function runwaySentence(snapshot: Snapshot, chosen?: ExitOption): string {
  const when = RUNWAY[snapshot.yearsToExit];
  if (snapshot.yearsToExit <= 1) {
    // The timeline squeezes into the owner's runway; say so when that's shorter than a typical family handover.
    if (chosen?.id === "family" && chosen.status !== "unavailable") {
      return `Family handovers usually take ${chosen.time.toLowerCase()}, so stepping away in ${when} is tight and the early steps matter most.`;
    }
    return `You want to step away in ${when}, so the timeline is short and the early steps matter most.`;
  }
  if (snapshot.yearsToExit === 2) return `With ${when} before you step away, there is time for the most important fixes.`;
  return `With ${when} before you step away, you have time to do this well.`;
}

function familySummary(name: string, snapshot: Snapshot, results: Results, family: ExitOption): string[] {
  const people = staff(snapshot.employees);
  const jobs = people ? `, and ${people} would likely keep their jobs` : "";
  if (family.status === "unavailable" || family.afterTax === undefined) {
    return [
      `You told us no family member is interested in taking over ${name}, so we haven't estimated a family sale.`,
      `This plan shows what it would take if that changes: family handovers usually take ${family.time.toLowerCase()} and are mostly paid over time${jobs}.`,
    ];
  }
  const canadian = results.options.find((o) => o.id === "canadian");
  const less = gap(canadian, family);
  return [
    `Passing ${name} to a family member could leave you with about ${formatMoney(family.afterTax)} after tax.`,
    less
      ? `Family sales are usually priced a little below market and mostly paid over time, so that's about ${formatMoney(less)} less than an outside buyer might leave you.`
      : "Family sales are usually priced a little below market and mostly paid over time.",
    ...(people ? [`${capitalize(people)} would likely keep their jobs.`] : []),
  ];
}

function canadianSummary(name: string, snapshot: Snapshot, results: Results, canadian: ExitOption): string[] {
  const people = staff(snapshot.employees);
  const eot = results.options.find((o) => o.id === "eot");
  const eotMore = eotWithExemption(eot) ? gap(eot, canadian) : 0;
  return [
    `Selling ${name} to a Canadian buyer could leave you with about ${formatMoney(canadian.afterTax ?? 0)} after tax.`,
    people
      ? `Buyers usually pay 50–70% at closing and the rest over a few years, and ${people} would usually keep their jobs.`
      : "Buyers usually pay 50–70% at closing and the rest over a few years.",
    ...(eotMore
      ? [`For comparison, a sale to your employees could leave about ${formatMoney(eotMore)} more, if you qualify for the employee ownership tax exemption.`]
      : []),
  ];
}

function peSummary(name: string, snapshot: Snapshot, results: Results, pe: ExitOption): string[] {
  const jobs =
    snapshot.employees > 1
      ? `the jobs of your ${snapshot.employees} employees`
      : snapshot.employees === 1
        ? "your employee's job"
        : undefined;
  const risk = jobs ? `${jobs} could be at risk if the buyer merges the business with others it owns.` : undefined;

  if (pe.status === "unavailable" || pe.afterTax === undefined || pe.price === undefined) {
    const needs: string[] = [];
    if (snapshot.sde < PE_MIN_SDE) needs.push(`growing yearly profit before your pay (SDE) to ${formatMoney(PE_MIN_SDE)} or more`);
    if (results.readiness.score < PE_MIN_READINESS) {
      needs.push(`raising your readiness score to at least ${PE_MIN_READINESS}`);
    }
    return [
      `Private equity firms and large companies usually look for larger businesses that are ready to sell, so we haven't estimated a price for ${name}.`,
      needs.length
        ? `This plan shows what would change that: ${needs.join(" and ")}.`
        : "This plan shows what a sale like this would involve.",
      ...(risk ? [`In a sale like this, ${risk}`] : []),
    ];
  }

  const eot = results.options.find((o) => o.id === "eot");
  const canadian = results.options.find((o) => o.id === "canadian");
  const eotMore = eotWithExemption(eot) ? gap(eot, pe) : 0;
  const overCanadian = gap(pe, canadian);
  const compare = eotMore
    ? `That's about ${formatMoney(eotMore)} less than a sale to your employees could leave you, if you qualify for the employee ownership tax exemption.`
    : overCanadian
      ? `That's about ${formatMoney(overCanadian)} more than a Canadian buyer might leave you.`
      : undefined;
  return [
    `Selling ${name} to private equity or a large company could bring about ${formatMoney(pe.price)}, leaving about ${formatMoney(pe.afterTax)} after tax.`,
    ...(compare ? [compare] : []),
    ...(risk ? [capitalize(risk)] : []),
  ];
}

function eotSummary(name: string, snapshot: Snapshot, results: Results, eot: ExitOption): string[] {
  const people = staff(snapshot.employees);
  const owners = people
    ? `${capitalize(people)} would keep their jobs and become owners through a trust.`
    : "The business would be owned by a trust for the people who work there.";
  const afterTax = formatMoney(eot.afterTax ?? 0);

  if (eot.status === "warning") {
    return [
      "Your answers suggest you may not qualify for the employee ownership trust tax exemption.",
      `Without it, selling ${name} to your employees could leave you with about ${afterTax} after tax, and this plan helps you check your eligibility with an advisor.`,
      owners,
    ];
  }

  const canadian = results.options.find((o) => o.id === "canadian");
  const more = gap(eot, canadian);
  const why =
    results.eot.status === "likely"
      ? "because the employee ownership trust exemption can cover the tax on the sale"
      : "if you qualify for the employee ownership trust exemption (a few of your answers need checking)";
  return [
    more
      ? `Selling ${name} to your employees could leave you with about ${afterTax} after tax. That's about ${formatMoney(more)} more than selling to an outside buyer, ${why}.`
      : `Selling ${name} to your employees could leave you with about ${afterTax} after tax.`,
    owners,
  ];
}

function windDownSummary(name: string, snapshot: Snapshot, results: Results, windDown: ExitOption): string[] {
  const n = snapshot.employees;
  const jobs = n > 1 ? [`All ${n} jobs would be lost.`] : n === 1 ? ["Your employee's job would be lost."] : [];
  const canadian = results.options.find((o) => o.id === "canadian");
  const saleMore = gap(canadian, windDown);
  const check = saleMore
    ? `For comparison, selling to a Canadian buyer could leave about ${formatMoney(canadian?.afterTax ?? 0)}, so it's worth checking whether an employee or a local buyer would take it over before you close.`
    : "Before you close, it's worth checking whether an employee or a local buyer would take it over.";
  const runway =
    snapshot.yearsToExit <= 1
      ? `Even with ${RUNWAY[snapshot.yearsToExit]} to go, your accountant or a business broker can quickly tell you whether someone would buy it.`
      : `With ${RUNWAY[snapshot.yearsToExit]} before you step away, there's time to look at a sale first.`;
  return [
    `Closing ${name} means selling the equipment and inventory, which could leave you with about ${formatMoney(windDown.afterTax ?? 0)} after tax.`,
    ...jobs,
    "This plan shows what a clean closing looks like.",
    check,
    runway,
  ];
}

/**
 * Warm, plain-language summary of the chosen plan for the owner (~60–110 words).
 * Every number comes from the engine; money is rounded by formatMoney.
 */
export function planSummary(option: OptionId, snapshot: Snapshot, results: Results): string {
  const name = snapshot.businessName?.trim() || "your business";
  const chosen = results.options.find((o) => o.id === option);
  if (!chosen) return `This plan walks you through the main steps for ${name}. ${runwaySentence(snapshot)}`;

  if (option === "winddown") return windDownSummary(name, snapshot, results, chosen).join(" ");

  const lead = {
    family: familySummary,
    canadian: canadianSummary,
    pe: peSummary,
    eot: eotSummary,
  }[option](name, snapshot, results, chosen);
  return [...lead, readinessSentence(results), runwaySentence(snapshot, chosen)].join(" ");
}
