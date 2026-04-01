import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Prose } from "@/components/Prose";
import { FadeIn } from "@/components/FadeIn";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Whitepaper",
  description:
    "Synorix technical overview: consensus, issuance, privacy model, and roadmap to full documentation.",
  alternates: { canonical: "/whitepaper" },
};

export default function WhitepaperPage() {
  return (
    <>
      <PageHeader
        title="Whitepaper"
        subtitle="A concise overview—full PDF release will mirror mainnet documentation."
      />
      <Prose>
        <FadeIn className="space-y-6">
          <p>
            The Synorix whitepaper presents the network’s design goals, consensus parameters, and
            security assumptions in one place. It is written to be approachable for newcomers while
            remaining precise enough for integrators and miners.
          </p>
          <h2>What you will find</h2>
          <ul>
            <li>Motivation and relationship to Bitcoin’s pioneering design</li>
            <li>Block timing, difficulty adjustment, and fee market dynamics</li>
            <li>Issuance schedule and the 21 million SNRX supply cap</li>
            <li>Optional privacy: threat model and responsible use</li>
            <li>Merge-mining considerations and SHA-256 ecosystem alignment</li>
          </ul>
          <h2>Download</h2>
          <p>
            A formal PDF will be published alongside audited specifications. For now, use this site’s{" "}
            <Link href="/features">Features</Link> and <Link href="/tokenomics">Tokenomics</Link>{" "}
            pages as the living summary.
          </p>
          <div className="rounded-2xl border border-dashed border-synorix-cyan/30 bg-synorix-cyan/5 p-6 text-center">
            <p className="text-sm text-zinc-300">
              PDF placeholder — replace with hosted asset when available.
            </p>
            <button
              type="button"
              disabled
              className="mt-4 cursor-not-allowed rounded-full bg-white/10 px-6 py-2.5 text-sm font-semibold text-zinc-500"
            >
              Download PDF (soon)
            </button>
          </div>
        </FadeIn>
      </Prose>
    </>
  );
}
