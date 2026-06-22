import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Prose } from "@/components/Prose";
import { FadeIn } from "@/components/FadeIn";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Whitepaper",
  description:
    "Synorix technical whitepaper: SHA-256 Proof-of-Work, LWMA per-block difficulty, 21M fixed supply, on-chain treasury, non-custodial wallet, and an in-site AMM market.",
  alternates: { canonical: "/whitepaper" },
};

export default function WhitepaperPage() {
  return (
    <>
      <PageHeader
        eyebrow="Whitepaper"
        title="Synorix technical design"
        subtitle="The protocol, the economics, and the trade-offs — in detail and in plain language."
      />
      <Prose>
        <FadeIn className="space-y-6">
          <h2>1. Abstract</h2>
          <p>
            Synorix (SNRX) is an independent SHA-256 Proof-of-Work blockchain forked from Bitcoin Core.
            It keeps Bitcoin&apos;s sound-money fundamentals — a fixed 21,000,000 supply, real proof-of-work
            security, full transparency — while tuning the network for a fair launch and everyday use:
            a per-block difficulty algorithm, a non-custodial browser wallet, open mining, and an in-site
            market. Mainnet is live.
          </p>

          <h2>2. Consensus &amp; mining</h2>
          <p>
            Blocks are secured by <strong>SHA-256 Proof-of-Work</strong>, identical to Bitcoin&apos;s. Any
            CPU/GPU/ASIC capable of SHA-256 can mine. There is no pre-mine advantage in the protocol —
            coins are minted block by block to whoever does the work.
          </p>

          <h2>3. LWMA difficulty (the key change)</h2>
          <p>
            Bitcoin retargets difficulty every 2,016 blocks. For a small new chain that is dangerous: at
            launch the difficulty sits at the minimum for an entire retarget window, letting early miners
            mint a huge share of the supply before difficulty can respond.
          </p>
          <p>
            Synorix replaces this with <strong>LWMA-1 (Linearly Weighted Moving Average)</strong> — a
            per-block retarget that weights the most recent 90 block solve-times. Difficulty reacts to
            hashrate within a few blocks, so block spacing stays near the <strong>2.5-minute</strong>
            target no matter how much hashrate joins or leaves. The result: the supply emits on schedule
            and cannot be fast-minted, and the chain never stalls if miners drop off.
          </p>

          <h2>4. Supply &amp; emission</h2>
          <ul>
            <li><strong>Maximum supply:</strong> 21,000,000 SNRX (hard cap, enforced by consensus).</li>
            <li><strong>Initial block reward:</strong> 50 SNRX.</li>
            <li><strong>Halving:</strong> every 210,000 blocks.</li>
            <li><strong>Target block time:</strong> ~2.5 minutes (held by LWMA).</li>
          </ul>

          <h2>5. On-chain treasury</h2>
          <p>
            By consensus, <strong>5% of every block reward</strong> is paid to a transparent treasury
            address; the remaining 95% goes to the miner. Because it is on-chain, anyone can audit exactly
            what the treasury receives. It funds liquidity, ecosystem growth, and development.
          </p>

          <h2>6. Wallet &amp; addresses</h2>
          <p>
            The web wallet is <strong>non-custodial</strong>: a BIP39 seed and BIP32 HD keys are generated
            and encrypted in the user&apos;s browser (AES-256-GCM, PBKDF2). Keys never reach the server.
            Addresses use bech32 with the <span className="font-mono">snrx1…</span> prefix (P2WPKH, SegWit
            v0). Balance reads and broadcasts go through a read-only proxy to a network node.
          </p>

          <h2>7. Network</h2>
          <p>
            Nodes peer over the standard Bitcoin P2P protocol with a Synorix-specific network magic and a
            dedicated port. New nodes discover the network via DNS seeds
            (<span className="font-mono">seed.synorixcoin.com</span>) or a manual peer. A prebuilt node is
            published so anyone can run one without compiling.
          </p>

          <h2>8. In-site market</h2>
          <p>
            SNRX is priced by a <strong>constant-product (x·y=k) liquidity pool</strong>. Buyers pay USDT
            (BEP-20) and receive SNRX; the price moves with real demand. This is an independent L1, so it
            is not natively an ERC-20/BEP-20 — the market bridges USDT payments to on-chain SNRX delivery.
          </p>

          <h2>9. Security &amp; honest trade-offs</h2>
          <ul>
            <li><strong>Young-chain risk:</strong> a small network has low total hashrate, which makes it more exposed to 51% attacks until more independent miners join. More honest miners = more security.</li>
            <li><strong>Automation custody:</strong> the market&apos;s SNRX reserve is held server-side so payouts can be automatic — a deliberate trade-off, separate from user wallets which remain fully non-custodial.</li>
            <li><strong>Open source:</strong> node, wallet, and site are public so every claim here can be verified in code.</li>
          </ul>

          <h2>10. Status</h2>
          <p>
            Mainnet is live. Follow the <Link href="/roadmap">roadmap</Link> for what&apos;s next, read the{" "}
            <Link href="/litepaper">litepaper</Link> for a quick overview, or just{" "}
            <Link href="/mining">run a node</Link> and verify it yourself.
          </p>
        </FadeIn>
      </Prose>
    </>
  );
}
