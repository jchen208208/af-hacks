// Shared types for the calculation engine (plan section 7).
// The engine is pure TypeScript: no React, no network.

export type Province =
  | "ON" | "BC" | "AB" | "SK" | "MB" | "QC" | "NB"
  | "NS" | "PE" | "NL" | "YT" | "NT" | "NU";

export type Industry =
  | "manufacturing" | "construction" | "professional" | "retail" | "food"
  | "wholesale" | "health" | "transport" | "agriculture" | "other";

export type Priority = "price" | "employees" | "local" | "speed";

export interface Snapshot {
  businessName?: string;
  industry: Industry;
  province: Province;
  yearFounded: number;
  employees: number;
  revenue: number;
  sde: number; // profit before owner's pay & taxes
  tangibleAssets: number; // equipment + inventory, approx
  sharesCostBase: number; // default 100
  records: "audited" | "review" | "bookkeeping" | "messy";
  runWithoutOwner: "yes" | "mostly" | "no";
  managers: 0 | 1 | 2; // 2 means "2 or more"
  topCustomerShare: "lt10" | "10to25" | "25to50" | "gt50";
  processes: "most" | "some" | "few";
  ownerAge: number;
  yearsToExit: 0 | 1 | 2 | 3 | 5; // 0 = <1 year, 3 = 3–4, 5 = 5+
  familyInterest: "yes" | "maybe" | "no";
  priorities: Priority[]; // ranked, most important first
}

// --- Readiness (7.2) ---

export type ReadinessFactor =
  | "records" | "ownerDependence" | "management"
  | "customerConcentration" | "processes" | "runway";

export type ReadinessBand = "not-ready" | "getting-there" | "ready";

export interface FactorScore {
  factor: ReadinessFactor;
  label: string;
  points: number;
  max: number;
}

export interface ReadinessFix {
  factor: ReadinessFactor;
  label: string;
  gain: number; // "+N points"
  reason: string;
}

export interface ReadinessResult {
  score: number;
  band: ReadinessBand;
  bandLabel: string;
  factors: FactorScore[];
  topFixes: ReadinessFix[];
  runwayNote: string;
}

// --- Valuation (7.3) ---

export interface ValuationResult {
  multiple: number;
  low: number;
  midpoint: number;
  high: number;
}

// --- EOT eligibility (7.7) ---

export type EotAnswer = "yes" | "no" | "unsure";
export type EotQuestionId =
  | "ownedTwoYears" | "activeTwoYears" | "activeAssets"
  | "canadianBeneficiaries" | "giveUpControl" | "familyExcluded";
export type EotAnswers = Partial<Record<EotQuestionId, EotAnswer>>;
export type EotStatus = "likely" | "review" | "unlikely";

export interface EotResult {
  status: EotStatus;
  label: string;
}

// --- Exit options (7.5) ---

export type OptionId = "family" | "canadian" | "pe" | "eot" | "winddown";

export interface ExitOption {
  id: OptionId;
  name: string;
  /** "available" shows numbers; "unavailable" greys the option out; "warning" shows numbers with a caution. */
  status: "available" | "unavailable" | "warning";
  statusNote?: string;
  price?: number;
  tax?: number;
  afterTax?: number;
  exemptionLabel: string;
  howPaid: string;
  employees: string;
  staysCanadian: string;
  time: string;
  complexity: string;
}

// --- Transition plan (7.6) ---

export interface PlanStep {
  id: string;
  when: string; // e.g. "Year 1, Q1"
  title: string;
  detail?: string;
}

export interface Results {
  readiness: ReadinessResult;
  valuation: ValuationResult;
  eot: EotResult;
  options: ExitOption[];
  bestMatch: OptionId;
}
