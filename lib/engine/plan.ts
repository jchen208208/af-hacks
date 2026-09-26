// Transition plan templates, compressed/expanded to yearsToExit (plan 7.6).

import type { OptionId, PlanStep, ReadinessResult, Snapshot } from "./types";
import { notImplemented } from "./notImplemented";

export function buildPlan(option: OptionId, snapshot: Snapshot, readiness: ReadinessResult): PlanStep[] {
  // TODO(Phase 4): 6–8 step templates per option, starting with the top-3 readiness fixes.
  void option; void snapshot; void readiness;
  return notImplemented("buildPlan");
}
