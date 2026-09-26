import { describe, expect, it } from "vitest";
import { TOP_RATE } from "@/lib/config/assumptions";
import { FRANK, FRANK_EOT_ANSWERS } from "@/lib/demo/frank";
import { runEngine } from "@/lib/engine";
import type { ExitOption, OptionId } from "@/lib/engine/types";

// Demo persona snapshot test (plan 7.8 / section 8): money must match within $1,000.
const WITHIN = 1_000;
const near = (actual: number | undefined, expected: number) => {
  expect(actual).toBeDefined();
  expect(Math.abs((actual as number) - expected)).toBeLessThanOrEqual(WITHIN);
};

describe("Frank (demo persona)", () => {
  const results = runEngine(FRANK, FRANK_EOT_ANSWERS);
  const opt = (id: OptionId) => results.options.find((o) => o.id === id) as ExitOption;

  it("assumes the verified Ontario top rate the expected values were built on", () => {
    expect(TOP_RATE.ON).toBe(0.5353);
  });

  it("scores 66 — Getting there", () => {
    expect(results.readiness.score).toBe(66);
    expect(results.readiness.band).toBe("getting-there");
    expect(results.readiness.bandLabel).toBe("Getting there");
    expect(results.readiness.factors.map((f) => f.points)).toEqual([20, 12, 9, 5, 5, 15]);
  });

  it("gets the top 3 fixes by gap (management +6 beats processes +5)", () => {
    expect(results.readiness.topFixes.map((f) => [f.factor, f.gain])).toEqual([
      ["customerConcentration", 10],
      ["ownerDependence", 8],
      ["management", 6],
    ]);
  });

  it("values the business at a ≈$4.85M midpoint", () => {
    expect(results.valuation.multiple).toBeCloseTo(3.592, 10);
    near(results.valuation.midpoint, 4_849_200);
    near(results.valuation.low, 4_121_820);
    near(results.valuation.high, 5_576_580);
  });

  it("shows EOT after-tax ≈$4.85M vs Canadian buyer ≈$3.89M", () => {
    near(opt("canadian").price, 4_849_200);
    near(opt("canadian").tax, 963_299);
    near(opt("canadian").afterTax, 3_885_901);

    near(opt("eot").price, 4_849_200);
    expect(opt("eot").tax).toBe(0);
    near(opt("eot").afterTax, 4_849_200);
    near((opt("eot").afterTax as number) - (opt("canadian").afterTax as number), 963_299);
  });

  it("prices private equity ≈$5.33M with ≈$4.24M after tax", () => {
    expect(opt("pe").status).toBe("available");
    near(opt("pe").price, 5_334_120);
    near(opt("pe").tax, 1_093_088);
    near(opt("pe").afterTax, 4_241_032);
  });

  it("greys out family and prices wind-down at ≈$540K", () => {
    expect(opt("family").status).toBe("unavailable");
    near(opt("winddown").price, 540_000);
  });

  it("marks the EOT check likely eligible and picks EOT as the best match", () => {
    expect(results.eot.status).toBe("likely");
    expect(results.bestMatch).toBe("eot");
  });
});
