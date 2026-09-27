// Engine entry point: runEngine(snapshot) → Results.
// The UI only ever calls these two functions.

import { checkEot } from "./eot";
import { computeOptions, rankOptions } from "./options";
import { buildPlan } from "./plan";
import { computeReadiness } from "./readiness";
import type { EotAnswers, OptionId, PlanStep, Results, Snapshot } from "./types";
import { computeValuation } from "./valuation";

export function runEngine(snapshot: Snapshot, eotAnswers: EotAnswers): Results {
  const readiness = computeReadiness(snapshot);
  const valuation = computeValuation(snapshot, readiness.score);
  const eot = checkEot(eotAnswers);
  // Ranked best match first, so the comparison reads left to right (top to bottom on phones).
  const options = rankOptions(snapshot, computeOptions(snapshot, readiness, valuation, eot));
  const bestMatch = options[0].id;
  return { readiness, valuation, eot, options, bestMatch };
}

export function runPlan(option: OptionId, snapshot: Snapshot, eotAnswers: EotAnswers = {}): PlanStep[] {
  return buildPlan(option, snapshot, computeReadiness(snapshot), checkEot(eotAnswers).status);
}

export type * from "./types";
