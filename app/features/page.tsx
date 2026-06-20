import { PageHeader } from "@/components/PageHeader";
import { FadeIn } from "@/components/FadeIn";
import { GlassCard } from "@/components/ui";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Non-custodial wallet, LWMA fair difficulty, 21M fixed supply, SHA-256 PoW, a live in-site market, and open-source code — Synorix features explained.",
  alternates: { canonical: "/features" },
};

const items = [
  {
    title: "Non-custodial wallet",
    body: "Your keys are generated and encrypted in your own browser with a 12-word seed. We never see or hold them — there is nothing for anyone to freeze, lose, or seize.",
  },
  {
    title: "LWMA fair difficulty",
    body: "A per-block LWMA difficulty algorithm reacts to hashrate within a few blocks, keeping block spacing near 2.5 minutes. No one can fast-mint the supply — emission follows the schedule, not whoever shows up with the most hardware.",
  },
  {
    title: "21 million fixed supply",
    body: "The same iconic scarcity as Bitcoin: a hard cap with a 50 SNRX block reward that halves every 210,000 blocks. The full issuance curve is simple to model and verify on-chain.",
  },
  {
    title: "SHA-256 proof of work",
    body: "Synorix mines with SHA-256 — the same battle-tested algorithm that has secured the largest decentralized network for over a decade. Open to anyone, with no pre-mine advantage.",
  },
  {
    title: "Live in-site market",
    body: "A constant-product liquidity pool prices SNRX automatically. Buy with USDT from MetaMask and receive coins straight to your wallet — the price moves with real demand, not promises.",
  },
  {
    title: "Open source",
    body: "Node, wallet, and website are all public. Anyone can read the code, run a node, and verify exactly how the network behaves — trust through transparency, not marketing.",
  },
] as const;

export default function FeaturesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Features"
        title="Sound money, made usable"
        subtitle="Independent infrastructure with the tools to actually use it — without compromising on the fundamentals."
      />
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="grid gap-5 md:grid-cols-2">
          {items.map((item, i) => (
            <FadeIn key={item.title} delay={i * 0.05}>
              <GlassCard hover className="h-full p-6 sm:p-7">
                <div className="mb-4 h-1 w-12 rounded-full bg-cyan-violet" />
                <h2 className="text-lg font-semibold text-white">{item.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{item.body}</p>
              </GlassCard>
            </FadeIn>
          ))}
        </div>
      </div>
    </>
  );
}
