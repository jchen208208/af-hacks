"use client";

import { useId } from "react";
import { ArrowDown, ArrowUp, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Choice } from "@/lib/snapshot/questions";
import { cn } from "@/lib/utils";

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
    <Wrapper className="space-y-2" aria-describedby={error ? `${id}-error` : undefined}>
      <div className="flex items-center gap-2">
        <LabelEl htmlFor={as === "fieldset" ? undefined : id} className="text-base font-semibold">
          {label}
        </LabelEl>
        {help && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button type="button" aria-label={`What does "${label}" mean?`} className="text-muted-foreground hover:text-foreground">
                <Info className="size-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs text-sm">{help}</TooltipContent>
          </Tooltip>
        )}
      </div>
      {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
      {children}
      {error && (
        <p id={`${id}-error`} className="text-sm font-medium text-destructive">
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
        className="h-12 max-w-md text-base"
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
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
            {props.prefix}
          </span>
        )}
        <Input
          id={id}
          type="number"
          inputMode="numeric"
          aria-invalid={!!props.error}
          className={cn("h-12 text-base", props.prefix && "pl-7")}
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
        <SelectTrigger id={id} aria-invalid={!!props.error} className="h-12 w-full max-w-md text-base">
          <SelectValue placeholder={props.placeholder ?? "Choose one"} />
        </SelectTrigger>
        <SelectContent>
          {props.choices.map((c) => (
            <SelectItem key={c.value} value={c.value} className="text-base">
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
  const cols = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-3", 4: "sm:grid-cols-4" }[props.columns ?? 2];
  return (
    <FieldShell id={id} as="fieldset" {...props}>
      <RadioGroup
        value={props.value ?? ""}
        onValueChange={(v) => props.onChange(v as T)}
        className={cn("grid gap-2", cols)}
      >
        {props.choices.map((c) => {
          const itemId = `${id}-${c.value}`;
          return (
            <Label
              key={c.value}
              htmlFor={itemId}
              className="flex cursor-pointer items-center gap-3 rounded-lg border bg-card px-4 py-3 text-base font-normal has-data-[state=checked]:border-primary has-data-[state=checked]:bg-secondary"
            >
              <RadioGroupItem id={itemId} value={c.value} />
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
      <ol className="max-w-md space-y-2">
        {props.value.map((item, i) => (
          <li key={item} className="flex items-center gap-3 rounded-lg border bg-card px-4 py-2">
            <span className="w-6 font-heading text-lg font-semibold text-primary">{i + 1}</span>
            <span className="flex-1 text-base">{props.labels[item]}</span>
            <Button type="button" variant="ghost" size="icon-lg" disabled={i === 0} onClick={() => move(i, i - 1)} aria-label={`Move "${props.labels[item]}" up`}>
              <ArrowUp />
            </Button>
            <Button type="button" variant="ghost" size="icon-lg" disabled={i === props.value.length - 1} onClick={() => move(i, i + 1)} aria-label={`Move "${props.labels[item]}" down`}>
              <ArrowDown />
            </Button>
          </li>
        ))}
      </ol>
    </FieldShell>
  );
}
