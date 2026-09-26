"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSnapshot } from "@/lib/state/SnapshotContext";

/** Loads the demo persona (Frank) in one click and jumps to the results (plan 4.7). */
export function DemoButton({
  children = "See an example",
  className,
  variant = "outline",
}: {
  children?: React.ReactNode;
  className?: string;
  variant?: React.ComponentProps<typeof Button>["variant"];
}) {
  const { loadDemo } = useSnapshot();
  const router = useRouter();
  return (
    <Button
      size="xl"
      variant={variant}
      className={className}
      onClick={() => {
        loadDemo();
        router.push("/results");
      }}
    >
      {children}
    </Button>
  );
}
