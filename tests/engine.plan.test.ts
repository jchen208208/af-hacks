import { describe, expect, it } from "vitest";
import { FRANK, FRANK_EOT_ANSWERS } from "@/lib/demo/frank";
import { runPlan } from "@/lib/engine";
import { WINDDOWN_CHECK_ID, whenSortKey } from "@/lib/engine/plan";
import type { OptionId, PlanStep, Snapshot } from "@/lib/engine/types";

const OPTIONS: OptionId[] = ["eot", "family", "canadian", "pe", "winddown"];
const SALES: OptionId[] = ["eot", "family", "canadian", "pe"];
const YEARS: Snapshot["yearsToExit"][] = [0, 1, 2, 3, 5];

const BEST: Snapshot = {
  ...FRANK,
  records: "audited",
  runWithoutOwner: "yes",
  managers: 2,
  topCustomerShare: "lt10",
  processes: "most",
  yearsToExit: 5,
};

// A weak snapshot with a full set of three fixes, including records.
const WEAK: Snapshot = { ...FRANK, records: "messy", runWithoutOwner: "no", managers: 0, processes: "few" };

const SNAPSHOTS: Snapshot[] = [FRANK, BEST, WEAK];

const fixSteps = (steps: PlanStep[]) => steps.filter((s) => s.id.startsWith("fix-"));
const templateSteps = (steps: PlanStep[]) => steps.filter((s) => !s.id.startsWith("fix-"));
const text = (steps: PlanStep[]) => steps.map((s) => `${s.title} ${s.detail ?? ""}`).join(" ");

describe("transition plan", () => {
  it("gives sale options their top fixes plus 6–8 template steps", () => {
    for (const snapshot of SNAPSHOTS) {
      for (const option of SALES) {
        const steps = runPlan(option, snapshot);
        expect(templateSteps(steps).length).toBeGreaterThanOrEqual(6);
        expect(templateSteps(steps).length).toBeLessThanOrEqual(8);
      }
    }
  });

  it("gives wind-down a short plan with no fixes that checks for a buyer before anything irreversible", () => {
    for (const snapshot of SNAPSHOTS) {
      const steps = runPlan("winddown", snapshot);
      expect(steps.length).toBeGreaterThanOrEqual(4);
      expect(steps.length).toBeLessThanOrEqual(6);
      expect(fixSteps(steps)).toEqual([]);
      // Right after the first advisor talk: before notice, asset sales and dissolution.
      const check = steps[1];
      expect(check.id).toBe(WINDDOWN_CHECK_ID);
      expect(check.title).toMatch(/^Before you close.*employee or local buyer/);
      expect(check.detail).toMatch(/worth far more sold than closed/);
      expect(steps[steps.length - 1].id).toBe("winddown-dissolve");
    }
  });

  it("rewords the EOT plan when the owner is likely not eligible", () => {
    const eligible = runPlan("eot", FRANK, FRANK_EOT_ANSWERS);
    const notEligible = runPlan("eot", FRANK, { ...FRANK_EOT_ANSWERS, giveUpControl: "no" });
    expect(notEligible.map((s) => s.id)).toEqual(eligible.map((s) => s.id));
    const advisors = notEligible.find((s) => s.id === "eot-advisors");
    expect(advisors?.title).toMatch(/whether you qualify/);
    expect(notEligible.find((s) => s.id === "eot-close")?.detail).toMatch(/If you qualify/);
    expect(text(eligible)).toMatch(/claim the exemption on your tax return/);
    // Other options don't depend on the EOT answers.
    expect(runPlan("canadian", FRANK, { giveUpControl: "no" })).toEqual(runPlan("canadian", FRANK));
  });

  it("starts sale plans with exactly Frank's top fixes, in order", () => {
    for (const option of SALES) {
      const steps = runPlan(option, FRANK);
      expect(steps.slice(0, 3).map((s) => s.id)).toEqual([
        "fix-customerConcentration",
        "fix-ownerDependence",
        "fix-management",
      ]);
      expect(fixSteps(steps)).toHaveLength(3);
      expect(steps[0].detail).toMatch(/\+10 points/);
      expect(steps[2].detail).toMatch(/\+6 points/);
    }
  });

  it("has no fix steps when there are no gaps, and is still a full plan", () => {
    for (const option of SALES) {
      const steps = runPlan(option, BEST);
      expect(fixSteps(steps)).toEqual([]);
      expect(steps.length).toBeGreaterThanOrEqual(6);
    }
  });

  it("drops a template step that a fix already covers", () => {
    // Records fix replaces the EOT "3 years of financials" step.
    const weak = runPlan("eot", { ...BEST, records: "messy" }).map((s) => s.id);
    expect(weak).toContain("fix-records");
    expect(weak).not.toContain("eot-financials");
    expect(runPlan("eot", BEST).map((s) => s.id)).toContain("eot-financials");

    // Management/owner-dependence fixes replace the PE "management team" step.
    expect(runPlan("pe", FRANK).map((s) => s.id)).not.toContain("pe-team");
    expect(runPlan("pe", BEST).map((s) => s.id)).toContain("pe-team");
  });

  it("uses unique ids in every plan, for every option and runway", () => {
    for (const snapshot of SNAPSHOTS) {
      for (const option of OPTIONS) {
        for (const yearsToExit of YEARS) {
          const ids = runPlan(option, { ...snapshot, yearsToExit }).map((s) => s.id);
          expect(new Set(ids).size).toBe(ids.length);
        }
      }
    }
  });

  it("keeps ids stable across runways", () => {
    for (const option of OPTIONS) {
      const short = runPlan(option, { ...FRANK, yearsToExit: 0 }).map((s) => s.id);
      const long = runPlan(option, { ...FRANK, yearsToExit: 5 }).map((s) => s.id);
      expect(short).toEqual(long);
    }
  });

  it("labels short runways in months and longer ones in years and quarters", () => {
    const preClose = (steps: PlanStep[]) => steps.filter((s) => !/closing$/.test(s.when));
    for (const option of OPTIONS) {
      for (const yearsToExit of [0, 1] as const) {
        for (const s of preClose(runPlan(option, { ...FRANK, yearsToExit }))) {
          expect(s.when).toMatch(/^Month \d+$/);
        }
      }
      for (const yearsToExit of [2, 3, 5] as const) {
        for (const s of preClose(runPlan(option, { ...FRANK, yearsToExit }))) {
          expect(s.when).toMatch(/^Year \d, Q[1-4]$/);
        }
      }
    }
  });

  it("puts the close at the end of the runway (year 3–4 for Frank)", () => {
    const close = (option: OptionId, snapshot: Snapshot) =>
      runPlan(option, snapshot).find((s) => s.id === `${option}-close`)?.when;
    for (const option of SALES) {
      expect(close(option, FRANK)).toMatch(/^Year [34], Q[1-4]$/);
      expect(close(option, { ...FRANK, yearsToExit: 0 })).toBe("Month 9");
      expect(close(option, { ...FRANK, yearsToExit: 1 })).toBe("Month 12");
      expect(close(option, { ...FRANK, yearsToExit: 2 })).toBe("Year 2, Q4");
      expect(close(option, { ...FRANK, yearsToExit: 5 })).toBe("Year 5, Q4");
    }
  });

  it("never goes backwards in time", () => {
    for (const snapshot of SNAPSHOTS) {
      for (const option of OPTIONS) {
        for (const yearsToExit of YEARS) {
          const keys = runPlan(option, { ...snapshot, yearsToExit }).map((s) => whenSortKey(s.when));
          keys.forEach((k) => expect(Number.isNaN(k)).toBe(false));
          expect(keys).toEqual([...keys].sort((a, b) => a - b));
        }
      }
    }
  });

  it("adds quick-win tips to fixes only when time is short", () => {
    expect(runPlan("eot", { ...FRANK, yearsToExit: 0 })[0].detail).toMatch(/Short on time\?/);
    expect(runPlan("eot", FRANK)[0].detail).not.toMatch(/Short on time\?/);
  });

  it("covers the key points of each option", () => {
    expect(text(runPlan("eot", FRANK))).toMatch(/24.month/);
    expect(text(runPlan("family", FRANK))).toMatch(/successor/i);
    expect(text(runPlan("pe", FRANK))).toMatch(/quality.of.earnings|M&A advisor/i);
    expect(text(runPlan("canadian", FRANK))).toMatch(/vendor financing/i);
  });

  it("keeps titles short and step text free of dollar figures (except the $10M EOT exemption)", () => {
    for (const snapshot of SNAPSHOTS) {
      for (const option of OPTIONS) {
        for (const s of runPlan(option, snapshot)) {
          expect(s.title.length).toBeLessThanOrEqual(70);
          expect(`${s.title} ${s.detail ?? ""}`.replace("$10M", "")).not.toMatch(/\$/);
        }
      }
    }
  });
});
