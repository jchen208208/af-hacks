"use client";

// Holds the owner's answers in React context and mirrors them to localStorage,
// so a refresh never loses data (plan 6.2). No data leaves the browser.

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { EotAnswer, EotAnswers, EotQuestionId, Snapshot } from "@/lib/engine/types";
import { FRANK, FRANK_EOT_ANSWERS } from "@/lib/demo/frank";
import { DEFAULT_PRIORITIES, DEFAULT_SHARES_COST_BASE, SNAPSHOT_SCHEMA } from "@/lib/snapshot/questions";

// v2: the example is kept apart from the owner's own answers. v1 stored the example *as*
// the owner's draft, so anyone who had viewed it saw Frank's answers in the wizard.
const STORAGE_KEY = "handover:v2";
const LEGACY_KEYS = ["handover:v1"];

export type SnapshotDraft = Partial<Snapshot>;

interface StoredState {
  /** The owner's own answers. Viewing the example never touches these. */
  draft: SnapshotDraft;
  step: number;
  eotAnswers: EotAnswers;
  /** Results and plan show the example (Frank) instead of the owner's answers. */
  isDemo: boolean;
  /** EOT check answers while viewing the example, kept apart from the owner's. */
  demoEotAnswers: EotAnswers;
  /** The owner filled the wizard with the example and hasn't changed anything since. */
  draftIsExample: boolean;
}

const INITIAL: StoredState = {
  draft: { sharesCostBase: DEFAULT_SHARES_COST_BASE, priorities: DEFAULT_PRIORITIES },
  step: 0,
  eotAnswers: {},
  isDemo: false,
  demoEotAnswers: FRANK_EOT_ANSWERS,
  draftIsExample: false,
};

interface SnapshotContextValue extends Omit<StoredState, "demoEotAnswers"> {
  /** False until localStorage has been read; avoid rendering "empty" states before then. */
  hydrated: boolean;
  /** The snapshot the results use: the example while viewing it, otherwise the owner's (null until finished). */
  snapshot: Snapshot | null;
  /** True when the results show example data (viewed from the landing, or filled in the wizard). */
  showingExample: boolean;
  update: (patch: SnapshotDraft) => void;
  setStep: (step: number) => void;
  setEotAnswer: (id: EotQuestionId, answer: EotAnswer) => void;
  /** "See an example": shows Frank's results without touching the owner's answers. */
  viewDemo: () => void;
  /** "Fill with an example" in the wizard: copies Frank's answers into the owner's draft. */
  fillExample: () => void;
  /** Stop viewing the example (the owner opened the wizard to work on their own plan). */
  exitDemo: () => void;
  reset: () => void;
}

const SnapshotContext = createContext<SnapshotContextValue | null>(null);

function readStorage(): StoredState | null {
  try {
    for (const key of LEGACY_KEYS) window.localStorage.removeItem(key);
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? { ...INITIAL, ...(JSON.parse(raw) as StoredState) } : null;
  } catch {
    return null;
  }
}

function writeStorage(state: StoredState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Private mode or storage blocked: keep working in memory.
  }
}

export function SnapshotProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StoredState>(INITIAL);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = readStorage();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from localStorage
    if (stored) setState(stored);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeStorage(state);
  }, [state, hydrated]);

  // Editing an answer means the owner is working on their own plan again.
  const update = useCallback(
    (patch: SnapshotDraft) =>
      setState((s) => ({ ...s, draft: { ...s.draft, ...patch }, isDemo: false, draftIsExample: false })),
    [],
  );
  const setStep = useCallback((step: number) => setState((s) => ({ ...s, step })), []);
  const setEotAnswer = useCallback(
    (id: EotQuestionId, answer: EotAnswer) =>
      setState((s) =>
        s.isDemo
          ? { ...s, demoEotAnswers: { ...s.demoEotAnswers, [id]: answer } }
          : { ...s, eotAnswers: { ...s.eotAnswers, [id]: answer } },
      ),
    [],
  );
  const viewDemo = useCallback(
    () => setState((s) => ({ ...s, isDemo: true, demoEotAnswers: FRANK_EOT_ANSWERS })),
    [],
  );
  const fillExample = useCallback(
    () =>
      setState((s) => ({ ...s, draft: FRANK, step: 3, eotAnswers: FRANK_EOT_ANSWERS, isDemo: false, draftIsExample: true })),
    [],
  );
  const exitDemo = useCallback(() => setState((s) => (s.isDemo ? { ...s, isDemo: false } : s)), []);
  const reset = useCallback(() => setState(INITIAL), []);

  const ownSnapshot = useMemo(() => {
    const parsed = SNAPSHOT_SCHEMA.safeParse(state.draft);
    return parsed.success ? (parsed.data as Snapshot) : null;
  }, [state.draft]);

  const value = useMemo(() => {
    const { demoEotAnswers, ...rest } = state;
    return {
      ...rest,
      eotAnswers: state.isDemo ? demoEotAnswers : state.eotAnswers,
      snapshot: state.isDemo ? FRANK : ownSnapshot,
      showingExample: state.isDemo || state.draftIsExample,
      hydrated,
      update,
      setStep,
      setEotAnswer,
      viewDemo,
      fillExample,
      exitDemo,
      reset,
    };
  }, [state, hydrated, ownSnapshot, update, setStep, setEotAnswer, viewDemo, fillExample, exitDemo, reset]);

  return <SnapshotContext.Provider value={value}>{children}</SnapshotContext.Provider>;
}

export function useSnapshot() {
  const ctx = useContext(SnapshotContext);
  if (!ctx) throw new Error("useSnapshot must be used inside <SnapshotProvider>");
  return ctx;
}
