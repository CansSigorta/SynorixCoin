import { PageHeader } from "@/components/PageHeader";
import { FadeIn } from "@/components/FadeIn";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Roadmap",
  description:
    "Synorix roadmap: mainnet is live with fair LWMA mining, a non-custodial wallet, an explorer, and an in-site market. Next: liquidity, community, and resilience.",
  alternates: { canonical: "/roadmap" },
};

const phases = [
  {
    phase: "Phase 1 — Mainnet Launch",
    status: "Live",
    items: [
      "SHA-256 Proof-of-Work mainnet — live",
      "LWMA per-block difficulty (fair launch, no fast-minting)",
      "Non-custodial web wallet (keys stay in your browser)",
      "Open mining: prebuilt node + DNS seed auto-discovery",
      "Public block explorer",
      "In-site market (buy with USDT, manual sell)",
      "Open-source node, wallet & site",
    ],
  },
  {
    phase: "Phase 2 — Liquidity & Community",
    status: "In progress",
    items: [
      "Deepen real liquidity in the in-site market",
      "Grow the miner base — more independent nodes",
      "Backup nodes + redundancy for network resilience",
      "Community channels (Telegram / X) and clear onboarding",
      "Transparency: live supply, treasury, and emission stats",
    ],
  },
  {
    phase: "Phase 3 — Growth & Utility",
    status: "Planned",
    items: [
      "A clear, honest use case — a real reason to hold and use SNRX",
      "Broader access (DEX/CEX) explored responsibly and transparently",
      "Partnerships with aligned projects and infrastructure",
      "Community grants for open-source tooling",
      "Mobile wallet & payment tooling",
    ],
  },
] as const;

const statusColor: Record<string, string> = {
  Live: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
  "In progress": "border-synorix-cyan/40 bg-synorix-cyan/10 text-synorix-cyan",
  Planned: "border-white/10 bg-white/5 text-zinc-400",
};

export default function RoadmapPage() {
  return (
    <>
      <PageHeader
        eyebrow="Roadmap"
        title="Built in public"
        subtitle="Mainnet is live. Here's what's done, what's underway, and what's next — honestly."
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
                  <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wider ${statusColor[p.status]}`}>
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
