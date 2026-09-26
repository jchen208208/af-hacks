// Engine entry point: runEngine(snapshot) → Results.
// The UI only ever calls these two functions.

import { checkEot } from "./eot";
import { computeOptions, pickBestMatch } from "./options";
import { placeholderPlanSteps } from "./placeholder";
import { computeReadiness } from "./readiness";
import type { EotAnswers, OptionId, PlanStep, Results, Snapshot } from "./types";
import { computeValuation } from "./valuation";

export function runEngine(snapshot: Snapshot, eotAnswers: EotAnswers): Results {
  const readiness = computeReadiness(snapshot);
  const valuation = computeValuation(snapshot, readiness.score);
  const eot = checkEot(eotAnswers);
  const options = computeOptions(snapshot, readiness, valuation, eot);
  const bestMatch = pickBestMatch(snapshot, options);
  return { readiness, valuation, eot, options, bestMatch };
}

export function runPlan(option: OptionId, snapshot: Snapshot): PlanStep[] {
  // TODO(Phase 4): buildPlan(option, snapshot, computeReadiness(snapshot)).
  void snapshot;
  return placeholderPlanSteps(option);
}

export type * from "./types";
