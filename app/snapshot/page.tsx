import { PageHero } from "@/components/layout/PageHero";
import { SnapshotStepper } from "@/components/snapshot/SnapshotStepper";
import { SnapshotWizard } from "@/components/snapshot/SnapshotWizard";

export const metadata = { title: "Business Snapshot — Handover" };

export default function SnapshotPage() {
  return (
    <>
      <PageHero
        eyebrow="Business Snapshot"
        title="Tell us about your business"
        actions={<SnapshotStepper />}
      >
        About 20 questions in plain language, in four short steps. No documents needed.
      </PageHero>

      {/* The card sits fully on the beige page background, below the green hero. */}
      <div className="mx-auto mt-10 max-w-4xl px-4 sm:mt-12 sm:px-6">
        <SnapshotWizard />
      </div>
    </>
  );
}
