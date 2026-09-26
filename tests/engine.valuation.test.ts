import { describe, expect, it } from "vitest";
import { FRANK } from "@/lib/demo/frank";
import { computeValuation } from "@/lib/engine/valuation";

// Manufacturing: 2.8× – 4.0×.
describe("valuation", () => {
  it("interpolates the multiple at score 0, 50 and 100", () => {
    expect(computeValuation(FRANK, 0).multiple).toBeCloseTo(2.8, 10);
    expect(computeValuation(FRANK, 50).multiple).toBeCloseTo(3.4, 10);
    expect(computeValuation(FRANK, 100).multiple).toBeCloseTo(4.0, 10);
  });

  it("returns a ±15% range around the midpoint", () => {
    const v = computeValuation({ ...FRANK, sde: 1_000_000 }, 50);
    expect(v.midpoint).toBeCloseTo(3_400_000, 4);
    expect(v.low).toBeCloseTo(3_400_000 * 0.85, 4);
    expect(v.high).toBeCloseTo(3_400_000 * 1.15, 4);
  });

  it("uses the industry's own range", () => {
    expect(computeValuation({ ...FRANK, industry: "food" }, 0).multiple).toBeCloseTo(1.5, 10);
    expect(computeValuation({ ...FRANK, industry: "food" }, 100).multiple).toBeCloseTo(2.5, 10);
  });
});
