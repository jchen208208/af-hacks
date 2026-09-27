import { describe, expect, it } from "vitest";
import { FRANK, FRANK_EOT_ANSWERS } from "@/lib/demo/frank";
import { runEngine } from "@/lib/engine";
import { applyWhatIf, BEST_ANSWERS, fixAnswers } from "@/lib/engine/whatif";

describe("what-if scenarios", () => {
  const today = runEngine(FRANK, FRANK_EOT_ANSWERS);

  it("changes nothing with no answers", () => {
    expect(runEngine(applyWhatIf(FRANK, {}), FRANK_EOT_ANSWERS)).toEqual(today);
  });

  it("maps Frank's top 3 fixes to full-marks answers", () => {
    expect(fixAnswers(today.readiness.topFixes.map((f) => f.factor))).toEqual({
      topCustomerShare: "lt10",
      runWithoutOwner: "yes",
      managers: 2,
    });
  });

  it("ignores runway, which isn't a fix", () => {
    expect(fixAnswers(["runway"])).toEqual({});
  });

  it("raises Frank to 90 and a ≈$5.24M midpoint when he does his top 3 fixes", () => {
    const fixed = runEngine(applyWhatIf(FRANK, fixAnswers(today.readiness.topFixes.map((f) => f.factor))), FRANK_EOT_ANSWERS);
    expect(fixed.readiness.score).toBe(90);
    expect(fixed.readiness.band).toBe("ready");
    expect(fixed.valuation.multiple).toBeCloseTo(3.88, 10);
    expect(Math.abs(fixed.valuation.midpoint - 5_238_000)).toBeLessThanOrEqual(1_000);
    // The EOT stays the best match and stays tax-free, so the owner keeps the whole gain.
    expect(fixed.bestMatch).toBe("eot");
    expect(fixed.options[0].afterTax).toBeCloseTo(fixed.valuation.midpoint, 0);
  });

  it("scores 100 with every answer at its best and the longest runway", () => {
    const best = runEngine(applyWhatIf({ ...FRANK, yearsToExit: 5 }, BEST_ANSWERS), FRANK_EOT_ANSWERS);
    expect(best.readiness.score).toBe(100);
    expect(best.readiness.topFixes).toEqual([]);
  });
});
