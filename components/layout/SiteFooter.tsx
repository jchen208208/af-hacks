import { DISCLAIMER_TEXT } from "./Disclaimer";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t bg-muted/50">
      <div className="mx-auto max-w-6xl space-y-3 px-4 py-8 text-sm leading-relaxed text-muted-foreground sm:px-6">
        <p>{DISCLAIMER_TEXT}</p>
        <p className="no-print">
          Your answers stay in this browser. Nothing is sent anywhere, except the optional AI-written
          summary if you choose to use it.
        </p>
      </div>
    </footer>
  );
}
