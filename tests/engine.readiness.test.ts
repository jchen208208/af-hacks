import { describe, expect, it } from "vitest";
import { FRANK } from "@/lib/demo/frank";
import { computeReadiness, readinessBand } from "@/lib/engine/readiness";
import type { ReadinessFactor, Snapshot } from "@/lib/engine/types";

const points = (s: Snapshot, factor: ReadinessFactor) =>
  computeReadiness(s).factors.find((f) => f.factor === factor)?.points;

const BEST: Snapshot = {
  ...FRANK,
  records: "audited",
  runWithoutOwner: "yes",
  managers: 2,
  topCustomerShare: "lt10",
  processes: "most",
  yearsToExit: 5,
};

describe("readiness", () => {
  it("maps each factor answer to the right points", () => {
    expect(points({ ...FRANK, records: "audited" }, "records")).toBe(20);
    expect(points({ ...FRANK, records: "review" }, "records")).toBe(14);
    expect(points({ ...FRANK, records: "bookkeeping" }, "records")).toBe(7);
    expect(points({ ...FRANK, records: "messy" }, "records")).toBe(0);

    expect(points({ ...FRANK, runWithoutOwner: "yes" }, "ownerDependence")).toBe(20);
    expect(points({ ...FRANK, runWithoutOwner: "mostly" }, "ownerDependence")).toBe(12);
    expect(points({ ...FRANK, runWithoutOwner: "no" }, "ownerDependence")).toBe(0);

    expect(points({ ...FRANK, managers: 2 }, "management")).toBe(15);
    expect(points({ ...FRANK, managers: 1 }, "management")).toBe(9);
    expect(points({ ...FRANK, managers: 0 }, "management")).toBe(0);

    expect(points({ ...FRANK, topCustomerShare: "lt10" }, "customerConcentration")).toBe(15);
    expect(points({ ...FRANK, topCustomerShare: "10to25" }, "customerConcentration")).toBe(10);
    expect(points({ ...FRANK, topCustomerShare: "25to50" }, "customerConcentration")).toBe(5);
    expect(points({ ...FRANK, topCustomerShare: "gt50" }, "customerConcentration")).toBe(0);

    expect(points({ ...FRANK, processes: "most" }, "processes")).toBe(10);
    expect(points({ ...FRANK, processes: "some" }, "processes")).toBe(5);
    expect(points({ ...FRANK, processes: "few" }, "processes")).toBe(0);

    expect(points({ ...FRANK, yearsToExit: 5 }, "runway")).toBe(20);
    expect(points({ ...FRANK, yearsToExit: 3 }, "runway")).toBe(15);
    expect(points({ ...FRANK, yearsToExit: 2 }, "runway")).toBe(10);
    expect(points({ ...FRANK, yearsToExit: 1 }, "runway")).toBe(5);
    expect(points({ ...FRANK, yearsToExit: 0 }, "runway")).toBe(0);
  });

  it("never exceeds 100", () => {
    const r = computeReadiness(BEST);
    expect(r.score).toBe(100);
    expect(r.band).toBe("ready");
    expect(r.topFixes).toEqual([]);
  });

  it("bands correctly at 39, 40, 69 and 70", () => {
    expect(readinessBand(0).band).toBe("not-ready");
    expect(readinessBand(39).band).toBe("not-ready");
    expect(readinessBand(40).band).toBe("getting-there");
    expect(readinessBand(69).band).toBe("getting-there");
    expect(readinessBand(70).band).toBe("ready");
    expect(readinessBand(100).label).toBe("Ready");
  });

  it("returns the top 3 fixes by gap and skips time runway", () => {
    // Runway has the largest gap (20) but must never be a fix.
    const r = computeReadiness({ ...BEST, yearsToExit: 0, records: "messy", processes: "few" });
    expect(r.topFixes.map((f) => [f.factor, f.gain])).toEqual([
      ["records", 20],
      ["processes", 10],
    ]);
    expect(r.runwayNote).toMatch(/Starting earlier gives you more options\.$/);
  });

  it("breaks gap ties by factor order", () => {
    // records gap 20, ownerDependence gap 20 → records first.
    const r = computeReadiness({ ...BEST, records: "messy", runWithoutOwner: "no" });
    expect(r.topFixes.map((f) => f.factor)).toEqual(["records", "ownerDependence"]);
  });
});
