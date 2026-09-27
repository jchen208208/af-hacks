import { describe, expect, it } from "vitest";
import { FRANK } from "@/lib/demo/frank";
import { DEFAULT_PRIORITIES, DEFAULT_SHARES_COST_BASE, checkStep, firstIncompleteStep } from "@/lib/snapshot/questions";

// What a new owner starts with (see SnapshotContext INITIAL).
const EMPTY = { sharesCostBase: DEFAULT_SHARES_COST_BASE, priorities: DEFAULT_PRIORITIES };

describe("snapshot step checks", () => {
  it("lists unanswered required questions as missing, not as errors", () => {
    const check = checkStep(0, EMPTY);
    expect(check.valid).toBe(false);
    expect(check.missing.sort()).toEqual(["employees", "industry", "province", "revenue", "yearFounded"]);
    expect(check.errors).toEqual({});
  });

  it("does not require the business name", () => {
    const { businessName, ...rest } = FRANK;
    void businessName;
    expect(checkStep(0, rest).valid).toBe(true);
  });

  it("reports answered-but-invalid values as errors", () => {
    const check = checkStep(0, { ...FRANK, yearFounded: 3000, employees: -1 });
    expect(check.valid).toBe(false);
    expect(check.missing).toEqual([]);
    expect(check.errors.yearFounded).toBe("That year is in the future");
    expect(check.errors.employees).toBe("Can't be negative");
  });

  it("counts the defaults on steps 2 and 4 as answered", () => {
    expect(checkStep(1, EMPTY).missing).not.toContain("sharesCostBase");
    expect(checkStep(3, EMPTY).missing).not.toContain("priorities");
  });

  it("finds the first step with required questions left", () => {
    expect(firstIncompleteStep(EMPTY)).toBe(0);
    expect(firstIncompleteStep(FRANK)).toBe(4);
    expect(firstIncompleteStep({ ...FRANK, records: undefined })).toBe(2);
    // An earlier gap wins even when later steps are complete.
    expect(firstIncompleteStep({ ...FRANK, province: undefined, ownerAge: undefined })).toBe(0);
  });
});
