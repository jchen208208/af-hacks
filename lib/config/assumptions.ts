// ALL numbers the engine uses live here, each with its source, so they can be
// reviewed and edited in one place (plan section 0).

import type { Industry, OptionId, Province, ReadinessFactor } from "@/lib/engine/types";

// --- Readiness scoring (plan 7.2) ---

export const READINESS_POINTS = {
  records: { audited: 20, review: 14, bookkeeping: 7, messy: 0 },
  runWithoutOwner: { yes: 20, mostly: 12, no: 0 },
  managers: { 2: 15, 1: 9, 0: 0 },
  topCustomerShare: { lt10: 15, "10to25": 10, "25to50": 5, gt50: 0 },
  processes: { most: 10, some: 5, few: 0 },
  yearsToExit: { 5: 20, 3: 15, 2: 10, 1: 5, 0: 0 },
} as const;

export const READINESS_FACTORS: Record<
  ReadinessFactor,
  { label: string; max: number; fixReason: string }
> = {
  records: {
    label: "Financial records",
    max: 20,
    fixReason: "Buyers and lenders pay more when they can trust the numbers.",
  },
  ownerDependence: {
    label: "Runs without you",
    max: 20,
    fixReason: "If the business needs you every day, a buyer is really buying a job, not a company.",
  },
  management: {
    label: "Management depth",
    max: 15,
    fixReason: "A second-in-command gives a buyer confidence the business will keep running after you leave.",
  },
  customerConcentration: {
    label: "Customer spread",
    max: 15,
    fixReason: "Losing one big customer could sink the business, so buyers discount for it.",
  },
  processes: {
    label: "Written processes",
    max: 10,
    fixReason: "Written processes let a new owner run things the way you do.",
  },
  runway: {
    label: "Time to prepare",
    max: 20,
    fixReason: "Starting earlier gives you more options.",
  },
};

export const READINESS_BANDS = [
  { band: "not-ready", min: 0, label: "Not ready yet" },
  { band: "getting-there", min: 40, label: "Getting there" },
  { band: "ready", min: 70, label: "Ready" },
] as const;

// --- Valuation (plan 7.3) ---
// Illustrative SDE multiples, anchored on the BizBuySell Q4 2025 average of 2.57x SDE
// and a typical 2.0-4.0x range.
// Source: https://sunbeltbusinessbrokerscalgary.ca/canadian-small-business-sale-statistics-2026-52-data-points-on-deal-volume-valuations-and-exit-trends/
export const SDE_MULTIPLES: Record<Industry, { low: number; high: number }> = {
  manufacturing: { low: 2.8, high: 4.0 },
  wholesale: { low: 2.5, high: 3.5 },
  transport: { low: 2.4, high: 3.4 },
  agriculture: { low: 2.5, high: 3.5 },
  health: { low: 2.3, high: 3.3 },
  construction: { low: 2.2, high: 3.2 },
  professional: { low: 2.0, high: 3.0 },
  other: { low: 2.0, high: 3.0 },
  retail: { low: 1.8, high: 2.8 },
  food: { low: 1.5, high: 2.5 },
};

/** The value range is the midpoint ±15%. */
export const VALUE_RANGE_SPREAD = 0.15;

// --- Tax (plan 7.4) — illustrative only ---

/** Capital gains inclusion rate. */
export const INCLUSION_RATE = 0.5;

/** Lifetime Capital Gains Exemption on qualifying small-business shares, per individual. */
export const LCGE = 1_250_000;

/** EOT capital gains exemption, made permanent April 2026.
 *  Source: EY Tax Alert 2026 No. 28 — https://www.ey.com/en_ca/technical/tax/tax-alerts/2026/tax-alert-2026-no-28 */
export const EOT_EXEMPTION = 10_000_000;

/** 2026 combined federal + provincial/territorial top marginal personal income tax
 *  rates on ordinary ("interest and regular") income. Verified 2026-09-26 against:
 *  KPMG Canada, "Combined Top Marginal Tax Rates For Individuals—2026" (current as
 *  of June 30, 2026), https://assets.kpmg.com/content/dam/kpmgsites/ca/pdf/services/tax/personal-tables/ca-combined-top-marginal-tax-rates-for-individuals-2026.pdf.coredownload.inline.pdf
 *  Cross-checked against TaxTips.ca 2026 provincial tax-bracket pages
 *  (taxtips.ca/taxrates/<prov>.htm) for PE, NT, QC, and NL, all of which matched
 *  the KPMG figures exactly. Ontario is the demo province and must be right;
 *  KPMG confirms 0.5353. */
export const TOP_RATE: Record<Province, number> = {
  ON: 0.5353,
  BC: 0.535,
  AB: 0.48,
  SK: 0.475,
  MB: 0.504,
  QC: 0.5331,
  NB: 0.525,
  NS: 0.54,
  PE: 0.53, // was 0.5175; KPMG + TaxTips.ca 2026 both show 53.00%, not ~51.75%
  NL: 0.548,
  YT: 0.48,
  NT: 0.4705,
  NU: 0.445,
};

// --- Exit options (plan 7.5) ---

export const OPTION_PRICE_FACTOR: Record<Exclude<OptionId, "winddown">, number> = {
  family: 0.85,
  canadian: 1.0,
  pe: 1.1,
  eot: 1.0, // must be fair market value
};

/** Wind-down recovers roughly this share of equipment + inventory. */
export const WINDDOWN_RECOVERY = 0.6;

/** Private equity only shows numbers above these thresholds. */
export const PE_MIN_SDE = 1_000_000;
export const PE_MIN_READINESS = 60;

/** Best-match weights by priority rank (1st, 2nd, 3rd, 4th). */
export const PRIORITY_WEIGHTS = [4, 3, 2, 1];

// --- Transition plan (plan 7.6) ---

/** Months from today to closing, by the owner's answer to "when do you want to exit?".
 *  The plan's steps are spread across this runway. 0 = under a year, 3 = "3–4 years", 5 = "5+". */
export const PLAN_HORIZON_MONTHS: Record<0 | 1 | 2 | 3 | 5, number> = {
  0: 9,
  1: 12,
  2: 24,
  3: 42,
  5: 60,
};

/** Runways this short (in months) get month labels ("Month 6") and quick-win tips on each fix;
 *  longer runways get quarter labels ("Year 2, Q3"). */
export const PLAN_MONTH_LABEL_MAX = 12;

// --- Display ---

/** Money on screen is rounded to the nearest $10K (no false precision). */
export const DISPLAY_ROUNDING = 10_000;
