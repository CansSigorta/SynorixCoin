import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Prose } from "@/components/Prose";
import { FadeIn } from "@/components/FadeIn";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Whitepaper",
  description:
    "Download the official Synorix Whitepaper and Litepaper PDFs.",
  alternates: { canonical: "/whitepaper" },
};

export default function WhitepaperPage() {
  return (
    <>
      <PageHeader
        title="Whitepaper"
        subtitle="Official technical and overview documents for Synorix."
      />
      <Prose>
        <FadeIn className="space-y-6">
          <p>
            Download the latest Synorix documentation directly from this page. The Whitepaper
            covers technical architecture and economics in detail; the Litepaper is a shorter,
            faster overview.
          </p>
          <h2>What you will find</h2>
          <ul>
            <li>Whitepaper: technical design, consensus parameters, and treasury model</li>
            <li>Litepaper: high-level vision, tokenomics snapshot, and roadmap highlights</li>
            <li>Direct PDF links hosted on this site for quick access</li>
          </ul>
          <h2>Download</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <a
              href="/docs/Synorix_Whitepaper.pdf"
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-synorix-cyan/30 bg-synorix-cyan/5 p-5 transition hover:border-synorix-cyan/60 hover:bg-synorix-cyan/10"
            >
              <p className="text-sm text-zinc-400">Technical Document</p>
              <p className="mt-1 text-base font-semibold text-white">Synorix Whitepaper (PDF)</p>
              <p className="mt-3 text-sm text-synorix-cyan">Open / Download</p>
            </a>
            <a
              href="/docs/Synorix_Litepaper.pdf"
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-synorix-cyan/30 bg-synorix-cyan/5 p-5 transition hover:border-synorix-cyan/60 hover:bg-synorix-cyan/10"
            >
              <p className="text-sm text-zinc-400">Quick Overview</p>
              <p className="mt-1 text-base font-semibold text-white">Synorix Litepaper (PDF)</p>
              <p className="mt-3 text-sm text-synorix-cyan">Open / Download</p>
            </a>
          </div>
          <p>
            You can also view the <Link href="/litepaper">Litepaper page</Link> for a short summary
            and direct access.
          </p>
        </FadeIn>
      </Prose>
    </>
  );
}
