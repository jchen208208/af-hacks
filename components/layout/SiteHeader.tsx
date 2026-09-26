import Link from "next/link";
import { Button } from "@/components/ui/button";

/** Dark-green bar that flows straight into each page's green hero. */
export function SiteHeader() {
  return (
    <header className="no-print relative z-20 border-b border-white/10 bg-hero text-hero-foreground">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-md font-heading text-xl font-semibold focus-visible:ring-3 focus-visible:ring-white/60 focus-visible:outline-none"
        >
          <span aria-hidden className="grid size-8 place-items-center rounded-md bg-white text-base text-hero">
            H
          </span>
          Handover
        </Link>
        <nav aria-label="Main" className="flex items-center gap-1 sm:gap-2">
          <Button
            asChild
            variant="ghost"
            size="lg"
            className="hidden text-base text-hero-foreground hover:bg-white/10 hover:text-white focus-visible:ring-white/60 sm:inline-flex"
          >
            <Link href="/results">My results</Link>
          </Button>
          <Button asChild size="lg" className="bg-white text-base text-hero hover:bg-[oklch(0.95_0.02_165)] focus-visible:ring-white/60">
            <Link href="/snapshot">Start my plan</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
