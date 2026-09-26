"use client";

import { useId } from "react";
import { ArrowDown, ArrowUp, CircleAlert, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Choice } from "@/lib/snapshot/questions";
import { cn } from "@/lib/utils";

/** Shared control look: tall, rounded, green focus ring (matches the site theme). */
const CONTROL =
  "h-14 rounded-xl border-input bg-card px-4 text-base shadow-xs md:text-base focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/20";

interface FieldShellProps {
  id: string;
  label: string;
  hint?: string;
  help?: string;
  error?: string;
  children: React.ReactNode;
  as?: "div" | "fieldset";
}

function FieldShell({ id, label, hint, help, error, children, as = "div" }: FieldShellProps) {
  const Wrapper = as;
  const LabelEl = as === "fieldset" ? "legend" : Label;
  return (
    <Wrapper className="min-w-0 space-y-2.5" aria-describedby={error ? `${id}-error` : undefined}>
      <div className="flex items-center gap-2">
        <LabelEl htmlFor={as === "fieldset" ? undefined : id} className="text-lg leading-snug font-semibold">
          {label}
        </LabelEl>
        {help && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                aria-label={`What does "${label}" mean?`}
                className="grid size-8 shrink-0 place-items-center rounded-full text-primary hover:bg-secondary focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                <Info className="size-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs text-sm leading-relaxed">{help}</TooltipContent>
          </Tooltip>
        )}
      </div>
      {hint && <p className="text-base text-muted-foreground">{hint}</p>}
      {children}
      {error && (
        <p id={`${id}-error`} className="flex items-center gap-1.5 text-base font-medium text-destructive">
          <CircleAlert className="size-4 shrink-0" aria-hidden />
          {error}
        </p>
      )}
    </Wrapper>
  );
}

export function TextField(props: {
  label: string;
  value: string | undefined;
  onChange: (v: string) => void;
  hint?: string;
  error?: string;
  placeholder?: string;
}) {
  const id = useId();
  return (
    <FieldShell id={id} {...props}>
      <Input
        id={id}
        className={cn(CONTROL, "max-w-lg")}
        value={props.value ?? ""}
        placeholder={props.placeholder}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </FieldShell>
  );
}

export function NumberField(props: {
  label: string;
  value: number | undefined;
  onChange: (v: number | undefined) => void;
  hint?: string;
  help?: string;
  error?: string;
  prefix?: string;
  placeholder?: string;
}) {
  const id = useId();
  return (
    <FieldShell id={id} {...props}>
      <div className="relative max-w-xs">
        {props.prefix && (
          <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center font-semibold text-muted-foreground">
            {props.prefix}
          </span>
        )}
        <Input
          id={id}
          type="number"
          inputMode="numeric"
          aria-invalid={!!props.error}
          className={cn(CONTROL, "tabular-nums", props.prefix && "pl-9")}
          value={props.value ?? ""}
          placeholder={props.placeholder}
          onChange={(e) => props.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
        />
      </div>
    </FieldShell>
  );
}

export function SelectField<T extends string>(props: {
  label: string;
  value: T | undefined;
  onChange: (v: T) => void;
  choices: Choice<T>[];
  placeholder?: string;
  error?: string;
}) {
  const id = useId();
  return (
    <FieldShell id={id} {...props}>
      <Select value={props.value} onValueChange={(v) => props.onChange(v as T)}>
        <SelectTrigger id={id} aria-invalid={!!props.error} className={cn(CONTROL, "w-full max-w-lg data-[size=default]:h-14")}>
          <SelectValue placeholder={props.placeholder ?? "Choose one"} />
        </SelectTrigger>
        <SelectContent>
          {props.choices.map((c) => (
            <SelectItem key={c.value} value={c.value} className="py-2.5 text-base">
              {c.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FieldShell>
  );
}

/** Big, tappable radio options — easier than a dropdown for short lists. */
export function ChoiceField<T extends string>(props: {
  label: string;
  value: T | undefined;
  onChange: (v: T) => void;
  choices: Choice<T>[];
  hint?: string;
  help?: string;
  error?: string;
  columns?: 2 | 3 | 4;
}) {
  const id = useId();
  const cols = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" }[props.columns ?? 2];
  return (
    <FieldShell id={id} as="fieldset" {...props}>
      <RadioGroup
        value={props.value ?? ""}
        onValueChange={(v) => props.onChange(v as T)}
        aria-invalid={!!props.error}
        className={cn("grid gap-3", cols)}
      >
        {props.choices.map((c) => {
          const itemId = `${id}-${c.value}`;
          return (
            <Label
              key={c.value}
              htmlFor={itemId}
              className={cn(
                "flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border-2 bg-card px-4 py-3 text-base leading-snug font-medium transition-colors",
                "hover:border-primary/40 hover:bg-secondary/40",
                "has-focus-visible:ring-4 has-focus-visible:ring-primary/20",
                "has-data-[state=checked]:border-primary has-data-[state=checked]:bg-secondary has-data-[state=checked]:text-secondary-foreground",
                props.error && "border-destructive/40",
              )}
            >
              <RadioGroupItem id={itemId} value={c.value} className="size-5 focus-visible:ring-0" />
              {c.label}
            </Label>
          );
        })}
      </RadioGroup>
    </FieldShell>
  );
}

/** Reorderable list for ranking priorities, using up/down buttons (keyboard-friendly, no drag). */
export function RankField<T extends string>(props: {
  label: string;
  hint?: string;
  value: T[];
  labels: Record<T, string>;
  onChange: (v: T[]) => void;
}) {
  const id = useId();
  const move = (from: number, to: number) => {
    const next = [...props.value];
    [next[from], next[to]] = [next[to], next[from]];
    props.onChange(next);
  };
  return (
    <FieldShell id={id} as="fieldset" {...props}>
      <ol className="max-w-lg space-y-2.5">
        {props.value.map((item, i) => (
          <li
            key={item}
            className={cn(
              "flex items-center gap-3 rounded-xl border-2 bg-card py-2 pr-2 pl-3",
              i === 0 && "border-primary bg-secondary",
            )}
          >
            <span
              className={cn(
                "grid size-9 shrink-0 place-items-center rounded-full font-heading text-lg font-semibold",
                i === 0 ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground",
              )}
            >
              {i + 1}
            </span>
            <span className="min-w-0 flex-1 text-base font-medium">{props.labels[item]}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon-lg"
              className="size-11 rounded-lg"
              disabled={i === 0}
              onClick={() => move(i, i - 1)}
              aria-label={`Move "${props.labels[item]}" up`}
            >
              <ArrowUp className="size-5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-lg"
              className="size-11 rounded-lg"
              disabled={i === props.value.length - 1}
              onClick={() => move(i, i + 1)}
              aria-label={`Move "${props.labels[item]}" down`}
            >
              <ArrowDown className="size-5" />
            </Button>
          </li>
        ))}
      </ol>
    </FieldShell>
  );
}
