import { PageHeader } from "@/components/PageHeader";
import { FadeIn } from "@/components/FadeIn";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Roadmap",
  description:
    "Synorix development roadmap: testnet, ecosystem tooling, exchange outreach, and community programs.",
  alternates: { canonical: "/roadmap" },
};

const phases = [
  {
    phase: "Phase 1 — Foundation (Q2 2026)",
    status: "In progress",
    items: [
      "April 10: Testnet Launch",
      "Public specification and reference implementation hardening",
      "Testnet stability runs and miner onboarding documentation",
      "Block explorer and network health dashboards",
    ],
  },
  {
    phase: "Phase 2 — Ecosystem (Q3 2026)",
    status: "Planned",
    items: [
      "Mainnet Genesis & Treasury Activation",
      "Wallet integrations and hardware wallet support where applicable",
      "Developer SDKs and payment tooling for merchants",
      "Educational content that honors Bitcoin and explains Synorix clearly",
    ],
  },
  {
    phase: "Phase 3 — Adoption (2027+)",
    status: "Planned",
    items: [
      "Partnerships with aligned projects and infrastructure providers",
      "Community grants for open-source tooling",
      "Liquidity and listing discussions conducted responsibly and transparently",
    ],
  },
] as const;

export default function RoadmapPage() {
  return (
    <>
      <PageHeader
        title="Roadmap"
        subtitle="Shipping in public—milestones may shift, but priorities stay clear."
      />
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <ol className="relative space-y-10 border-l border-white/10 pl-8">
          {phases.map((p, i) => (
            <FadeIn key={p.phase} delay={i * 0.08}>
              <li className="relative">
                <span className="absolute -left-[39px] top-1 flex h-5 w-5 items-center justify-center rounded-full border border-synorix-cyan/50 bg-synorix-navy shadow-glow-sm">
                  <span className="h-2 w-2 rounded-full bg-synorix-cyan" />
                </span>
                <div className="flex flex-wrap items-baseline gap-3">
                  <h2 className="text-lg font-semibold text-white">{p.phase}</h2>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wider text-synorix-cyan/90">
                    {p.status}
                  </span>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-zinc-400">
                  {p.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-synorix-cyan/60" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </li>
            </FadeIn>
          ))}
        </ol>
      </div>
    </>
  );
}
