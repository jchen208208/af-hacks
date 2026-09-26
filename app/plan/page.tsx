import { TransitionPlan } from "@/components/plan/TransitionPlan";
import type { OptionId } from "@/lib/engine/types";

export const metadata = { title: "Your transition plan — Handover" };

const OPTION_IDS: OptionId[] = ["family", "canadian", "pe", "eot", "winddown"];

export default async function PlanPage({ searchParams }: PageProps<"/plan">) {
  const { option } = await searchParams;
  const selected = OPTION_IDS.find((id) => id === option) ?? "eot";
  return <TransitionPlan option={selected} />;
}
