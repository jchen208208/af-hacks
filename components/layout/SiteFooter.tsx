import { DISCLAIMER_TEXT } from "./Disclaimer";

export function SiteFooter() {
  return (
    <footer className="mt-16 bg-band text-hero-muted print:mt-6 print:bg-transparent print:text-muted-foreground">
      <div className="mx-auto max-w-6xl space-y-3 px-4 py-10 text-sm leading-relaxed sm:px-6">
        <p className="font-heading text-lg font-semibold text-hero-foreground print:hidden">Handover</p>
        <p>{DISCLAIMER_TEXT}</p>
        <p className="no-print">
          Your answers stay in this browser. Nothing is sent anywhere, except the optional AI-written
          summary if you choose to use it.
        </p>
      </div>
    </footer>
  );
}
