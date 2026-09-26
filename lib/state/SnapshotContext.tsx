"use client";

// Holds the owner's answers in React context and mirrors them to localStorage,
// so a refresh never loses data (plan 6.2). No data leaves the browser.

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { EotAnswer, EotAnswers, EotQuestionId, Snapshot } from "@/lib/engine/types";
import { FRANK, FRANK_EOT_ANSWERS } from "@/lib/demo/frank";
import { DEFAULT_PRIORITIES, DEFAULT_SHARES_COST_BASE, SNAPSHOT_SCHEMA } from "@/lib/snapshot/questions";

const STORAGE_KEY = "handover:v1";

export type SnapshotDraft = Partial<Snapshot>;

interface StoredState {
  draft: SnapshotDraft;
  step: number;
  eotAnswers: EotAnswers;
  isDemo: boolean;
}

const INITIAL: StoredState = {
  draft: { sharesCostBase: DEFAULT_SHARES_COST_BASE, priorities: DEFAULT_PRIORITIES },
  step: 0,
  eotAnswers: {},
  isDemo: false,
};

interface SnapshotContextValue extends StoredState {
  /** False until localStorage has been read; avoid rendering "empty" states before then. */
  hydrated: boolean;
  /** The validated snapshot, or null if the wizard isn't finished. */
  snapshot: Snapshot | null;
  update: (patch: SnapshotDraft) => void;
  setStep: (step: number) => void;
  setEotAnswer: (id: EotQuestionId, answer: EotAnswer) => void;
  loadDemo: () => void;
  reset: () => void;
}

const SnapshotContext = createContext<SnapshotContextValue | null>(null);

function readStorage(): StoredState | null {
  try {
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

  const update = useCallback(
    (patch: SnapshotDraft) => setState((s) => ({ ...s, draft: { ...s.draft, ...patch }, isDemo: false })),
    [],
  );
  const setStep = useCallback((step: number) => setState((s) => ({ ...s, step })), []);
  const setEotAnswer = useCallback(
    (id: EotQuestionId, answer: EotAnswer) =>
      setState((s) => ({ ...s, eotAnswers: { ...s.eotAnswers, [id]: answer } })),
    [],
  );
  const loadDemo = useCallback(
    () => setState({ draft: FRANK, step: 3, eotAnswers: FRANK_EOT_ANSWERS, isDemo: true }),
    [],
  );
  const reset = useCallback(() => setState(INITIAL), []);

  const snapshot = useMemo(() => {
    const parsed = SNAPSHOT_SCHEMA.safeParse(state.draft);
    return parsed.success ? (parsed.data as Snapshot) : null;
  }, [state.draft]);

  const value = useMemo(
    () => ({ ...state, hydrated, snapshot, update, setStep, setEotAnswer, loadDemo, reset }),
    [state, hydrated, snapshot, update, setStep, setEotAnswer, loadDemo, reset],
  );

  return <SnapshotContext.Provider value={value}>{children}</SnapshotContext.Provider>;
}

export function useSnapshot() {
  const ctx = useContext(SnapshotContext);
  if (!ctx) throw new Error("useSnapshot must be used inside <SnapshotProvider>");
  return ctx;
}
