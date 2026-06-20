import { PageHeader } from "@/components/PageHeader";
import { FadeIn } from "@/components/FadeIn";
import { GlassCard, SectionHeading } from "@/components/ui";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tokenomics",
  description:
    "21 million SNRX fixed supply, 50 SNRX block reward halving every 210,000 blocks, a 5% on-chain treasury, and transparent miner-secured issuance.",
  alternates: { canonical: "/tokenomics" },
};

const stats = [
  { k: "Max supply", v: "21,000,000", h: "Hard cap, enforced by consensus" },
  { k: "Block reward", v: "50 SNRX", h: "Halves every 210,000 blocks" },
  { k: "Block time", v: "~2.5 min", h: "Held steady by LWMA difficulty" },
  { k: "Treasury", v: "5%", h: "Of each block reward, on-chain" },
] as const;

export default function TokenomicsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Tokenomics"
        title="Fixed, fair, and verifiable"
        subtitle="Simple rules anyone can audit in the protocol — no hidden inflation, no surprise mints."
      />
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s, i) => (
            <FadeIn key={s.k} delay={i * 0.05}>
              <GlassCard hover className="h-full p-5">
                <div className="text-xs uppercase tracking-wide text-zinc-500">{s.k}</div>
                <div className="mt-1 text-2xl font-bold text-white">{s.v}</div>
                <div className="mt-1 text-xs text-zinc-500">{s.h}</div>
              </GlassCard>
            </FadeIn>
          ))}
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          <FadeIn>
            <SectionHeading eyebrow="Issuance" title="A schedule you can model" />
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-zinc-400">
              <p>
                Every block mints <strong className="text-white">50 SNRX</strong> to the miner who found it.
                That reward <strong className="text-white">halves every 210,000 blocks</strong>, so issuance
                tapers predictably toward the 21,000,000 cap over many years.
              </p>
              <p>
                Because the LWMA difficulty algorithm holds block spacing near 2.5 minutes, the emission
                curve stays on schedule no matter how much hashrate joins — the supply cannot be minted
                far faster than intended.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <SectionHeading eyebrow="Treasury" title="On-chain, transparent" />
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-zinc-400">
              <p>
                <strong className="text-white">5% of every block reward</strong> is paid by consensus to a
                transparent treasury address. It exists to fund liquidity, ecosystem growth, and ongoing
                development — and because it is on-chain, anyone can watch exactly what it receives.
              </p>
              <p>
                The remaining 95% goes to miners. Issuance is miner-secured: coins are earned through real
                proof-of-work, aligning incentives with honest chain security.
              </p>
            </div>
          </FadeIn>
        </div>

        <FadeIn>
          <GlassCard className="mt-12 p-6 text-sm leading-relaxed text-zinc-400">
            <p className="font-semibold text-white">On distribution &amp; fairness</p>
            <p className="mt-2">
              Synorix relaunched its mainnet with the LWMA difficulty algorithm in place from the start,
              specifically so the early supply could not be fast-mined by a single party. Any founder or
              liquidity allocation is disclosed openly rather than hidden — fairness through transparency,
              not slogans.
            </p>
          </GlassCard>
        </FadeIn>
      </div>
    </>
  );
}
