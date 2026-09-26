// Exit options comparison and best-match (plan 7.5).

import {
  EOT_EXEMPTION,
  LCGE,
  OPTION_PRICE_FACTOR,
  PE_MIN_READINESS,
  PE_MIN_SDE,
  PRIORITY_WEIGHTS,
  WINDDOWN_RECOVERY,
} from "@/lib/config/assumptions";
import { computeTax } from "./tax";
import type {
  EotResult,
  ExitOption,
  OptionId,
  Priority,
  ReadinessResult,
  Snapshot,
  ValuationResult,
} from "./types";

type OptionText = Omit<ExitOption, "status" | "statusNote" | "price" | "tax" | "afterTax">;

/** Display order and wording for each option. */
export const OPTION_TEXT: Record<OptionId, OptionText> = {
  family: {
    id: "family",
    name: "Pass it to family",
    exemptionLabel: "Lifetime exemption ($1.25M)",
    howPaid: "Mostly over time",
    employees: "Likely kept",
    staysCanadian: "Yes",
    time: "2–5 years",
    complexity: "Medium",
  },
  canadian: {
    id: "canadian",
    name: "Sell to a Canadian buyer",
    exemptionLabel: "Lifetime exemption ($1.25M)",
    howPaid: "50–70% at close, the rest over a few years",
    employees: "Usually kept",
    staysCanadian: "Yes",
    time: "6–12 months",
    complexity: "Medium",
  },
  pe: {
    id: "pe",
    name: "Sell to private equity or a large company",
    exemptionLabel: "Lifetime exemption ($1.25M)",
    howPaid: "Mostly at close",
    employees: "At risk of consolidation",
    staysCanadian: "Not guaranteed",
    time: "6–12 months",
    complexity: "High",
  },
  eot: {
    id: "eot",
    name: "Sell to your employees (EOT)",
    exemptionLabel: "EOT exemption (up to $10M)",
    howPaid: "Over time from company profits (often 5–10+ years)",
    employees: "Kept — and they become owners",
    staysCanadian: "Yes",
    time: "6–12 months to close",
    complexity: "Medium–High",
  },
  winddown: {
    id: "winddown",
    name: "Wind down and close",
    exemptionLabel: "None",
    howPaid: "As assets sell",
    employees: "All jobs lost",
    staysCanadian: "n/a",
    time: "3–12 months",
    complexity: "Low",
  },
};

const OPTION_ORDER: OptionId[] = ["family", "canadian", "pe", "eot", "winddown"];

function priced(snapshot: Snapshot, id: OptionId, price: number, exemption: number): ExitOption {
  const { tax, afterTax } = computeTax({
    price,
    sharesCostBase: snapshot.sharesCostBase,
    exemption,
    province: snapshot.province,
  });
  return { ...OPTION_TEXT[id], status: "available", price, tax, afterTax };
}

export function computeOptions(
  snapshot: Snapshot,
  readiness: ReadinessResult,
  valuation: ValuationResult,
  eot: EotResult,
): ExitOption[] {
  const mid = valuation.midpoint;

  return OPTION_ORDER.map((id): ExitOption => {
    switch (id) {
      case "family":
        if (snapshot.familyInterest === "no") {
          return { ...OPTION_TEXT.family, status: "unavailable", statusNote: "No family successor identified" };
        }
        return priced(snapshot, id, mid * OPTION_PRICE_FACTOR.family, LCGE);

      case "canadian":
        return priced(snapshot, id, mid * OPTION_PRICE_FACTOR.canadian, LCGE);

      case "pe":
        if (snapshot.sde < PE_MIN_SDE || readiness.score < PE_MIN_READINESS) {
          return { ...OPTION_TEXT.pe, status: "unavailable", statusNote: "Unlikely to attract interest" };
        }
        return priced(snapshot, id, mid * OPTION_PRICE_FACTOR.pe, LCGE);

      case "eot":
        if (eot.status === "unlikely") {
          return {
            ...priced(snapshot, id, mid * OPTION_PRICE_FACTOR.eot, 0),
            status: "warning",
            statusNote: "Your answers suggest you may not qualify for the EOT exemption, so this assumes full tax.",
            exemptionLabel: "None (may not qualify)",
          };
        }
        return priced(snapshot, id, mid * OPTION_PRICE_FACTOR.eot, EOT_EXEMPTION);

      case "winddown":
        // Plan 7.5: no exemption. Corporate-level tax on asset sales is not modelled (see Assumptions).
        return priced(snapshot, id, snapshot.tangibleAssets * WINDDOWN_RECOVERY, 0);
    }
  });
}

// Best match (plan 7.5). Each priority dimension ranks the candidate options with an ordinal
// (higher = better for the owner):
//   price     → after-tax money
//   employees → eot 4 (kept, become owners) · family 3 (likely kept) · canadian 2 (usually kept)
//               · pe 1 (at risk) · winddown 0 (all jobs lost)
//   local     → family / canadian / eot 1 (stays Canadian) · pe / winddown 0
//   speed     → winddown 3 (3–12 months) · canadian / pe / eot 2 (6–12 months) · family 1 (2–5 years)
// An option's points on a dimension = how many candidates it strictly beats (ties share),
// multiplied by the priority's weight (PRIORITY_WEIGHTS by rank: 4/3/2/1).
const EMPLOYEE_ORDINAL: Record<OptionId, number> = { eot: 4, family: 3, canadian: 2, pe: 1, winddown: 0 };
const LOCAL_ORDINAL: Record<OptionId, number> = { family: 1, canadian: 1, eot: 1, pe: 0, winddown: 0 };
const SPEED_ORDINAL: Record<OptionId, number> = { winddown: 3, canadian: 2, pe: 2, eot: 2, family: 1 };

function dimensionValue(priority: Priority, option: ExitOption): number {
  switch (priority) {
    case "price":
      return option.afterTax ?? 0;
    case "employees":
      return EMPLOYEE_ORDINAL[option.id];
    case "local":
      return LOCAL_ORDINAL[option.id];
    case "speed":
      return SPEED_ORDINAL[option.id];
  }
}

export function scoreOptions(snapshot: Snapshot, candidates: ExitOption[]): Map<OptionId, number> {
  const scores = new Map<OptionId, number>(candidates.map((o) => [o.id, 0]));
  snapshot.priorities.forEach((priority, rank) => {
    const weight = PRIORITY_WEIGHTS[rank] ?? 0;
    for (const option of candidates) {
      const value = dimensionValue(priority, option);
      const beats = candidates.filter((other) => dimensionValue(priority, other) < value).length;
      scores.set(option.id, (scores.get(option.id) ?? 0) + weight * beats);
    }
  });
  return scores;
}

/**
 * Options in the order to show them, best match first: viable sale options by score, then
 * wind-down, then unavailable options (display order).
 */
export function rankOptions(snapshot: Snapshot, options: ExitOption[]): ExitOption[] {
  const viable = options.filter((o) => o.status !== "unavailable");
  // Never rank wind-down above a sale option; it only comes first when it's the only viable option.
  const sales = viable.filter((o) => o.id !== "winddown");
  const windDown = viable.filter((o) => o.id === "winddown");
  const unavailable = options.filter((o) => o.status === "unavailable");

  const scores = scoreOptions(snapshot, sales);
  // Highest score first; ties go to more after-tax money, then display order (stable sort).
  const rankedSales = [...sales].sort(
    (a, b) => (scores.get(b.id) ?? 0) - (scores.get(a.id) ?? 0) || (b.afterTax ?? 0) - (a.afterTax ?? 0),
  );
  return [...rankedSales, ...windDown, ...unavailable];
}

export function pickBestMatch(snapshot: Snapshot, options: ExitOption[]): OptionId {
  return rankOptions(snapshot, options)[0]?.id ?? "winddown";
}
