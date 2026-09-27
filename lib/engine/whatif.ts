// What-if scenarios (plan §10, Phase 6b): change the readiness answers and re-run the engine.

import type { ReadinessFactor, Snapshot } from "./types";

/** The fixable readiness factors and the snapshot answer each one reads. Runway is left out: it isn't a fix. */
export const WHATIF_FIELDS = {
  records: "records",
  ownerDependence: "runWithoutOwner",
  management: "managers",
  customerConcentration: "topCustomerShare",
  processes: "processes",
} as const satisfies Partial<Record<ReadinessFactor, keyof Snapshot>>;

export type WhatIfFactor = keyof typeof WHATIF_FIELDS;
export type WhatIfField = (typeof WHATIF_FIELDS)[WhatIfFactor];
export type WhatIfAnswers = Partial<Pick<Snapshot, WhatIfField>>;

/** The full-marks answer for each factor. */
export const BEST_ANSWERS: Required<WhatIfAnswers> = {
  records: "audited",
  runWithoutOwner: "yes",
  managers: 2,
  topCustomerShare: "lt10",
  processes: "most",
};

/** Answers that give full marks on the given factors (e.g. the owner's top fixes). */
export function fixAnswers(factors: ReadinessFactor[]): WhatIfAnswers {
  const answers: WhatIfAnswers = {};
  for (const factor of factors) {
    if (!(factor in WHATIF_FIELDS)) continue;
    const field = WHATIF_FIELDS[factor as WhatIfFactor];
    Object.assign(answers, { [field]: BEST_ANSWERS[field] });
  }
  return answers;
}

/** The snapshot with the what-if answers swapped in. */
export function applyWhatIf(snapshot: Snapshot, answers: WhatIfAnswers): Snapshot {
  return { ...snapshot, ...answers };
}
