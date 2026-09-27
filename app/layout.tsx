import type { Metadata } from "next";
import { Manrope, Source_Serif_4, Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { SnapshotProvider } from "@/lib/state/SnapshotContext";
import "./globals.css";

// Manrope: modern and crisp for body and small text, still very legible at 18px.
const sans = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

const serif = Source_Serif_4({
  variable: "--font-heading",
  subsets: ["latin"],
});

const mono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Handover — Plan how your business lives on",
  description:
    "See what your business is worth, how ready it is to sell, and every way to exit — including selling to your employees tax-free.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-CA"
      className={`${sans.variable} ${serif.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="flex min-h-dvh flex-col">
        <SnapshotProvider>
          <TooltipProvider>
            <SmoothScroll />
            <a
              href="#main"
              className="sr-only z-50 rounded-md bg-white px-4 py-2 font-semibold text-hero focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:ring-3 focus:ring-primary/50 focus:outline-none"
            >
              Skip to main content
            </a>
            <SiteHeader />
            <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
              {children}
            </main>
            <SiteFooter />
          </TooltipProvider>
        </SnapshotProvider>
      </body>
    </html>
  );
}
