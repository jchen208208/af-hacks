"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSnapshot } from "@/lib/state/SnapshotContext";

/** Shows the demo persona's (Frank's) results in one click (plan 4.7). The owner's own answers are left alone. */
export function DemoButton({
  children = "See an example",
  className,
  variant = "outline",
}: {
  children?: React.ReactNode;
  className?: string;
  variant?: React.ComponentProps<typeof Button>["variant"];
}) {
  const { viewDemo } = useSnapshot();
  const router = useRouter();
  return (
    <Button
      size="xl"
      variant={variant}
      className={className}
      onClick={() => {
        viewDemo();
        router.push("/results");
      }}
    >
      {children}
    </Button>
  );
}
