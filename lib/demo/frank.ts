// Demo persona (plan section 8): Frank Mancini, 66, Frank's Precision Machinery, Guelph ON.

import type { EotAnswers, Snapshot } from "@/lib/engine/types";

export const FRANK: Snapshot = {
  businessName: "Frank's Precision Machinery",
  industry: "manufacturing",
  province: "ON",
  yearFounded: 1991,
  employees: 22,
  revenue: 5_200_000,
  sde: 1_350_000,
  tangibleAssets: 900_000,
  sharesCostBase: 100,
  records: "audited",
  runWithoutOwner: "mostly",
  managers: 1,
  topCustomerShare: "25to50",
  processes: "some",
  ownerAge: 66,
  yearsToExit: 3,
  familyInterest: "no",
  priorities: ["employees", "local", "price", "speed"],
};

export const FRANK_EOT_ANSWERS: EotAnswers = {
  ownedTwoYears: "yes",
  activeTwoYears: "yes",
  activeAssets: "yes",
  canadianBeneficiaries: "yes",
  giveUpControl: "yes",
  familyExcluded: "yes",
};
