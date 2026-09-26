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
        className="pb-6 sm:pb-8"
        actions={<SnapshotStepper />}
      >
        About 20 questions in plain language, in four short steps. No documents needed.
      </PageHero>

      {/* The card only tucks under the hero's bottom edge by its top padding, so the card header text
          always sits on the white surface, clearly below the green. */}
      <div className="relative z-10 mx-auto -mt-6 max-w-4xl px-4 sm:-mt-8 sm:px-6">
        <SnapshotWizard />
      </div>
    </>
  );
}
