import { PageIntro } from "@/components/layout/PageIntro";
import { SnapshotWizard } from "@/components/snapshot/SnapshotWizard";

export const metadata = { title: "Business Snapshot — Handover" };

export default function SnapshotPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-10 px-4 py-12 sm:px-6">
      <PageIntro eyebrow="Business Snapshot" title="Tell us about your business">
        About 20 questions in plain language. Your answers are saved in this browser as you go.
      </PageIntro>
      <SnapshotWizard />
    </div>
  );
}
