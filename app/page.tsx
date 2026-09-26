import Link from "next/link";
import { ArrowRight, ClipboardList, Map, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DemoButton } from "@/components/landing/DemoButton";
import { HeroBackdrop } from "@/components/landing/HeroBackdrop";
import { ProductPreview } from "@/components/landing/ProductPreview";

const STATS = [
  { value: "76%", label: "of Canadian small-business owners plan to exit within 10 years", source: "CFIB, 2023" },
  { value: "9%", label: "have a formal succession plan", source: "CFIB, 2023" },
  { value: "$10M", label: "of capital gains tax-free when you sell to your employees", source: "EOT exemption, permanent since April 2026" },
];

const STEPS = [
  { icon: ClipboardList, title: "Describe your business", body: "About 20 plain-language questions. Ten minutes, no documents needed." },
  { icon: Scale, title: "See where you stand", body: "A readiness score, a value range, and every realistic way to exit, side by side." },
  { icon: Map, title: "Leave with a plan", body: "A year-by-year checklist and who to call. Print it and bring it to your accountant." },
];

// Hero palette: shades of the product's deep green, with a warm gold for the big numbers.
const HERO_BG = "bg-[oklch(0.3_0.055_165)]";
const BAND_BG = "bg-[oklch(0.25_0.045_165)]";
const GOLD = "text-[oklch(0.86_0.11_85)]";

export default function LandingPage() {
  return (
    <>
      <section className={`relative isolate overflow-hidden ${HERO_BG} text-white`}>
        <HeroBackdrop />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pt-14 pb-12 sm:px-6 lg:min-h-[36rem] lg:grid-cols-[1fr_1.05fr] lg:gap-8 lg:py-20">
          <div className="space-y-7">
            <h1 className="font-heading text-4xl leading-[1.1] font-semibold text-balance sm:text-5xl xl:text-6xl">
              Your business took decades to build. Plan how it lives on.
            </h1>
            <p className="max-w-xl text-xl leading-relaxed text-[oklch(0.92_0.02_165)]">
              In 10 minutes: what your business is worth, how ready it is to sell, and every way to exit —
              including selling to your own employees tax-free.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button
                asChild
                size="xl"
                className="h-14 bg-white px-8 text-lg text-[oklch(0.3_0.055_165)] shadow-lg hover:bg-[oklch(0.95_0.02_165)] focus-visible:ring-white/60"
              >
                <Link href="/snapshot">
                  Start my plan <ArrowRight />
                </Link>
              </Button>
              <DemoButton
                variant="ghost"
                className="h-14 border-2 border-white/80 px-8 text-lg text-white hover:bg-white/10 hover:text-white focus-visible:ring-white/60"
              />
            </div>
            <p className="text-base text-[oklch(0.88_0.02_165)]">Free. No account. Your answers stay in your browser.</p>
          </div>

          <ProductPreview />
        </div>
      </section>

      <section aria-label="Why this matters" className={`${BAND_BG} text-white`}>
        <ul className="mx-auto grid max-w-6xl divide-y divide-white/15 px-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-6">
          {STATS.map((s) => (
            <li key={s.value} className="flex flex-col gap-2 py-8 sm:px-8 sm:py-12 sm:first:pl-0 sm:last:pr-0">
              <p className={`font-heading text-6xl font-semibold ${GOLD}`}>{s.value}</p>
              <p className="text-lg leading-snug">{s.label}</p>
              <p className="text-sm text-white/75">{s.source}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-20 pb-8 sm:px-6">
        <div className="max-w-2xl space-y-3">
          <p className="text-sm font-semibold tracking-wide text-primary uppercase">How it works</p>
          <h2 className="text-3xl font-semibold sm:text-4xl">Three steps to a plan you can take to your accountant</h2>
        </div>
        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <li key={step.title} className="relative space-y-3 rounded-2xl border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="grid size-12 place-items-center rounded-xl bg-secondary text-secondary-foreground">
                  <step.icon className="size-6" aria-hidden />
                </span>
                <span className="font-heading text-4xl font-semibold text-primary/25" aria-hidden>
                  {i + 1}
                </span>
              </div>
              <h3 className="text-xl font-semibold">
                <span className="sr-only">Step {i + 1}: </span>
                {step.title}
              </h3>
              <p className="text-base leading-relaxed text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Button asChild size="xl" className="h-14 px-8 text-lg">
            <Link href="/snapshot">
              Start my plan <ArrowRight />
            </Link>
          </Button>
          <p className="text-base text-muted-foreground">Takes about 10 minutes.</p>
        </div>
      </section>
    </>
  );
}
