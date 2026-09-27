import { Briefcase, Calculator, Landmark, Lightbulb, Scale } from "lucide-react";
import type { OptionId } from "@/lib/engine/types";

/** The four core advisors (plan 6.4), with what each does for this particular exit. */
const ADVISORS: { icon: typeof Calculator; title: string; body: Record<OptionId, string> }[] = [
  {
    icon: Calculator,
    title: "Chartered Professional Accountant (CPA)",
    body: {
      family: "Plans the tax side of a family transfer, including your estate plan and how you're paid over time.",
      canadian: "Plans the tax side of your sale, including the lifetime capital gains exemption, and gets your statements ready for buyers.",
      pe: "Plans the tax side of your sale and prepares your financials for the buyer's detailed review.",
      eot: "Plans the tax side of your sale, including the EOT exemption, and gets your statements ready for the trust and its lenders.",
      winddown: "Plans the tax on selling your assets and closing the company, and files the final returns.",
    },
  },
  {
    icon: Scale,
    title: "Business lawyer",
    body: {
      family: "Drafts the transfer agreement and protects you if your family pays you over time.",
      canadian: "Drafts the sale agreement and protects the part of the price the buyer pays you over time (vendor financing).",
      pe: "Negotiates the sale agreement, including any part of the price tied to future results and promises about your staff.",
      eot: "Sets up the trust, drafts the sale agreement and protects you while you're paid over time.",
      winddown: "Handles the legal steps to close the company, including leases, contracts and what you owe your staff under employment standards (notice and severance).",
    },
  },
  {
    icon: Briefcase,
    title: "Chartered Business Valuator (CBV)",
    body: {
      family: "Gives a formal, independent value so the price is fair to everyone in the family.",
      canadian: "Gives you a formal, independent value so you know what a fair asking price is.",
      pe: "Gives you an independent value so you can judge the offers you receive.",
      eot: "Gives the formal valuation an EOT sale needs: the price must be fair market value.",
      winddown: "Can tell you what the business is worth as a going concern, which is often more than its assets sell for.",
    },
  },
  {
    icon: Landmark,
    title: "BDC (Business Development Bank of Canada)",
    body: {
      family: "Offers transition advice and can help finance a family member who is buying the business.",
      canadian: "Offers transition advice and can help finance the buyer.",
      pe: "Offers transition advice to help you get the business ready before you go to market.",
      eot: "Offers transition advice and can help finance an employee buyout.",
      winddown: "Offers guides and advice on business transitions, including your options before you decide to close.",
    },
  },
];

/** One extra pointer per option: the specialist or conversation that matters most for this exit. */
const CALLOUTS: Record<OptionId, { lead: string; text: string }> = {
  family: {
    lead: "Passing it to family:",
    text: "Look for a CPA who has done family (intergenerational) transfers and estate planning. Include the whole family in the conversation, including children who won't be taking over.",
  },
  canadian: {
    lead: "Finding a buyer:",
    text: "A business broker or M&A (mergers and acquisitions) advisor can find and screen buyers and keep the sale quiet until it's ready. If part of the price is paid over time, ask your lawyer how to protect it.",
  },
  pe: {
    lead: "Selling to a larger buyer:",
    text: "An M&A advisor or investment banker can bring several buyers to the table. Ask about earn-outs (part of the price paid later, only if the business hits targets) and what protections your employees will have.",
  },
  eot: {
    lead: "Selling to employees:",
    text: "Employee Ownership Trusts are new in Canada. Ask each advisor whether they have done an EOT sale before. Groups that promote employee ownership, such as Social Capital Partners, also share resources for owners.",
  },
  winddown: {
    lead: "Before you close:",
    text: "A business broker or your accountant can tell you whether someone would buy the business. Even a modest sale can leave you more than closing, and it keeps jobs.",
  },
};

export function AdvisorCards({ option }: { option: OptionId }) {
  const callout = CALLOUTS[option];
  return (
    <div className="space-y-5 print:space-y-2">
      <ul className="grid gap-5 sm:grid-cols-2 print:gap-2">
        {ADVISORS.map((a) => (
          <li
            key={a.title}
            className="print-break-avoid flex gap-4 rounded-2xl border bg-card p-6 shadow-sm print:rounded-none print:border-0 print:p-0 print:shadow-none"
          >
            <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-secondary text-secondary-foreground print:hidden">
              <a.icon className="size-6" aria-hidden />
            </span>
            <div className="space-y-1.5 print:space-y-0">
              <h3 className="font-heading text-xl leading-snug font-semibold print:text-base">{a.title}</h3>
              <p className="text-base leading-relaxed text-muted-foreground print:text-sm print:leading-snug">{a.body[option]}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="print-break-avoid flex gap-4 rounded-2xl border border-primary/25 bg-secondary p-6 text-secondary-foreground print:rounded-none print:border-0 print:border-l-4 print:bg-transparent print:py-1 print:pl-3">
        <Lightbulb className="mt-0.5 size-6 shrink-0 text-primary print:hidden" aria-hidden />
        <p className="text-base leading-relaxed print:text-sm print:leading-snug">
          <strong className="font-semibold">{callout.lead}</strong> {callout.text}
        </p>
      </div>
    </div>
  );
}
