import { cn } from "@/lib/utils";

export function PageIntro({
  eyebrow,
  title,
  children,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-3", className)}>
      {eyebrow && <p className="text-sm font-semibold tracking-wide text-primary uppercase">{eyebrow}</p>}
      <h1 className="text-3xl font-semibold text-balance sm:text-4xl">{title}</h1>
      {children && <div className="max-w-2xl text-lg text-muted-foreground">{children}</div>}
    </div>
  );
}
