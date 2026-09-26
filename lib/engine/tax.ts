// Illustrative capital gains tax (plan 7.4). No rounding: rounding happens only at display time.

import { INCLUSION_RATE, TOP_RATE } from "@/lib/config/assumptions";
import type { Province } from "./types";

export interface TaxInput {
  price: number;
  sharesCostBase: number;
  exemption: number;
  province: Province;
}

export interface TaxResult {
  gain: number;
  taxable: number;
  tax: number;
  afterTax: number;
}

export function computeTax({ price, sharesCostBase, exemption, province }: TaxInput): TaxResult {
  const gain = Math.max(0, price - sharesCostBase);
  const taxable = Math.max(0, gain - exemption) * INCLUSION_RATE;
  const tax = taxable * TOP_RATE[province];
  return { gain, taxable, tax, afterTax: price - tax };
}
