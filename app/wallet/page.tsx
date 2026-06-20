"use client";

import Link from "next/link";
import { useWallet } from "@/components/WalletProvider";
import { GlassCard, CTAButton, LiveDot } from "@/components/ui";

function fmt(n: number) {
  if (!Number.isFinite(n)) return "0.00";
  const s = n.toFixed(8).replace(/0+$/, "").replace(/\.$/, "");
  const [a, b = ""] = (s.includes(".") ? s : s + ".0").split(".");
  return Number(a).toLocaleString("en-US") + "." + (b.length < 2 ? (b + "00").slice(0, 2) : b);
}

export default function WalletPage() {
  const w = useWallet();

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-mesh opacity-60" aria-hidden />
      <div className="relative mx-auto max-w-lg px-4 py-16">
        <div className="text-center">
          <div className="ring-conic mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl p-[2px]">
            <div className="grid h-full w-full place-items-center rounded-[14px] bg-synorix-ink text-2xl font-extrabold text-white">S</div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Your Synorix Wallet</h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-zinc-400">
            Non-custodial and built into every page — open it from the top-right corner anytime.
            {w.active ? ` Connected as “${w.active.name}”.` : " Use “Connect Wallet” up top to create or restore one."}
          </p>
        </div>

        {w.active ? (
          <GlassCard className="mt-8 p-6">
            <div className="flex items-center justify-between">
              <div className="text-xs uppercase tracking-wide text-zinc-500">Balance</div>
              <span className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                <LiveDot online={w.conn === "on"} /> {w.conn === "on" ? "Synced" : "Connecting…"}
              </span>
            </div>
            <div className="mt-2 text-4xl font-extrabold tabular-nums">
              {w.balance ? fmt(w.balance.spendable) : "…"} <span className="text-xl text-synorix-cyan">SNRX</span>
            </div>
            {w.balance && w.balance.immature > 0 && (
              <div className="mt-1 text-xs text-amber-300">+{fmt(w.balance.immature)} maturing (mined coins need 100 blocks)</div>
            )}

            {w.address && (
              <div className="mt-5">
                <div className="mb-1 text-xs uppercase tracking-wide text-zinc-500">Your receive address</div>
                <code className="block break-all rounded-xl border border-white/10 bg-black/30 p-3 text-[11px] text-synorix-cyan">
                  {w.address}
                </code>
              </div>
            )}

            <div className="mt-6 grid grid-cols-2 gap-3">
              <CTAButton href="/swap" className="w-full">Buy SNRX</CTAButton>
              <CTAButton href="/mining" variant="ghost" className="w-full">Mine</CTAButton>
            </div>
          </GlassCard>
        ) : (
          <GlassCard className="mt-8 p-8 text-center">
            <p className="text-zinc-300">No wallet yet.</p>
            <p className="mt-2 text-sm text-zinc-500">
              Tap <span className="font-semibold text-white">Connect Wallet</span> in the top-right to create one in
              seconds — you’ll get a 12-word backup phrase. Your keys never leave your device.
            </p>
          </GlassCard>
        )}

        <p className="mt-6 text-center text-xs text-zinc-600">
          Lost access before? <Link href="/wallet" className="text-zinc-400 underline">Restore</Link> with your 12 words from the wallet menu.
        </p>
      </div>
    </div>
  );
}
