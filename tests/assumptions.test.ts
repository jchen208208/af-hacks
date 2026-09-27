import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AssumptionsList } from "@/components/layout/AssumptionsExpander";

const render = (snapshot: Parameters<typeof AssumptionsList>[0]["snapshot"]) =>
  renderToStaticMarkup(createElement(AssumptionsList, { snapshot }));

describe("AssumptionsList", () => {
  it("uses the owner's province and industry, not Ontario and manufacturing", () => {
    const html = render({ province: "BC", industry: "retail" });
    expect(html).toContain("British Columbia 53.50%");
    expect(html).toContain("Retail:");
    expect(html).not.toContain("Ontario");
    expect(html).not.toContain("Manufacturing");
  });

  it("shows Ontario for an Ontario owner", () => {
    expect(render({ province: "ON", industry: "manufacturing" })).toContain("Ontario 53.53%");
  });
});
