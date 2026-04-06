import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Prose } from "@/components/Prose";
import { FadeIn } from "@/components/FadeIn";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Litepaper",
  description:
    "Read or download the Synorix Litepaper for a concise overview of vision, tokenomics, and roadmap.",
  alternates: { canonical: "/litepaper" },
};

export default function LitepaperPage() {
  return (
    <>
      <PageHeader
        title="Litepaper"
        subtitle="Concise Synorix overview for fast reading."
      />
      <Prose>
        <FadeIn className="space-y-6">
          <p>
            The Litepaper is the short-form introduction to Synorix. It summarizes the project vision,
            practical scaling goals, and high-level tokenomics without deep protocol detail.
          </p>

          <h2>In this document</h2>
          <ul>
            <li>Project vision and motivation</li>
            <li>Core network parameters and launch model</li>
            <li>Roadmap milestones</li>
          </ul>

          <h2>Download</h2>
          <a
            href="/docs/Synorix_Litepaper.pdf"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-full border border-synorix-cyan/35 bg-synorix-cyan/10 px-6 py-2.5 text-sm font-semibold text-synorix-cyan transition hover:border-synorix-cyan/60 hover:bg-synorix-cyan/20"
          >
            Open Litepaper PDF
          </a>

          <p>
            Need full technical details? Go to the <Link href="/whitepaper">Whitepaper page</Link>.
          </p>
        </FadeIn>
      </Prose>
    </>
  );
}
