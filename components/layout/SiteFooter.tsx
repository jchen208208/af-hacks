"use client";

import { ArrowUpRight, Info, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSnapshot } from "@/lib/state/SnapshotContext";
import { DISCLAIMER_TEXT } from "./Disclaimer";

const CONTACT_EMAIL = "jaydenccan11@gmail.com";

/** Further reading, all sources the site already cites. */
const RESOURCES = [
  { label: "Social Capital Partners", href: "https://socialcapitalpartners.ca" },
  {
    label: "EY: the EOT tax exemption",
    href: "https://www.ey.com/en_ca/technical/tax/tax-alerts/2026/tax-alert-2026-no-28",
  },
  {
    label: "CRA: 2026 tax amounts",
    href: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/frequently-asked-questions-individuals/adjustment-personal-income-tax-benefit-amounts.html",
  },
  {
    label: "BDC: the acquisition wave",
    href: "https://www.bdc.ca/en/about/mediaroom/news-releases/historic-300-billion-wave-of-business-acquisitions-set-to-reshape-canada-economy",
  },
];

const LINK =
  "rounded-sm text-hero-muted underline-offset-4 transition-colors hover:text-hero-foreground hover:underline focus-visible:ring-3 focus-visible:ring-white/60 focus-visible:outline-none";

// The disclaimer's first sentence leads in bold; the rest follows as is.
const [DISCLAIMER_LEAD, ...DISCLAIMER_REST] = DISCLAIMER_TEXT.split(/(?<=\.) /);

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  const id = `footer-${title.toLowerCase()}`;
  return (
    <nav aria-labelledby={id} className="space-y-3">
      <h2 id={id} className="font-sans text-sm font-bold tracking-[0.2em] text-highlight uppercase">
        {title}
      </h2>
      {children}
    </nav>
  );
}

/** Dark-green site footer: brand and privacy note, site links, further reading, contact, then the disclaimer. */
export function SiteFooter() {
  const { viewDemo } = useSnapshot();
  const router = useRouter();

  return (
    <footer className="mt-16 bg-band text-hero-muted print:hidden">
      <div className="mx-auto max-w-6xl px-4 pt-10 pb-8 sm:px-6 sm:pt-12">
        <div className="grid gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-[1.25fr_0.8fr_1.15fr_1fr] lg:gap-10">
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 rounded-md font-heading text-2xl font-semibold text-hero-foreground focus-visible:ring-3 focus-visible:ring-white/60 focus-visible:outline-none"
            >
              <span aria-hidden className="grid size-9 place-items-center rounded-md bg-white text-lg text-hero">
                H
              </span>
              Handover
            </Link>
            <p className="max-w-xs text-base leading-relaxed">
              Exit planning for Canadian small-business owners getting ready to retire.
            </p>
            <p className="inline-flex items-start gap-2.5 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm leading-snug text-hero-foreground">
              <Lock className="mt-0.5 size-4 shrink-0 text-highlight" aria-hidden />
              <span>Your answers stay in this browser. Nothing is sent anywhere.</span>
            </p>
          </div>

          <Column title="Site">
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-base sm:grid-cols-1">
              <li>
                <Link href="/" className={LINK}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/snapshot" className={LINK}>
                  Start my plan
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  className={`${LINK} cursor-pointer text-left`}
                  onClick={() => {
                    viewDemo();
                    router.push("/results");
                  }}
                >
                  See an example
                </button>
              </li>
              <li>
                <Link href="/results" className={LINK}>
                  My results
                </Link>
              </li>
            </ul>
          </Column>

          <Column title="Resources">
            <ul className="space-y-2 text-base">
              {RESOURCES.map((r) => (
                <li key={r.href}>
                  <a href={r.href} target="_blank" rel="noopener noreferrer" className={`${LINK} group`}>
                    {r.label.slice(0, r.label.lastIndexOf(" ") + 1)}
                    {/* The arrow stays with the last word when the label wraps. */}
                    <span className="whitespace-nowrap">
                      {r.label.slice(r.label.lastIndexOf(" ") + 1)}
                      <ArrowUpRight
                        className="ml-1 inline size-4 align-[-0.125em] opacity-60 transition-opacity group-hover:opacity-100"
                        aria-hidden
                      />
                    </span>
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </Column>

          <Column title="Contact">
            <p className="text-base leading-relaxed">Questions, feedback or a pilot idea? Get in touch.</p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex max-w-full items-center gap-2 rounded-sm border-b-2 border-highlight/70 pb-0.5 text-base font-semibold break-all text-hero-foreground transition-colors hover:border-highlight hover:text-highlight focus-visible:ring-3 focus-visible:ring-white/60 focus-visible:outline-none"
            >
              <Mail className="size-4 shrink-0 text-highlight" aria-hidden />
              {CONTACT_EMAIL}
            </a>
          </Column>
        </div>

        <div role="note" className="mt-8 flex items-start gap-3 rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-4 sm:mt-10 sm:items-center sm:gap-4 sm:px-5">
          <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-full bg-highlight/15 text-highlight">
            <Info className="size-5" />
          </span>
          <p className="text-sm leading-relaxed">
            <span className="font-semibold text-hero-foreground">{DISCLAIMER_LEAD}</span> {DISCLAIMER_REST.join(" ")}
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© 2026 Handover</p>
          <p>Built for AF Hacks: Growing Canada</p>
        </div>
      </div>
    </footer>
  );
}
