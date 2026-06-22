import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Prose } from "@/components/Prose";
import { FadeIn } from "@/components/FadeIn";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Litepaper",
  description:
    "A concise overview of Synorix (SNRX): an independent SHA-256 blockchain with LWMA fair difficulty, a non-custodial wallet, open mining, and a 21M fixed supply.",
  alternates: { canonical: "/litepaper" },
};

export default function LitepaperPage() {
  return (
    <>
      <PageHeader
        eyebrow="Litepaper"
        title="Synorix in brief"
        subtitle="The short version — what Synorix is, how it works, and why it's built this way."
      />
      <Prose>
        <FadeIn className="space-y-6">
          <h2>What is Synorix?</h2>
          <p>
            Synorix (SNRX) is an <strong>independent SHA-256 Proof-of-Work blockchain</strong> — not a
            token on someone else&apos;s chain. It pairs Bitcoin&apos;s sound-money principles with the
            tools people actually need to use a coin: a non-custodial wallet built into the web, open
            mining, a live market, and a public explorer. Your keys, your coins.
          </p>

          <h2>How it works</h2>
          <ul>
            <li><strong>Consensus:</strong> SHA-256 Proof-of-Work, the same battle-tested algorithm as Bitcoin.</li>
            <li><strong>Fair difficulty (LWMA):</strong> a per-block difficulty algorithm keeps blocks near 2.5 minutes and prevents anyone from fast-minting the supply — emission follows the schedule.</li>
            <li><strong>Non-custodial wallet:</strong> keys are generated and encrypted in your browser. We never see them.</li>
            <li><strong>Open mining:</strong> download the node, connect via the DNS seed, and mine straight to your own address.</li>
            <li><strong>In-site market:</strong> a constant-product liquidity pool prices SNRX from real demand.</li>
          </ul>

          <h2>Supply &amp; economics</h2>
          <ul>
            <li><strong>Max supply:</strong> 21,000,000 SNRX (hard cap).</li>
            <li><strong>Block reward:</strong> 50 SNRX, halving every 210,000 blocks.</li>
            <li><strong>Block time:</strong> ~2.5 minutes, held steady by LWMA.</li>
            <li><strong>Treasury:</strong> 5% of each block reward, paid on-chain and transparent.</li>
          </ul>

          <h2>Status</h2>
          <p>
            <strong>Mainnet is live.</strong> The node, wallet, and website are open source — anyone can read
            the code, run a node, and verify exactly how the network behaves. See the{" "}
            <Link href="/roadmap">roadmap</Link> for what&apos;s next, or the{" "}
            <Link href="/whitepaper">whitepaper</Link> for the technical detail.
          </p>

          <h2>Get started</h2>
          <ul>
            <li><Link href="/wallet">Create a wallet</Link> — takes seconds, your keys stay with you.</li>
            <li><Link href="/mining">Mine SNRX</Link> — download the node and join the network.</li>
            <li><Link href="/explorer">Explore the chain</Link> — every block and balance is public.</li>
          </ul>
        </FadeIn>
      </Prose>
    </>
  );
}
