import { describe, expect, it } from "vitest";
import { FRANK, FRANK_EOT_ANSWERS } from "@/lib/demo/frank";
import { runEngine } from "@/lib/engine";
import { pickBestMatch } from "@/lib/engine/options";
import type { ExitOption, OptionId, Snapshot } from "@/lib/engine/types";

const option = (s: Snapshot, id: OptionId, answers = FRANK_EOT_ANSWERS) =>
  runEngine(s, answers).options.find((o) => o.id === id) as ExitOption;

describe("exit options", () => {
  it("lists the five options in plan order", () => {
    expect(runEngine(FRANK, FRANK_EOT_ANSWERS).options.map((o) => o.id)).toEqual([
      "family",
      "canadian",
      "pe",
      "eot",
      "winddown",
    ]);
  });

  it("hides private equity numbers unless SDE >= $1M and readiness >= 60", () => {
    const shown = option(FRANK, "pe");
    expect(shown.status).toBe("available");
    expect(shown.price).toBeGreaterThan(0);

    const smallSde = option({ ...FRANK, sde: 999_999 }, "pe");
    expect(smallSde.status).toBe("unavailable");
    expect(smallSde.statusNote).toBe("Unlikely to attract interest");
    expect(smallSde.price).toBeUndefined();
    expect(smallSde.afterTax).toBeUndefined();

    // Frank at 66 → drop processes (−5) and customer spread (−5) → 56.
    const lowReadiness = option({ ...FRANK, processes: "few", topCustomerShare: "gt50" }, "pe");
    expect(lowReadiness.status).toBe("unavailable");
    expect(lowReadiness.tax).toBeUndefined();
  });

  it("greys out family when familyInterest is 'no'", () => {
    const none = option(FRANK, "family");
    expect(none.status).toBe("unavailable");
    expect(none.statusNote).toBe("No family successor identified");
    expect(none.price).toBeUndefined();

    const maybe = option({ ...FRANK, familyInterest: "maybe" }, "family");
    expect(maybe.status).toBe("available");
    expect(maybe.price).toBeCloseTo(runEngine(FRANK, FRANK_EOT_ANSWERS).valuation.midpoint * 0.85, 6);
  });

  it("drops the EOT exemption and warns when the owner is likely not eligible", () => {
    const eot = option(FRANK, "eot", { ...FRANK_EOT_ANSWERS, giveUpControl: "no" });
    const canadian = option(FRANK, "canadian");
    expect(eot.status).toBe("warning");
    expect(eot.statusNote).toBeTruthy();
    // No exemption at all → more tax than the Canadian buyer, who keeps the LCGE.
    expect(eot.tax).toBeGreaterThan(canadian.tax as number);
  });

  it("keeps the EOT exemption when the check needs review", () => {
    const eot = option(FRANK, "eot", { ...FRANK_EOT_ANSWERS, activeAssets: "unsure" });
    expect(eot.status).toBe("available");
    expect(eot.tax).toBe(0);
  });

  it("never picks wind-down as best match unless it is the only option", () => {
    // Priorities favouring speed would otherwise reward wind-down.
    const speedy: Snapshot = { ...FRANK, priorities: ["speed", "price", "local", "employees"] };
    expect(runEngine(speedy, FRANK_EOT_ANSWERS).bestMatch).not.toBe("winddown");

    const onlyWindDown = runEngine(FRANK, FRANK_EOT_ANSWERS).options.map((o) =>
      o.id === "winddown" ? o : { ...o, status: "unavailable" as const },
    );
    expect(pickBestMatch(speedy, onlyWindDown)).toBe("winddown");
  });

  it("follows the owner's top priority", () => {
    const priceFirst: Snapshot = { ...FRANK, priorities: ["price", "speed", "local", "employees"] };
    // EOT pays the most after tax for Frank.
    expect(runEngine(priceFirst, FRANK_EOT_ANSWERS).bestMatch).toBe("eot");

    // Not eligible for EOT → PE pays the most after tax.
    const notEligible = { ...FRANK_EOT_ANSWERS, giveUpControl: "no" } as const;
    expect(runEngine(priceFirst, notEligible).bestMatch).toBe("pe");
  });
});
