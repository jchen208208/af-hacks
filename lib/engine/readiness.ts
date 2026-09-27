// Readiness score, bands and top fixes (plan 7.2).

import { READINESS_BANDS, READINESS_FACTORS, READINESS_POINTS } from "@/lib/config/assumptions";
import type { FactorScore, ReadinessBand, ReadinessFactor, ReadinessFix, ReadinessResult, Snapshot } from "./types";

/** Action-phrased titles for the "Top 3 fixes" cards. */
const FIX_LABELS: Record<Exclude<ReadinessFactor, "runway">, string> = {
  records: "Get accountant-prepared financial statements",
  ownerDependence: "Make the business run without you day to day",
  management: "Develop a second-in-command",
  customerConcentration: "Reduce how much you depend on your biggest customer",
  processes: "Write down how the key jobs get done",
};

const RUNWAY_LABELS: Record<Snapshot["yearsToExit"], string> = {
  0: "You want to step away within a year.",
  1: "You want to step away in about a year.",
  2: "You want to step away in about 2 years.",
  3: "You have 3–4 years.",
  5: "You have 5 years or more. That's plenty of time to prepare.",
};

function factorPoints(snapshot: Snapshot): Record<ReadinessFactor, number> {
  return {
    records: READINESS_POINTS.records[snapshot.records],
    ownerDependence: READINESS_POINTS.runWithoutOwner[snapshot.runWithoutOwner],
    management: READINESS_POINTS.managers[snapshot.managers],
    customerConcentration: READINESS_POINTS.topCustomerShare[snapshot.topCustomerShare],
    processes: READINESS_POINTS.processes[snapshot.processes],
    runway: READINESS_POINTS.yearsToExit[snapshot.yearsToExit],
  };
}

export function readinessBand(score: number): { band: ReadinessBand; label: string } {
  let match: (typeof READINESS_BANDS)[number] = READINESS_BANDS[0];
  for (const b of READINESS_BANDS) if (score >= b.min) match = b;
  return { band: match.band, label: match.label };
}

export function computeReadiness(snapshot: Snapshot): ReadinessResult {
  const points = factorPoints(snapshot);
  const order = Object.keys(READINESS_FACTORS) as ReadinessFactor[];

  const factors: FactorScore[] = order.map((factor) => ({
    factor,
    label: READINESS_FACTORS[factor].label,
    points: points[factor],
    max: READINESS_FACTORS[factor].max,
  }));

  const score = Math.min(100, factors.reduce((sum, f) => sum + f.points, 0));
  const { band, label } = readinessBand(score);

  // Sort by gap, descending; Array.prototype.sort is stable, so ties keep READINESS_FACTORS order.
  const topFixes: ReadinessFix[] = factors
    .filter((f) => f.factor !== "runway" && f.max - f.points > 0)
    .sort((a, b) => b.max - b.points - (a.max - a.points))
    .slice(0, 3)
    .map((f) => ({
      factor: f.factor,
      label: FIX_LABELS[f.factor as Exclude<ReadinessFactor, "runway">],
      gain: f.max - f.points,
      reason: READINESS_FACTORS[f.factor].fixReason,
    }));

  const runwayMaxed = points.runway >= READINESS_FACTORS.runway.max;
  const runwayNote = runwayMaxed
    ? RUNWAY_LABELS[snapshot.yearsToExit]
    : `${RUNWAY_LABELS[snapshot.yearsToExit]} ${READINESS_FACTORS.runway.fixReason}`;

  return { score, band, bandLabel: label, factors, topFixes, runwayNote };
}
