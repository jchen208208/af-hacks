"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DemoButton } from "@/components/landing/DemoButton";
import { useSnapshot } from "@/lib/state/SnapshotContext";
import type { Snapshot } from "@/lib/engine/types";

/** Renders children only once a complete snapshot exists; otherwise a loading or empty state. */
export function NeedsSnapshot({ children }: { children: (snapshot: Snapshot) => React.ReactNode }) {
  const { hydrated, snapshot } = useSnapshot();

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-12 sm:px-6" aria-busy>
        <div className="h-10 w-2/3 animate-pulse rounded-lg bg-muted" />
        <div className="h-64 animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  if (!snapshot) {
    return (
      <div className="mx-auto max-w-2xl space-y-6 px-4 py-24 text-center sm:px-6">
        <h1 className="text-3xl font-semibold">We need a few details first</h1>
        <p className="text-lg text-muted-foreground">
          Answer about 20 questions about your business, or look at an example to see how it works.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild size="xl">
            <Link href="/snapshot">Start my plan</Link>
          </Button>
          <DemoButton />
        </div>
      </div>
    );
  }

  return <>{children(snapshot)}</>;
}
