import { DISPLAY_ROUNDING } from "@/lib/config/assumptions";

/** Round to the nearest $10K and format compactly: $4.85M, $540K. Rounding happens only here. */
export function formatMoney(value: number): string {
  const rounded = Math.round(value / DISPLAY_ROUNDING) * DISPLAY_ROUNDING;
  if (Math.abs(rounded) >= 1_000_000) {
    return `$${(rounded / 1_000_000).toFixed(2).replace(/\.?0+$/, "")}M`;
  }
  if (Math.abs(rounded) >= 1_000) {
    return `$${Math.round(rounded / 1_000)}K`;
  }
  return `$${rounded}`;
}

export function formatRange(low: number, high: number): string {
  return `${formatMoney(low)} – ${formatMoney(high)}`;
}
