# Handover

Handover is a free website for Canadian small-business owners who are thinking about retiring or selling. An owner spends about 10 minutes describing their business and gets a readiness score, an estimated value range, a side-by-side comparison of the realistic ways to exit, and a step-by-step plan for the option they pick.

Live site: https://af-hacks-six.vercel.app

Built solo for AF Hacks: Growing Canada (Ascendance Foundry × Waterloo Venture Group).

## The problem

76% of Canadian small-business owners plan to exit within 10 years, and over $2 trillion in business assets will change hands ([CFIB, 2023](https://www.cfib-fcei.ca/en/media/over-2-trillion-in-business-assets-are-at-stake-as-majority-of-small-business-owners-plan-to-exit-their-business-over-the-next-decade)). Only 9% have a formal succession plan. Finding a buyer or successor is the top obstacle (54%), and 90% say protecting their employees matters in the exit.

Buyers are out there. BDC counts 10 would-be buyers for every 7 sellers ([BDC, January 2026](https://www.bdc.ca/en/about/mediaroom/news-releases/historic-300-billion-wave-of-business-acquisitions-set-to-reshape-canada-economy)). The bigger gap is readiness: no plan, messy books, a business that depends on the owner every day. Most owners have also never heard of an Employee Ownership Trust (EOT), which lets employees buy the company and exempts the first $10 million of the owner's capital gain from tax. That exemption was made permanent in April 2026 ([EY Tax Alert 2026 No. 28](https://www.ey.com/en_ca/technical/tax/tax-alerts/2026/tax-alert-2026-no-28)).

Good advice usually starts with thousands of dollars in accountant and lawyer fees, so many owners start late or never start. Handover is the free first step that gets them to those professionals prepared.

## What it does

The Business Snapshot is a four-step form with about 20 plain-language questions. Rough numbers are fine, and nothing leaves the browser: answers are saved in local storage only.

The results page shows:

- A readiness score from 0 to 100 across six factors, with the three changes that would raise it most and by how many points.
- A value range based on profit before the owner's pay, an industry multiple, and the readiness score.
- Five exit options compared side by side: a family successor, a Canadian buyer, private equity, an Employee Ownership Trust, and winding down. Each shows the price, estimated tax, money kept after tax, when the owner gets paid, what happens to employees, and whether the business stays Canadian-owned. The option that best fits the owner's stated priorities is ranked first.
- A chart of after-tax money by option.
- An EOT eligibility check with six yes/no questions and a short explanation of how an EOT works.

The transition plan is a timeline and checklist for the chosen option, fitted to how many years the owner has before they want out. It starts with the owner's biggest readiness fixes and lists who to call (CPA, business lawyer, business valuator, BDC). Checklist progress is saved in the browser.

Both the results and the plan print as clean reports, so an owner can bring them to their accountant.

To see everything without filling in the form, click "See an example" on the home page. It loads Frank Mancini, 66, who owns Mancini Precision Machining in Guelph, Ontario, with 22 employees. For Frank, an EOT leaves him about $960K more after tax than selling to an outside buyer, and all 22 jobs stay.

## How the numbers work

Every figure comes from the calculation engine in `lib/engine/`, a set of pure TypeScript functions with unit tests. Every rate and multiple lives in one file, `lib/config/assumptions.ts`, with a source next to it. The main ones:

- Capital gains inclusion rate of 50%.
- Lifetime Capital Gains Exemption of $1,275,000 for 2026 (CRA indexation page).
- EOT exemption of up to $10M of gain.
- Top combined personal tax rate for the owner's province, checked against KPMG's 2026 table and TaxTips.ca.
- Industry multiples anchored on BizBuySell's Q4 2025 average of 2.57× seller's discretionary earnings.

These are planning estimates, not tax, legal, financial or valuation advice. The site shows this disclaimer on every page with numbers and in every printout, and lists its assumptions at the bottom of the results and plan pages. The model leaves out alternative minimum tax, the capital-gains reserve, intergenerational transfer rules, corporate-level tax on asset sales, and multiple shareholders.

## Running it locally

You need Node.js 20.9 or later.

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

Other scripts:

```bash
npm test           # engine and component unit tests (Vitest)
npm run typecheck  # TypeScript
npm run lint       # ESLint
npm run build      # production build
```

No environment variables or API keys are needed.

## Stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, shadcn/ui, Recharts, zod for form validation, and Vitest. Deployed on Vercel.

## Project layout

```
app/                 pages: / (landing), /snapshot, /results, /plan
components/          UI, grouped by page (landing, snapshot, results, plan, report)
lib/engine/          readiness, valuation, tax, exit options, EOT check, plan builder
lib/config/          every number the engine uses, with sources
lib/demo/frank.ts    the example owner
lib/state/           snapshot state, saved to localStorage
tests/               unit tests
```

## What's next

The plan is to pilot with a chamber of commerce or small-business centre, running workshops where owners leave with a plan, and to partner with accounting firms and credit unions that already advise these owners. The site stays free for owners. Later versions could add a dashboard for advisors with many clients, a regional view for economic-development offices, and a French version.
