"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useWallet, type SentTx } from "@/components/WalletProvider";
import { getReceived, type Received, type WalletMeta } from "@/lib/wallet-core";
import { GlassCard, CTAButton, LiveDot } from "@/components/ui";

function fmt(n: number) {
  if (!Number.isFinite(n)) return "0.00";
  const s = n.toFixed(8).replace(/0+$/, "").replace(/\.$/, "");
  const [a, b = ""] = (s.includes(".") ? s : s + ".0").split(".");
  return Number(a).toLocaleString("en-US") + "." + (b.length < 2 ? (b + "00").slice(0, 2) : b);
}
function short(s: string, n = 8) { return s && s.length > 2 * n ? `${s.slice(0, n)}…${s.slice(-n)}` : s; }
function ago(ts: number) {
  const s = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

function TxHistory({ active, sent }: { active: WalletMeta; sent: SentTx[] }) {
  const [received, setReceived] = useState<Received[] | null>(null);

  const load = useCallback(async () => {
    try { setReceived(await getReceived(active)); } catch { setReceived([]); }
  }, [active]);

  useEffect(() => { load(); const t = setInterval(load, 20000); return () => clearInterval(t); }, [load]);

  const empty = (received?.length ?? 0) === 0 && sent.length === 0;

  return (
    <GlassCard className="mt-4 p-6">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">Transaction history</h2>
      {received === null ? (
        <div className="text-sm text-zinc-500">Loading…</div>
      ) : empty ? (
        <div className="text-sm text-zinc-500">No transactions yet. Buy, mine, or receive SNRX to get started.</div>
      ) : (
        <div className="divide-y divide-white/5">
          {sent.map((t) => (
            <div key={t.txid} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <div className="text-sm font-medium text-rose-300">↗ Sent {fmt(t.amount)} SNRX</div>
                <div className="truncate font-mono text-[11px] text-zinc-500">to {short(t.to)} · {ago(t.ts)}</div>
              </div>
              <div className="shrink-0 font-mono text-[10px] text-zinc-600">{short(t.txid, 6)}</div>
            </div>
          ))}
          {received!.map((r) => (
            <div key={r.txid + r.amount} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <div className="text-sm font-medium text-emerald-300">↙ {r.coinbase ? "Mined" : "Received"} {fmt(r.amount)} SNRX</div>
                <div className="truncate font-mono text-[11px] text-zinc-500">
                  {r.coinbase && r.confs < 100 ? `maturing (${r.confs}/100)` : `${r.confs} confirmations`}
                </div>
              </div>
              <div className="shrink-0 font-mono text-[10px] text-zinc-600">{short(r.txid, 6)}</div>
            </div>
          ))}
        </div>
      )}
      <p className="mt-3 text-[11px] text-zinc-600">
        Sends are recorded on this device. Received shows your current on-chain holdings — full details in the{" "}
        <Link href="/explorer" className="underline">explorer</Link>.
      </p>
    </GlassCard>
  );
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
          <>
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

            <TxHistory active={w.active} sent={w.sent} />
          </>
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
