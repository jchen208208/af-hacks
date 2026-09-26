import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="no-print border-b bg-card/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-heading text-xl font-semibold text-foreground">
          <span aria-hidden className="grid size-8 place-items-center rounded-md bg-primary text-base text-primary-foreground">
            H
          </span>
          Handover
        </Link>
        <nav aria-label="Main" className="flex items-center gap-1 sm:gap-2">
          <Button asChild variant="ghost" size="lg" className="hidden text-base sm:inline-flex">
            <Link href="/results">My results</Link>
          </Button>
          <Button asChild size="lg" className="text-base">
            <Link href="/snapshot">Start my plan</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
