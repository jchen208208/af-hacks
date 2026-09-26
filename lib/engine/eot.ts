// EOT eligibility check (plan 7.7).

import type { EotAnswers, EotQuestionId, EotResult, EotStatus } from "./types";

export const EOT_QUESTIONS: { id: EotQuestionId; text: string }[] = [
  { id: "ownedTwoYears", text: "Have you (or a related person) owned the shares for at least 24 months?" },
  { id: "activeTwoYears", text: "Have you been actively involved in the business regularly for at least 24 months?" },
  { id: "activeAssets", text: "Is more than half the company's value in assets used in the active business (not investments or rental property)?" },
  { id: "canadianBeneficiaries", text: "Will at least 75% of the employees who benefit be Canadian residents?" },
  { id: "giveUpControl", text: "Are you willing to give up control of the company to the trust?" },
  { id: "familyExcluded", text: "Will you and your family stay out of the trust as beneficiaries?" },
];

export const EOT_LABELS: Record<EotStatus, string> = {
  likely: "Likely eligible",
  review: "Needs review",
  unlikely: "Likely not eligible",
};

/** All yes → likely; any "no" → unlikely; otherwise (any unsure or unanswered) → review. */
export function checkEot(answers: EotAnswers): EotResult {
  const all = EOT_QUESTIONS.map((q) => answers[q.id] ?? "unsure");
  const status: EotStatus = all.includes("no") ? "unlikely" : all.every((a) => a === "yes") ? "likely" : "review";
  return { status, label: EOT_LABELS[status] };
}
