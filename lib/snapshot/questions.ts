// Labels and choices for the Business Snapshot wizard (plan 6.2).

import { z } from "zod";
import type { Industry, Priority, Province, Snapshot } from "@/lib/engine/types";

export type Choice<T extends string | number> = { value: T; label: string };

export const INDUSTRIES: Choice<Industry>[] = [
  { value: "manufacturing", label: "Manufacturing" },
  { value: "construction", label: "Construction & trades" },
  { value: "professional", label: "Professional services" },
  { value: "retail", label: "Retail" },
  { value: "food", label: "Restaurant & food service" },
  { value: "wholesale", label: "Wholesale & distribution" },
  { value: "health", label: "Health & personal care" },
  { value: "transport", label: "Transportation & logistics" },
  { value: "agriculture", label: "Agriculture" },
  { value: "other", label: "Other" },
];

export const PROVINCES: Choice<Province>[] = [
  { value: "AB", label: "Alberta" },
  { value: "BC", label: "British Columbia" },
  { value: "MB", label: "Manitoba" },
  { value: "NB", label: "New Brunswick" },
  { value: "NL", label: "Newfoundland and Labrador" },
  { value: "NT", label: "Northwest Territories" },
  { value: "NS", label: "Nova Scotia" },
  { value: "NU", label: "Nunavut" },
  { value: "ON", label: "Ontario" },
  { value: "PE", label: "Prince Edward Island" },
  { value: "QC", label: "Quebec" },
  { value: "SK", label: "Saskatchewan" },
  { value: "YT", label: "Yukon" },
];

export const RECORDS: Choice<Snapshot["records"]>[] = [
  { value: "audited", label: "Prepared by an accountant (audited or compiled)" },
  { value: "review", label: "Reviewed by an accountant" },
  { value: "bookkeeping", label: "Bookkeeping only" },
  { value: "messy", label: "Messy or behind" },
];

export const RUN_WITHOUT_OWNER: Choice<Snapshot["runWithoutOwner"]>[] = [
  { value: "yes", label: "Yes" },
  { value: "mostly", label: "Mostly" },
  { value: "no", label: "No" },
];

export const MANAGERS: Choice<"0" | "1" | "2">[] = [
  { value: "0", label: "Nobody yet" },
  { value: "1", label: "1 person" },
  { value: "2", label: "2 or more" },
];

export const TOP_CUSTOMER: Choice<Snapshot["topCustomerShare"]>[] = [
  { value: "lt10", label: "Less than 10%" },
  { value: "10to25", label: "10–25%" },
  { value: "25to50", label: "25–50%" },
  { value: "gt50", label: "More than 50%" },
];

export const PROCESSES: Choice<Snapshot["processes"]>[] = [
  { value: "most", label: "Most things are written down" },
  { value: "some", label: "Some things" },
  { value: "few", label: "Very little" },
];

export const YEARS_TO_EXIT: Choice<"0" | "1" | "2" | "3" | "5">[] = [
  { value: "0", label: "Less than 1 year" },
  { value: "1", label: "About 1 year" },
  { value: "2", label: "About 2 years" },
  { value: "3", label: "3–4 years" },
  { value: "5", label: "5 years or more" },
];

export const FAMILY_INTEREST: Choice<Snapshot["familyInterest"]>[] = [
  { value: "yes", label: "Yes" },
  { value: "maybe", label: "Maybe" },
  { value: "no", label: "No" },
];

export const PRIORITY_LABELS: Record<Priority, string> = {
  price: "Getting the highest price",
  employees: "Protecting my employees",
  local: "Keeping it locally owned",
  speed: "Selling quickly",
};

export const DEFAULT_PRIORITIES: Priority[] = ["price", "employees", "local", "speed"];
export const DEFAULT_SHARES_COST_BASE = 100;

// --- Validation (zod), one schema per wizard step ---

const thisYear = new Date().getFullYear();
const money = (label: string) =>
  z.number({ error: `Enter ${label}` }).min(0, `${label} can't be negative`);

export const STEP_SCHEMAS = [
  z.object({
    businessName: z.string().optional(),
    industry: z.enum(INDUSTRIES.map((c) => c.value) as [Industry, ...Industry[]], { error: "Choose an industry" }),
    province: z.enum(PROVINCES.map((c) => c.value) as [Province, ...Province[]], { error: "Choose a province or territory" }),
    yearFounded: z.number({ error: "Enter the year founded" }).int().min(1800).max(thisYear, "That year is in the future"),
    employees: z.number({ error: "Enter the number of employees" }).int().min(0),
    revenue: money("annual revenue"),
  }),
  z.object({
    sde: money("annual profit"),
    tangibleAssets: money("equipment and inventory value"),
    sharesCostBase: money("what you paid for your shares"),
  }),
  z.object({
    records: z.enum(["audited", "review", "bookkeeping", "messy"], { error: "Choose one" }),
    runWithoutOwner: z.enum(["yes", "mostly", "no"], { error: "Choose one" }),
    managers: z.union([z.literal(0), z.literal(1), z.literal(2)], { error: "Choose one" }),
    topCustomerShare: z.enum(["lt10", "10to25", "25to50", "gt50"], { error: "Choose one" }),
    processes: z.enum(["most", "some", "few"], { error: "Choose one" }),
  }),
  z.object({
    ownerAge: z.number({ error: "Enter your age" }).int().min(18).max(110),
    yearsToExit: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3), z.literal(5)], { error: "Choose one" }),
    familyInterest: z.enum(["yes", "maybe", "no"], { error: "Choose one" }),
    priorities: z.array(z.enum(["price", "employees", "local", "speed"])).length(4),
  }),
] as const;

export const SNAPSHOT_SCHEMA = STEP_SCHEMAS[0]
  .extend(STEP_SCHEMAS[1].shape)
  .extend(STEP_SCHEMAS[2].shape)
  .extend(STEP_SCHEMAS[3].shape);

export const STEP_TITLES = ["The business", "The numbers", "How it runs", "You and your plans"];
