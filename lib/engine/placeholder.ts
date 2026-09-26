// PLACEHOLDER transition-plan steps used until the plan templates land (Phase 4).
// Delete this file once buildPlan() is implemented.

import type { OptionId, PlanStep } from "./types";

const EOT_STEPS: PlanStep[] = [
  { id: "fixes", when: "Year 1, Q1", title: "Fix your top readiness gaps", detail: "Start with your three biggest gaps from your readiness score." },
  { id: "financials", when: "Year 1, Q2", title: "Get 3 years of accountant-prepared or reviewed financials" },
  { id: "advisors", when: "Year 1, Q3", title: "Talk to a CPA and business lawyer who have done EOT sales" },
  { id: "valuation", when: "Year 2, Q1", title: "Get a formal valuation from a Chartered Business Valuator", detail: "The sale must be at fair market value." },
  { id: "employees", when: "Year 2, Q2", title: "Tell and involve key employees", detail: "Identify future leaders and choose trustees." },
  { id: "trust", when: "Year 3, Q1", title: "Set up the trust and the financing", detail: "Company profits, a bank or BDC loan, and vendor financing." },
  { id: "close", when: "Year 3, Q3", title: "Close the sale", detail: "The exemption is claimed on your tax return." },
  { id: "transition", when: "Year 4", title: "Stay involved for a transition period", detail: "The trust must keep qualifying for 24 months or the exemption can be clawed back." },
];

const GENERIC_STEPS: PlanStep[] = [
  { id: "fixes", when: "Year 1, Q1", title: "Fix your top readiness gaps" },
  { id: "financials", when: "Year 1, Q2", title: "Get your financials in order" },
  { id: "advisors", when: "Year 1, Q3", title: "Talk to a CPA and a business lawyer" },
  { id: "placeholder", when: "—", title: "Option-specific steps coming in Phase 4" },
];

export function placeholderPlanSteps(option: OptionId): PlanStep[] {
  return option === "eot" ? EOT_STEPS : GENERIC_STEPS;
}
