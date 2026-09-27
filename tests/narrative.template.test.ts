import { describe, expect, it } from "vitest";
import { FRANK, FRANK_EOT_ANSWERS } from "@/lib/demo/frank";
import { runEngine } from "@/lib/engine";
import type { EotAnswers, OptionId, Snapshot } from "@/lib/engine/types";
import { planSummary } from "@/lib/narrative/template";

const OPTIONS: OptionId[] = ["family", "canadian", "pe", "eot", "winddown"];

const summary = (option: OptionId, snapshot: Snapshot = FRANK, answers: EotAnswers = FRANK_EOT_ANSWERS) =>
  planSummary(option, snapshot, runEngine(snapshot, answers));

const words = (s: string) => s.split(/\s+/).filter(Boolean).length;

describe("plan summary template", () => {
  it.each(OPTIONS)("writes a clean, plain-language summary for Frank: %s", (option) => {
    const text = summary(option);
    expect(text.length).toBeGreaterThan(0);
    expect(text).not.toMatch(/undefined|NaN|null/);
    expect(text).toContain("Mancini Precision Machining");
    // Only rounded money: no raw amounts like $3885901 or $4,849,200.
    expect(text).not.toMatch(/\$\d{4,}|\$\d{1,3},\d{3}/);
    expect(words(text)).toBeGreaterThanOrEqual(50);
    expect(words(text)).toBeLessThanOrEqual(120);
  });

  it("EOT: rounded after-tax, the gain over an outside buyer, and employees becoming owners", () => {
    const text = summary("eot");
    expect(text).toContain("$4.85M");
    expect(text).toContain("$960K more than selling to an outside buyer");
    expect(text).toContain("22 employees");
    expect(text).toMatch(/become owners/);
    expect(text).toContain("66 out of 100");
    expect(text).toContain("reduce how much you depend on your biggest customer (+10 points)");
    expect(text).toContain("3–4 years");
  });

  it("EOT warning: says they may not qualify and points to an advisor", () => {
    const text = summary("eot", FRANK, { ...FRANK_EOT_ANSWERS, giveUpControl: "no" });
    expect(text).toMatch(/may not qualify/);
    expect(text).toMatch(/advisor/);
    expect(text).not.toMatch(/more than selling to an outside buyer/);
  });

  it("Canadian buyer and private equity quote rounded after-tax figures", () => {
    expect(summary("canadian")).toContain("$3.89M");
    const pe = summary("pe");
    expect(pe).toContain("$5.33M");
    expect(pe).toContain("$4.24M");
    expect(pe).toMatch(/jobs of your 22 employees could be at risk/);
  });

  it("family unavailable: says no family member is interested and what the plan shows", () => {
    const text = summary("family");
    expect(text).toMatch(/no family member is interested/);
    expect(text).toMatch(/if that changes/);
    expect(text).not.toMatch(/\$\d/);
  });

  it("family available: quotes an after-tax estimate", () => {
    const text = summary("family", { ...FRANK, familyInterest: "yes" });
    expect(text).toMatch(/Passing Mancini Precision Machining to a family member could leave you with about \$\d/);
    expect(text).not.toMatch(/is tight/);
  });

  it("family available on a short runway: flags that a year or less is tight", () => {
    const text = summary("family", { ...FRANK, familyInterest: "yes", yearsToExit: 0 });
    expect(text).toMatch(/usually take 2–5 years, so stepping away in under a year is tight/);
    expect(text).not.toMatch(/the timeline is short/);
    expect(words(text)).toBeLessThanOrEqual(120);
  });

  it("private equity unavailable: explains what buyers look for and what would change it", () => {
    const text = summary("pe", { ...FRANK, sde: 600_000 });
    expect(text).toMatch(/usually look for larger businesses/);
    expect(text).toContain("$1M");
    expect(text).not.toMatch(/undefined|NaN/);
  });

  it("wind-down: honest about jobs and nudges to check a sale first", () => {
    const text = summary("winddown");
    expect(text).toContain("$400K");
    expect(text).toContain("All 22 jobs would be lost");
    expect(text).toMatch(/before you close/);
  });

  it("falls back to 'your business' without a business name", () => {
    const text = summary("eot", { ...FRANK, businessName: undefined });
    expect(text).toContain("your business");
    expect(text).not.toContain("Mancini");
    expect(summary("canadian", { ...FRANK, businessName: "   " })).toContain("Selling your business");
  });

  it("describes the runway for each timeline answer", () => {
    expect(summary("eot", { ...FRANK, yearsToExit: 0 })).toContain("under a year");
    expect(summary("eot", { ...FRANK, yearsToExit: 5 })).toContain("5 or more years");
  });
});
