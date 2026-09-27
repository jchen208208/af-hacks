import Link from "next/link";
import { ArrowRight, ClipboardList, Map, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DemoButton } from "@/components/landing/DemoButton";
import { HeroBackdrop } from "@/components/layout/HeroBackdrop";
import { heroButtonClass } from "@/components/layout/PageHero";
import { ProductPreview } from "@/components/landing/ProductPreview";
import { heroPhotoSrc } from "@/components/landing/heroPhoto";

const STATS = [
  { value: "76%", label: "of Canadian small-business owners plan to exit within 10 years", source: "CFIB, 2023" },
  { value: "9%", label: "have a formal succession plan", source: "CFIB, 2023" },
  { value: "$10M", label: "of capital gains can be tax-free when you sell to your employees", source: "EOT exemption, permanent since April 2026" },
];

const STEPS = [
  { icon: ClipboardList, title: "Describe your business", body: "About 20 plain-language questions. Rough numbers are fine, and you won't need any documents." },
  { icon: Scale, title: "See where you stand", body: "What the business could be worth, how ready it is to sell, and how each way out compares." },
  { icon: Map, title: "Leave with a plan", body: "A year-by-year checklist and who to call. Print it and bring it to your accountant." },
];

export default function LandingPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-hero text-hero-foreground">
        <HeroBackdrop photoSrc={heroPhotoSrc} />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pt-14 pb-12 sm:px-6 lg:min-h-[36rem] lg:grid-cols-[1fr_1.05fr] lg:gap-8 lg:pt-8 lg:pb-10">
          <div className="space-y-7">
            <h1 className="font-heading text-4xl leading-[1.1] font-semibold text-balance sm:text-5xl xl:text-6xl">
              Thinking about retiring? See what you&apos;d actually walk away with.
            </h1>
            <p className="max-w-xl text-xl leading-relaxed text-hero-muted lg:max-w-[28rem]">
              In about 10 minutes you&apos;ll know what your business could sell for and how ready it is. You&apos;ll
              also see what you&apos;d keep after tax from each kind of sale, including selling to your own employees,
              where up to $10 million of the gain can be tax-free.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button
                asChild
                size="xl"
                className={heroButtonClass.solid}
              >
                <Link href="/snapshot">
                  Start my plan <ArrowRight />
                </Link>
              </Button>
              <DemoButton
                variant="ghost"
                className={heroButtonClass.outline}
              />
            </div>
            <p className="text-base text-hero-muted">Free to use. Your answers stay in your browser.</p>
          </div>

          <ProductPreview />
        </div>
      </section>

      <section aria-label="Why this matters" className={`bg-band text-hero-foreground`}>
        <ul className="mx-auto grid max-w-6xl divide-y divide-white/15 px-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-6">
          {STATS.map((s) => (
            <li key={s.value} className="flex flex-col gap-2 py-8 sm:px-8 sm:py-12 sm:first:pl-0 sm:last:pr-0">
              <p className="font-heading text-6xl font-semibold text-highlight">{s.value}</p>
              <p className="text-lg leading-snug">{s.label}</p>
              <p className="text-sm text-white/75">{s.source}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-20 pb-8 sm:px-6">
        <div className="max-w-2xl space-y-3">
          <p className="text-sm font-semibold tracking-wide text-primary uppercase">How it works</p>
          <h2 className="text-3xl font-semibold sm:text-4xl">You answer the questions. We do the math.</h2>
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
