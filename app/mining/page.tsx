import Link from "next/link";
import { MiningCalculator } from "@/components/MiningCalculator";

export const metadata = {
  title: "Mine SNRX — Synorix",
  description: "How to mine Synorix (SNRX). SHA-256 Proof-of-Work, open to everyone.",
};

const card = "rounded-2xl border border-white/5 bg-white/[0.03] p-6";
const code = "block overflow-x-auto rounded-xl border border-white/10 bg-black/40 px-4 py-3 font-mono text-sm text-synorix-cyan";

const NODE_IP = "161.97.180.76";
const P2P_PORT = "9333";
const REPO = "https://github.com/Synorixz/synorix";

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className={card}>
      <div className="mb-3 flex items-center gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-synorix-cyan/15 text-sm font-bold text-synorix-cyan">
          {n}
        </span>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="space-y-3 text-sm leading-relaxed text-zinc-300">{children}</div>
    </div>
  );
}

export default function MiningPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-1 text-3xl font-bold">Mine SNRX</h1>
      <p className="mb-6 text-zinc-400">
        Synorix is a SHA-256 Proof-of-Work coin — the same mining algorithm as Bitcoin. Anyone can run a
        node and mine. No permission needed, no premine advantage: you mine to your own address and keep it.
      </p>

      {/* Network facts */}
      <div className={`${card} mb-6`}>
        <div className="grid grid-cols-2 gap-y-3 text-sm">
          <span className="text-zinc-500">Algorithm</span><span className="text-right font-medium">SHA-256 (PoW)</span>
          <span className="text-zinc-500">Block time</span><span className="text-right font-medium">~2.5 minutes</span>
          <span className="text-zinc-500">Block reward</span><span className="text-right font-medium">50 SNRX (halves every 210,000 blocks)</span>
          <span className="text-zinc-500">Max supply</span><span className="text-right font-medium">21,000,000 SNRX</span>
          <span className="text-zinc-500">Network</span><span className="text-right font-medium">Mainnet — live</span>
        </div>
      </div>

      <div className="mb-8"><MiningCalculator /></div>

      <div className="space-y-4">
        <Step n={1} title="Get the Synorix node">
          <p>
            <span className="font-medium text-white">Easiest — download the prebuilt Linux binary</span> (no
            compiling needed):
          </p>
          <p>
            <a href={`${REPO}/releases/latest`} className="inline-block rounded-lg bg-synorix-cyan px-4 py-2 text-sm font-semibold text-synorix-ink">
              ⬇ Download node (Linux x64)
            </a>
          </p>
          <code className={code}>tar xzf synorix-mainnet-linux-x64.tar.gz &amp;&amp; cd synorix-mainnet</code>
          <p className="text-zinc-400">
            Prefer to build it yourself? Clone <a href={REPO} className="text-synorix-cyan underline">{REPO}</a>{" "}
            and compile. Either way you get <span className="font-mono text-zinc-200">synorixd</span> (node) and{" "}
            <span className="font-mono text-zinc-200">synorix-cli</span>.
          </p>
        </Step>

        <Step n={2} title="Connect to the network">
          <p>
            Create a <span className="font-mono text-zinc-200">synorix.conf</span> file in your data
            directory and point it at a live peer so your node can find the chain:
          </p>
          <code className={code}>
            addnode={NODE_IP}:{P2P_PORT}<br />
            # mainnet P2P port is {P2P_PORT}
          </code>
        </Step>

        <Step n={3} title="Start the node & sync">
          <p>Start the daemon and wait until it has downloaded the chain:</p>
          <code className={code}>./synorixd -daemon</code>
          <code className={code}>./synorix-cli getblockcount</code>
          <p className="text-zinc-400">When the block count stops rising, you are fully synced.</p>
        </Step>

        <Step n={4} title="Mine to your own address">
          <p>
            Use your Synorix wallet address (the <span className="font-mono text-zinc-200">snrx1…</span>{" "}
            address from your <Link href="/wallet" className="text-synorix-cyan underline">web wallet</Link>{" "}
            works). Built-in CPU mining:
          </p>
          <code className={code}>./synorix-cli generatetoaddress 1 &quot;snrx1your_address_here&quot; 2000000000</code>
          <p className="text-zinc-400">
            Each block you find pays the reward straight to your address. For real hashpower (GPU/ASIC),
            point a SHA-256 miner at your node&apos;s <span className="font-mono text-zinc-200">getblocktemplate</span>.
          </p>
        </Step>
      </div>

      {/* Honest note */}
      <div className="mt-6 rounded-2xl border border-amber-500/20 bg-amber-500/[0.04] p-5 text-sm leading-relaxed text-amber-200/80">
        <p className="mb-2 font-semibold text-amber-200">Honest note</p>
        <p>
          Synorix is a brand-new chain. The network is small and early — that means low difficulty (easy to
          mine now) but also that security grows only as more independent miners join. Mine because you
          believe in the project and want to help decentralize it, not because instant riches are promised.
          Value comes from a real community and real use over time — not from the code alone.
        </p>
      </div>
    </div>
  );
}
