import { Badge } from "@/components/ui/badge";

/** Marks scaffold content that isn't wired to the real engine yet. Remove as phases land. */
export function PlaceholderBadge({ phase }: { phase: number }) {
  return (
    <Badge variant="outline" className="no-print border-dashed font-mono text-xs text-muted-foreground">
      placeholder · phase {phase}
    </Badge>
  );
}
