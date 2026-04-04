import { PageHeader } from "@/components/PageHeader";
import { Prose } from "@/components/Prose";
import { FadeIn } from "@/components/FadeIn";
import { SYNORIX_CORE_REPO_URL } from "@/lib/site";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Testnet",
  description:
    "Synorix Core public testnet: ports, bech32 prefix, DNS seed, and how to run synorixd / synorix-cli with -testnet.",
  alternates: { canonical: "/testnet" },
};

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-white/10 bg-black/30 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm font-medium text-zinc-300">{label}</span>
      <code className="font-mono text-sm text-synorix-cyan">{value}</code>
    </div>
  );
}

export default function TestnetPage() {
  return (
    <>
      <PageHeader
        title="Testnet"
        subtitle="Synorix Core public test network (testnet3). For development, integrations, and learning—never treat test coins as real value."
      />
      <Prose>
        <FadeIn className="space-y-6">
          <p>
            This page summarizes how to connect to the Synorix <strong className="text-zinc-200">testnet</strong>{" "}
            using <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-sm text-zinc-200">-testnet</code>{" "}
            with <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-sm text-zinc-200">synorixd</code>{" "}
            and{" "}
            <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-sm text-zinc-200">synorix-cli</code>.
            Parameters follow Bitcoin-style testnet conventions where noted.
          </p>

          <div
            className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-zinc-300 [&_strong]:text-amber-200/90"
            role="note"
          >
            <strong>Important:</strong> Testnet coins have <strong>no monetary value</strong> and must not be used
            for production or as a stand-in for real funds. They can be reset or inflated by the network at any
            time.
          </div>

          <h2>Network parameters</h2>
          <div className="space-y-3 not-prose">
            <SpecRow label="P2P port" value="18333" />
            <SpecRow
              label="RPC (default local)"
              value="127.0.0.1:18332"
            />
            <p className="text-sm text-zinc-500">
              Default RPC port is Bitcoin-compatible testnet-style <strong className="text-zinc-400">18332</strong>{" "}
              (not 18322) when running <code className="font-mono text-zinc-400">synorixd -testnet</code>.
            </p>
            <SpecRow label="Bech32 (native segwit) prefix" value="tsnrx (addresses tsnrx1…)" />
            <SpecRow label="DNS seed" value="testnet-seed.synorixcoin.com" />
          </div>

          <h2>Run a node (quick start)</h2>
          <p>
            Use a dedicated <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-sm">datadir</code> for
            testnet so it does not mix with mainnet state.
          </p>
          <pre className="not-prose overflow-x-auto rounded-xl border border-white/10 bg-black/40 p-4 font-mono text-sm leading-relaxed text-zinc-300">
            {`# Daemon (testnet)
synorixd -testnet -datadir=/path/to/synorix-testnet-data

# CLI (same datadir)
synorix-cli -testnet -datadir=/path/to/synorix-testnet-data getblockchaininfo`}
          </pre>

          <h2>Security</h2>
          <ul>
            <li>
              <strong>Do not expose RPC to the public internet.</strong> Keep{" "}
              <code className="rounded bg-white/10 px-1 py-0.5 font-mono text-xs">rpcbind</code> on{" "}
              <code className="rounded bg-white/10 px-1 py-0.5 font-mono text-xs">127.0.0.1</code> unless you fully
              understand firewall rules, authentication, and the risks of remote RPC.
            </li>
            <li>
              Testnet wallets and keys are for testing only; do not reuse testnet practices (weak passwords, open
              ports) on mainnet setups.
            </li>
          </ul>

          <h2>Source code</h2>
          <p>
            Build instructions and full node source live in the public{" "}
            <strong className="text-zinc-200">Synorix Core</strong> repository.
          </p>
          {SYNORIX_CORE_REPO_URL ? (
            <p>
              <Link href={SYNORIX_CORE_REPO_URL}>Synorix Core on GitHub</Link>
            </p>
          ) : (
            <p className="rounded-lg border border-dashed border-white/15 bg-white/[0.03] px-4 py-3 text-sm text-zinc-500">
              GitHub repository URL: add{" "}
              <code className="font-mono text-zinc-400">SYNORIX_CORE_REPO_URL</code> in{" "}
              <code className="font-mono text-zinc-400">lib/site.ts</code> when the repo is public (or open a PR
              against this site’s README with the link).
            </p>
          )}
        </FadeIn>
      </Prose>
    </>
  );
}
