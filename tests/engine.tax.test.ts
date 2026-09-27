import { describe, expect, it } from "vitest";
import { EOT_EXEMPTION, LCGE, TOP_RATE } from "@/lib/config/assumptions";
import { checkEot } from "@/lib/engine/eot";
import { computeTax } from "@/lib/engine/tax";

const base = { sharesCostBase: 100, province: "ON" as const };

describe("tax", () => {
  it("is $0 when the gain is below the exemption", () => {
    const r = computeTax({ ...base, price: 1_000_000, exemption: LCGE });
    expect(r.tax).toBe(0);
    expect(r.afterTax).toBe(1_000_000);
  });

  it("is $0 when the price is below the cost base", () => {
    const r = computeTax({ ...base, sharesCostBase: 500_000, price: 400_000, exemption: 0 });
    expect(r.gain).toBe(0);
    expect(r.tax).toBe(0);
  });

  it("caps the EOT exemption at $10M", () => {
    const price = 12_000_100; // gain = 12,000,000
    const r = computeTax({ ...base, price, exemption: EOT_EXEMPTION });
    expect(r.taxable).toBeCloseTo(2_000_000 * 0.5, 6);
    expect(r.tax).toBeCloseTo(1_000_000 * TOP_RATE.ON, 6);
  });

  it("caps the LCGE at $1.275M", () => {
    const price = 2_275_100; // gain = 2,275,000
    const r = computeTax({ ...base, price, exemption: LCGE });
    expect(r.taxable).toBeCloseTo(1_000_000 * 0.5, 6);
    expect(r.tax).toBeCloseTo(500_000 * TOP_RATE.ON, 6);
    expect(r.afterTax).toBeCloseTo(price - 500_000 * TOP_RATE.ON, 6);
  });

  it("uses the province's top rate", () => {
    const on = computeTax({ ...base, price: 3_000_100, exemption: 0 });
    const ab = computeTax({ ...base, province: "AB", price: 3_000_100, exemption: 0 });
    expect(on.tax).toBeCloseTo(1_500_000 * TOP_RATE.ON, 6);
    expect(ab.tax).toBeCloseTo(1_500_000 * TOP_RATE.AB, 6);
  });
});

describe("EOT eligibility", () => {
  const allYes = {
    ownedTwoYears: "yes",
    activeTwoYears: "yes",
    activeAssets: "yes",
    canadianBeneficiaries: "yes",
    giveUpControl: "yes",
    familyExcluded: "yes",
  } as const;

  it("is likely eligible when every answer is yes", () => {
    expect(checkEot(allYes)).toEqual({ status: "likely", label: "Likely eligible" });
  });

  it("needs review when any answer is not sure and none is no", () => {
    expect(checkEot({ ...allYes, activeAssets: "unsure" }).status).toBe("review");
  });

  it("treats unanswered questions as not sure", () => {
    expect(checkEot({}).status).toBe("review");
    expect(checkEot({ ownedTwoYears: "yes" }).label).toBe("Needs review");
  });

  it("is likely not eligible when any answer is no", () => {
    expect(checkEot({ ...allYes, giveUpControl: "no", activeAssets: "unsure" }).status).toBe("unlikely");
  });
});
