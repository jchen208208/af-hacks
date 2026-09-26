import { Briefcase, Calculator, Landmark, Scale } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {ADVISORS.map((a) => (
          <Card key={a.title} className="print-break-avoid">
            <CardHeader className="flex flex-row items-center gap-3">
              <a.icon className="size-6 text-primary" aria-hidden />
              <CardTitle className="text-lg">{a.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-base text-muted-foreground">{a.body}</CardContent>
          </Card>
        ))}
      </div>
      {option === "eot" && (
        <p className="rounded-lg bg-secondary px-4 py-3 text-base text-secondary-foreground">
          <strong>Selling to employees:</strong> Employee Ownership Trusts are new in Canada. Ask each advisor
          whether they have done an EOT sale before.
        </p>
      )}
    </div>
  );
}
