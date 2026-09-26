"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** On the green PageHero, pass `className={heroButtonClass.outline}`. */
export function PrintButton({ label = "Print / Save as PDF", className }: { label?: string; className?: string }) {
  return (
    <Button variant="outline" size="xl" className={cn("no-print", className)} onClick={() => window.print()}>
      <Printer /> {label}
    </Button>
  );
}
