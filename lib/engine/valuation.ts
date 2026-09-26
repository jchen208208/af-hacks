// Value estimate: SDE × industry multiple adjusted by readiness (plan 7.3).

import { SDE_MULTIPLES, VALUE_RANGE_SPREAD } from "@/lib/config/assumptions";
import type { Snapshot, ValuationResult } from "./types";

export function computeValuation(snapshot: Snapshot, readinessScore: number): ValuationResult {
  const { low, high } = SDE_MULTIPLES[snapshot.industry];
  const multiple = low + (high - low) * (readinessScore / 100);
  const midpoint = snapshot.sde * multiple;
  return {
    multiple,
    low: midpoint * (1 - VALUE_RANGE_SPREAD),
    midpoint,
    high: midpoint * (1 + VALUE_RANGE_SPREAD),
  };
}
