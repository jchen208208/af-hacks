import { Briefcase, Calculator, Landmark, Lightbulb, Scale } from "lucide-react";
import type { OptionId } from "@/lib/engine/types";

const ADVISORS = [
  {
    icon: Calculator,
    title: "Chartered Professional Accountant (CPA)",
    body: "Plans the tax side of your sale and gets your financial statements ready for buyers.",
  },
  {
    icon: Scale,
    title: "Business lawyer",
    body: "Drafts the sale agreement and protects you if you are paid over time.",
  },
  {
    icon: Briefcase,
    title: "Chartered Business Valuator (CBV)",
    body: "Gives you a formal, independent value for your business.",
  },
  {
    icon: Landmark,
    title: "BDC (Business Development Bank of Canada)",
    body: "Offers transition advice and can help finance the buyer.",
  },
];

export function AdvisorCards({ option }: { option: OptionId }) {
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
              <p className="text-base leading-relaxed text-muted-foreground print:text-sm">{a.body}</p>
            </div>
          </li>
        ))}
      </ul>
      {option === "eot" && (
        <div className="print-break-avoid flex gap-4 rounded-2xl border border-primary/25 bg-secondary p-6 text-secondary-foreground print:rounded-none print:border-0 print:border-l-4 print:bg-transparent print:py-1 print:pl-3">
          <Lightbulb className="mt-0.5 size-6 shrink-0 text-primary print:hidden" aria-hidden />
          <p className="text-base leading-relaxed">
            <strong className="font-semibold">Selling to employees:</strong> Employee Ownership Trusts are new in
            Canada. Ask each advisor whether they have done an EOT sale before.
          </p>
        </div>
      )}
    </div>
  );
}
