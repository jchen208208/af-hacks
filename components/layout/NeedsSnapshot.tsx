"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DemoButton } from "@/components/landing/DemoButton";
import { useSnapshot } from "@/lib/state/SnapshotContext";
import type { Snapshot } from "@/lib/engine/types";
import { PageHero, heroButtonClass } from "./PageHero";

/** Renders children only once a complete snapshot exists; otherwise a loading or empty state. */
export function NeedsSnapshot({ children }: { children: (snapshot: Snapshot) => React.ReactNode }) {
  const { hydrated, snapshot } = useSnapshot();

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
    return (
      <PageHero
        eyebrow="Almost there"
        title="We need a few details first"
        actions={
          <>
            <Button asChild size="xl" className={heroButtonClass.solid}>
              <Link href="/snapshot">Start my plan</Link>
            </Button>
            <DemoButton variant="ghost" className={heroButtonClass.outline} />
          </>
        }
      >
        Answer about 20 questions about your business, or look at an example to see how it works.
      </PageHero>
    );
  }

  return <>{children(snapshot)}</>;
}
