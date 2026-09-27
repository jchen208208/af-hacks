// Transition plan templates, compressed/expanded to yearsToExit (plan 7.6).
//
// A plan is: the owner's top readiness fixes (sale options only), then the option's
// template steps, each placed on the owner's runway (PLAN_HORIZON_MONTHS). Step text
// is qualitative and plain-language: no dollar figures (the engine outputs carry the
// numbers), and "talk to your CPA about…" rather than advice. Step ids are stable
// because they key the persisted checklist on /plan.

import { PLAN_HORIZON_MONTHS, PLAN_MONTH_LABEL_MAX } from "@/lib/config/assumptions";
import type {
  EotStatus,
  OptionId,
  PlanStep,
  ReadinessFactor,
  ReadinessFix,
  ReadinessResult,
  Snapshot,
} from "./types";

type FixFactor = Exclude<ReadinessFactor, "runway">;

/** Where a template step sits on the runway. */
type Timing =
  /** Fraction of the runway: 0 = today, 1 = closing. */
  | { at: number }
  /** A fixed number of months before closing (used by wind-down, which happens at the end). */
  | { monthsBeforeClose: number }
  /** After closing, with a fixed label ("Years 1–2 after closing"). */
  | { after: string };

interface TemplateStep {
  key: string;
  timing: Timing;
  title: string;
  detail: string;
  /** Dropped when one of these factors is among the owner's top fixes (the fix step already covers it). */
  coveredBy?: FixFactor[];
  /** EOT only: replacement text when the eligibility check says "Likely not eligible". */
  ifIneligible?: { title?: string; detail: string };
}

// --- Readiness fixes → plan steps ---

// Fix step titles are the fix labels from readiness.ts, so /results and /plan use the same wording.

/** Added to each fix when the runway is short (a year or less). */
const QUICK_WINS: Record<FixFactor, string> = {
  customerConcentration: "Short on time? A longer written contract with that customer can reassure a buyer.",
  ownerDependence: "Short on time? Start handing day-to-day decisions and customer calls to your staff now.",
  management: "Short on time? Name one person as your second-in-command and give them real authority now.",
  records: "Short on time? Ask your accountant to prepare statements for the last two or three years.",
  processes: "Short on time? Write down the few jobs that only you know how to do.",
};

// --- Option templates (6–8 steps for sales; wind-down is shorter) ---

const EOT: TemplateStep[] = [
  {
    key: "financials",
    timing: { at: 0.03 },
    title: "Pull together 3 years of accountant-prepared financials",
    detail: "The valuator, the lender and the future trustees will all ask for them.",
    coveredBy: ["records"],
  },
  {
    key: "advisors",
    timing: { at: 0.08 },
    title: "Talk to a CPA and a lawyer who have set up an EOT",
    detail:
      "Employee ownership trusts are new in Canada, so choose advisors who have done one before. They can confirm whether you qualify for the exemption on up to $10M of gain.",
    ifIneligible: {
      title: "Check with an EOT-experienced CPA and lawyer whether you qualify",
      detail:
        "Your answers suggest you may not qualify for the exemption on up to $10M of gain. Advisors who have done an EOT can tell you whether you can change that, and what the sale looks like without it.",
    },
  },
  {
    key: "employees",
    timing: { at: 0.3 },
    title: "Involve key employees and choose future leaders and trustees",
    detail:
      "Bring your managers in early and decide who will lead after you. The trustees hold the shares for the employees, and the rules require most of them to be independent of you and your family.",
  },
  {
    key: "valuation",
    timing: { at: 0.6 },
    title: "Get a formal valuation from a Chartered Business Valuator",
    detail: "The trust must pay fair market value, so an independent valuation protects you and your employees.",
  },
  {
    key: "trust",
    timing: { at: 0.72 },
    title: "Set up the trust and arrange the financing",
    detail:
      "The trust usually pays you over time from company profits, often with a bank or BDC loan for part of the price. Your lawyer drafts the trust and the sale agreement.",
  },
  {
    key: "announce",
    timing: { at: 0.88 },
    title: "Explain the change to all your employees",
    detail: "Tell the whole team what the trust means for them: their jobs continue and they share in the profits.",
  },
  {
    key: "close",
    timing: { at: 1 },
    title: "Close the sale to the employee ownership trust",
    detail: "Your lawyer handles the closing documents, and you claim the exemption on your tax return for that year.",
    ifIneligible: {
      detail: "Your lawyer handles the closing documents. If you qualify by then, you claim the exemption on your tax return for that year.",
    },
  },
  {
    key: "qualifying",
    timing: { after: "Years 1–2 after closing" },
    title: "Stay involved through the 24-month qualifying period",
    detail:
      "The trust must keep qualifying for 24 months after the sale, or the exemption can be clawed back. Use this time to coach the new leaders.",
    ifIneligible: {
      title: "Stay involved while the new leaders settle in",
      detail:
        "Coach the new leaders through the first couple of years. If you did claim the exemption, the trust must keep qualifying for 24 months after the sale.",
    },
  },
];

const FAMILY: TemplateStep[] = [
  {
    key: "successor",
    timing: { at: 0.03 },
    title: "Choose your successor and test them in a leadership role",
    detail:
      "Make sure they want to run the business, not just own it. Let them take over key customers, suppliers and decisions while you're still there to coach.",
  },
  {
    key: "talk",
    timing: { at: 0.12 },
    title: "Talk the plan through with the whole family",
    detail:
      "Include children who aren't taking over, so everyone understands how the business and your estate will be shared fairly.",
  },
  {
    key: "tax",
    timing: { at: 0.25 },
    title: "Ask your CPA about the tax rules for family sales",
    detail:
      "Since 2024, a sale to your children or grandchildren can be taxed as a capital gain and use your lifetime exemption, but only if strict conditions are met, such as handing over control. Also ask about an estate freeze, which locks in today's value for you so future growth goes to your successor.",
  },
  {
    key: "valuation",
    timing: { at: 0.5 },
    title: "Get a formal valuation from a Chartered Business Valuator",
    detail: "An independent price protects you with the CRA and helps keep things fair between your children.",
  },
  {
    key: "payment",
    timing: { at: 0.65 },
    title: "Agree how your successor will pay you over time",
    detail:
      "Family buyers usually pay from the business's profits over several years, sometimes with a bank or BDC loan for part of it. Put the schedule in writing.",
  },
  {
    key: "legal",
    timing: { at: 0.8 },
    title: "Update your shareholder agreement, will and powers of attorney",
    detail: "Your lawyer can make sure the paperwork matches the plan, including what happens if someone falls ill or dies.",
  },
  {
    key: "close",
    timing: { at: 1 },
    title: "Close the transfer of your shares",
    detail: "Your lawyer and CPA handle the documents. Any lifetime exemption is claimed on your tax return for that year.",
  },
  {
    key: "advisor",
    timing: { after: "Years 1–3 after closing" },
    title: "Stay on as an advisor, then step back",
    detail:
      "Be available for advice while your successor finds their feet. The family-sale tax rules expect you to hand over management within a set time, so ask your CPA for the deadline.",
  },
];

const CANADIAN: TemplateStep[] = [
  {
    key: "books",
    timing: { at: 0.03 },
    title: "Clean up your books and separate personal expenses",
    detail:
      "Buyers look at your \"normalized\" earnings: profit with personal and one-time costs taken out. Your accountant can prepare these adjustments.",
  },
  {
    key: "valuation",
    timing: { at: 0.3 },
    title: "Get a valuation from a Chartered Business Valuator",
    detail: "Knowing a fair price before you go to market helps you set your asking price and spot a lowball offer.",
  },
  {
    key: "buyers",
    timing: { at: 0.45 },
    title: "Prepare a confidential summary and find buyers",
    detail:
      "A business broker, your accountant or your lawyer can quietly approach individual buyers, search-fund entrepreneurs and competitors without tipping off staff or customers.",
  },
  {
    key: "screen",
    timing: { at: 0.55 },
    title: "Screen serious buyers and have them sign an NDA",
    detail:
      "A non-disclosure agreement (NDA) keeps your numbers private. Check that each buyer has the experience and the money to close.",
  },
  {
    key: "loi",
    timing: { at: 0.65 },
    title: "Negotiate a letter of intent, including how you'll be paid",
    detail:
      "It sets the price and terms before the detailed checks start. Often 30–50% of the price is paid to you over several years (vendor financing), with the rest from the buyer and a lender such as a bank or BDC.",
  },
  {
    key: "diligence",
    timing: { at: 0.8 },
    title: "Get through the buyer's due diligence",
    detail:
      "The buyer and their lender check your finances, contracts, equipment and staff. Having documents ready keeps the deal moving.",
  },
  {
    key: "close",
    timing: { at: 1 },
    title: "Close the sale",
    detail: "Your lawyer handles the closing documents. If you sell shares, ask your CPA about claiming your lifetime capital gains exemption.",
  },
  {
    key: "transition",
    timing: { after: "First year after closing" },
    title: "Train the new owner during the transition period",
    detail: "Most deals include a handover period in which you introduce the buyer to customers, suppliers and staff.",
  },
];

const PE: TemplateStep[] = [
  {
    key: "advisor",
    timing: { at: 0.03 },
    title: "Hire an M&A advisor or investment banker",
    detail:
      "Private equity firms and large companies buy businesses for a living. An M&A advisor (a specialist who runs business sales) finds several buyers and makes them compete.",
  },
  {
    key: "team",
    timing: { at: 0.1 },
    title: "Build a management team that can run it without you",
    detail: "These buyers invest in the team, not the owner, and usually expect your managers to stay after the sale.",
    coveredBy: ["management", "ownerDependence"],
  },
  {
    key: "qoe",
    timing: { at: 0.3 },
    title: "Get a quality-of-earnings review",
    detail:
      "An accounting firm tests how reliable and repeatable your profits are. Buyers will do their own, so doing one first means fewer surprises and less haggling over price.",
  },
  {
    key: "dataroom",
    timing: { at: 0.5 },
    title: "Prepare a data room and management presentations",
    detail:
      "A data room is a secure online folder with every document the buyer's accountants and lawyers will check in due diligence. Your advisor will coach you and your managers for the presentations.",
  },
  {
    key: "offers",
    timing: { at: 0.65 },
    title: "Compare offers, including earn-outs and rollover equity",
    detail:
      "An earn-out pays part of the price later if targets are met; rollover equity means keeping a minority stake. Compare what you get at closing, not just the headline price.",
  },
  {
    key: "employees",
    timing: { at: 0.85 },
    title: "Negotiate protections for your employees",
    detail:
      "Large buyers sometimes merge operations or cut roles. Ask your lawyer about written commitments on jobs, location or retention bonuses before you sign.",
  },
  {
    key: "close",
    timing: { at: 1 },
    title: "Close the sale",
    detail: "Most of the price is usually paid at closing. Ask your CPA about claiming your lifetime capital gains exemption.",
  },
  {
    key: "earnout",
    timing: { after: "Years 1–3 after closing" },
    title: "Work through the earn-out and transition period",
    detail: "You may be asked to stay on for a year or more, and any earn-out payments depend on the business hitting the agreed targets.",
  },
];

/** Shared with the tests: the wind-down plan always ends with this step. */
export const WINDDOWN_CHECK_ID = "winddown-check-buyers";

// Wind-down deliberately gets NO readiness-fix steps: fixing customer concentration or
// management depth only raises the price a buyer would pay, which is pointless when
// closing. It opens with a check for a buyer (plan 7.6 puts this nudge last, but it has to
// happen before anything irreversible, so it comes right after the first advisor talk).
// The closing steps then sit in the final months before closing.
const WINDDOWN: TemplateStep[] = [
  {
    key: "advisors",
    timing: { at: 0 },
    title: "Talk to your CPA and lawyer about closing cleanly",
    detail: "Ask about the simplest, lowest-cost way to close, and how selling the assets and paying yourself out will be taxed.",
  },
  {
    key: "check-buyers",
    timing: { at: 0.1 },
    title: "Before you close, see if an employee or local buyer would take over",
    detail:
      "A profitable business is usually worth far more sold than closed, and a sale keeps jobs in your community. Ask your accountant or a business broker to test the market. If no one steps up, keep running as normal until the final months.",
  },
  {
    key: "employees",
    timing: { monthsBeforeClose: 6 },
    title: "Give your employees proper notice",
    detail:
      "Your province's employment standards set minimum notice and, in some cases, severance, and long-serving staff may be owed more. Your lawyer can confirm what applies.",
  },
  {
    key: "assets",
    timing: { monthsBeforeClose: 4 },
    title: "Have your equipment and inventory appraised, then sell it",
    detail:
      "An appraiser or auctioneer can tell you what things will fetch. Sell as the work winds down; another business in your industry may buy it all in one lot.",
  },
  {
    key: "obligations",
    timing: { monthsBeforeClose: 2 },
    title: "Settle your lease, debts and customer and supplier commitments",
    detail: "Tell customers and suppliers early, finish or hand off open work, and pay off loans and leases.",
  },
  {
    key: "dissolve",
    timing: { at: 1 },
    title: "File final tax returns and dissolve the corporation",
    detail: "Your CPA files the final corporate and payroll returns and closes your CRA accounts, and your lawyer files the dissolution.",
  },
];

const TEMPLATES: Record<OptionId, TemplateStep[]> = {
  eot: EOT,
  family: FAMILY,
  canadian: CANADIAN,
  pe: PE,
  winddown: WINDDOWN,
};

// --- "when" labels ---

const monthLabel = (month: number) => `Month ${month}`;

function quarterLabel(month: number): string {
  const year = Math.ceil(month / 12);
  const quarter = Math.ceil((((month - 1) % 12) + 1) / 3);
  return `Year ${year}, Q${quarter}`;
}

/** Sort key for a `when` label (months from today; post-closing labels sort last).
 *  Returns NaN for a label this module never produces. Exported for the tests. */
export function whenSortKey(when: string): number {
  const months = /^Month (\d+)$/.exec(when);
  if (months) return Number(months[1]);
  const quarter = /^Year (\d+), Q([1-4])$/.exec(when);
  if (quarter) return (Number(quarter[1]) - 1) * 12 + (Number(quarter[2]) - 1) * 3 + 1;
  if (/(after|before) closing$/.test(when)) return 10_000;
  return Number.NaN;
}

const isFixFactor = (fix: ReadinessFix): fix is ReadinessFix & { factor: FixFactor } => fix.factor !== "runway";

export function buildPlan(
  option: OptionId,
  snapshot: Snapshot,
  readiness: ReadinessResult,
  eotStatus?: EotStatus,
): PlanStep[] {
  const horizon = PLAN_HORIZON_MONTHS[snapshot.yearsToExit];
  const short = horizon <= PLAN_MONTH_LABEL_MAX;
  const label = (month: number) => (short ? monthLabel(month) : quarterLabel(month));
  const ineligible = option === "eot" && eotStatus === "unlikely";

  // 1. The owner's top readiness fixes, in order, all starting now (sale options only).
  const fixes = option === "winddown" ? [] : readiness.topFixes.filter(isFixFactor);
  const steps: PlanStep[] = fixes.map((fix) => ({
    id: `fix-${fix.factor}`,
    when: label(1),
    title: fix.label,
    detail: [
      fix.reason,
      `Worth about +${fix.gain} points on your readiness score.`,
      short ? QUICK_WINS[fix.factor] : "",
    ]
      .filter(Boolean)
      .join(" "),
  }));

  // 2. The option's template, minus steps a fix already covers, placed on the runway.
  const fixFactors = new Set<FixFactor>(fixes.map((f) => f.factor));
  let lastMonth = 1;
  for (const step of TEMPLATES[option]) {
    if (step.coveredBy?.some((f) => fixFactors.has(f))) continue;

    let when: string;
    if ("after" in step.timing) {
      when = step.timing.after;
    } else {
      const raw =
        "at" in step.timing ? Math.ceil(step.timing.at * horizon) : horizon - step.timing.monthsBeforeClose;
      // Clamp to the runway and never go backwards in time.
      const month = Math.max(lastMonth, Math.min(horizon, Math.max(1, raw)));
      lastMonth = month;
      when = label(month);
    }
    const text = ineligible && step.ifIneligible ? { ...step, ...step.ifIneligible } : step;
    steps.push({ id: `${option}-${step.key}`, when, title: text.title, detail: text.detail });
  }
  return steps;
}
