"use client";

import Link from "next/link";
import { Gauge, Map, Scale, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DemoButton } from "@/components/landing/DemoButton";
import { useSnapshot } from "@/lib/state/SnapshotContext";
import type { Snapshot } from "@/lib/engine/types";
import { PageHero, heroButtonClass } from "./PageHero";

const COPY = {
  results: {
    title: "You don't have any results yet",
    lead: "Your results appear here once you've answered a few questions about your business. It takes about 10 minutes and you don't need any documents.",
  },
  plan: {
    title: "You don't have a plan yet",
    lead: "Your transition plan is built from your answers about your business. Answer about 20 questions (about 10 minutes) and then pick the exit option you want a plan for.",
  },
};

const WHAT_YOU_GET = [
  { icon: Gauge, title: "A readiness score", body: "How ready your business is to sell, and the three changes that would help most." },
  { icon: Tag, title: "What it could be worth", body: "An estimated value range based on your profit and your industry." },
  { icon: Scale, title: "Every way to exit, side by side", body: "What you'd keep after tax, and what happens to your employees, for each option." },
  { icon: Map, title: "A step-by-step plan", body: "A timeline and checklist for the option you choose, and who to talk to." },
];

/** Renders children only once a complete snapshot exists; otherwise a loading or empty state. */
export function NeedsSnapshot({
  children,
  kind = "results",
}: {
  children: (snapshot: Snapshot) => React.ReactNode;
  kind?: keyof typeof COPY;
}) {
  const { hydrated, snapshot, draft } = useSnapshot();

  if (!hydrated) {
    return (
      <div aria-busy>
        <div className="h-64 animate-pulse bg-hero" />
        <div className="mx-auto max-w-6xl space-y-6 px-4 py-12 sm:px-6">
          <div className="h-64 animate-pulse rounded-2xl bg-muted" />
        </div>
      </div>
    );
  }

  if (!snapshot) {
    // Anything beyond the defaults (shares cost and priority order) means they've started.
    const started = Object.entries(draft).some(
      ([k, v]) => k !== "sharesCostBase" && k !== "priorities" && v !== undefined && v !== "",
    );
    return (
      <>
        <PageHero
          eyebrow="No results yet"
          title={COPY[kind].title}
          actions={
            <>
              <Button asChild size="xl" className={heroButtonClass.solid}>
                <Link href="/snapshot">{started ? "Continue my answers" : "Start my plan"}</Link>
              </Button>
              <DemoButton variant="ghost" className={heroButtonClass.outline} />
            </>
          }
        >
          {COPY[kind].lead} Or look at an example to see how it works.
        </PageHero>

        <section aria-labelledby="what-you-get" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 id="what-you-get" className="text-3xl font-semibold sm:text-4xl">
            What you&apos;ll see here
          </h2>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2">
            {WHAT_YOU_GET.map((item) => (
              <li key={item.title} className="flex gap-4 rounded-2xl border bg-card p-6 shadow-sm">
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-secondary text-secondary-foreground">
                  <item.icon className="size-6" aria-hidden />
                </span>
                <div className="space-y-1.5">
                  <h3 className="text-xl leading-snug font-semibold">{item.title}</h3>
                  <p className="text-base leading-relaxed text-muted-foreground">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </>
    );
  }

  return <>{children(snapshot)}</>;
}
