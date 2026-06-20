"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useWallet } from "@/components/WalletProvider";
import { GlassCard } from "@/components/ui";

// SNRX reserve address — sold SNRX is sent here; the owner then pays USDT by hand.
const RESERVE = "snrx1qjcdmuug4h2e4ytj2m02jh84p2la4ww6z69wplu";

type Quote = { side: string; usdt_out?: number; price: number; new_price: number; error?: string };
type Phase = "idle" | "sending" | "pending" | "paid" | "error";

function f(n: number | undefined, d = 4) {
  if (n == null || !Number.isFinite(n)) return "0";
  return n.toLocaleString("en-US", { maximumFractionDigits: d });
}

export function SellPanel() {
  const { active, unlocked, send, balance } = useWallet();
  const [amount, setAmount] = useState("");
  const [bsc, setBsc] = useState("");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const a = parseFloat(amount);
    if (!(a > 0)) { setQuote(null); return; }
    let alive = true;
    const id = setTimeout(async () => {
      try {
        const r = await fetch("/api/amm", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ side: "sell", amount: a }),
        });
        if (alive) setQuote(await r.json());
      } catch { if (alive) setQuote(null); }
    }, 300);
    return () => { alive = false; clearTimeout(id); };
  }, [amount]);

  const doSell = useCallback(async () => {
    const a = parseFloat(amount);
    setMsg("");
    if (!active) { setPhase("error"); setMsg("Create or unlock your wallet first."); return; }
    if (!unlocked) { setPhase("error"); setMsg("Unlock your wallet (top-right) to send SNRX."); return; }
    if (!(a > 0)) { setPhase("error"); setMsg("Enter an amount."); return; }
    if (balance && a > balance.spendable) { setPhase("error"); setMsg("Not enough spendable SNRX."); return; }
    if (!bsc.startsWith("0x") || bsc.length < 42) { setPhase("error"); setMsg("Enter a valid BSC (0x…) address for your USDT."); return; }
    try {
      setPhase("sending"); setMsg("Sending your SNRX to the pool…");
      const { txid } = await send(RESERVE, a);
      await fetch("/api/sell", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ txid, snrx: a, bsc }),
      });
      setPhase("pending");
      setMsg("Received. The owner will send your USDT to your BSC address shortly.");
      for (let i = 0; i < 120; i++) {
        await new Promise((r) => setTimeout(r, 6000));
        const s = await fetch(`/api/sell?txid=${txid}`).then((r) => r.json()).catch(() => null);
        if (s?.status === "paid") { setPhase("paid"); return; }
      }
    } catch (e: unknown) {
      setPhase("error"); setMsg((e as Error).message || "Sell failed.");
    }
  }, [amount, bsc, active, unlocked, send, balance]);

  const busy = phase === "sending";

  return (
    <GlassCard className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Sell SNRX for USDT</h3>
        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-zinc-400">Manual payout</span>
      </div>

      <label className="mb-1 block text-xs uppercase tracking-wide text-zinc-500">You sell (SNRX)</label>
      <input inputMode="decimal" value={amount}
        onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
        placeholder="0"
        className="w-full rounded-xl border border-white/10 bg-synorix-ink/60 px-4 py-3 text-lg text-white outline-none focus:border-synorix-cyan/60" />
      {balance && <div className="mt-1 text-[11px] text-zinc-500">Spendable: {f(balance.spendable, 2)} SNRX</div>}

      <div className="my-3 text-center text-zinc-600">↓</div>

      <label className="mb-1 block text-xs uppercase tracking-wide text-zinc-500">You receive (USDT)</label>
      <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-lg font-semibold text-synorix-cyan">
        {quote?.usdt_out ? f(quote.usdt_out, 2) : "0"}
      </div>

      <label className="mb-1 mt-4 block text-xs uppercase tracking-wide text-zinc-500">Your BSC address (to receive USDT)</label>
      <input value={bsc} onChange={(e) => setBsc(e.target.value.trim())} placeholder="0x…"
        className="w-full rounded-xl border border-white/10 bg-synorix-ink/60 px-4 py-3 font-mono text-sm text-white outline-none focus:border-synorix-cyan/60" />

      <button onClick={doSell} disabled={busy || !(parseFloat(amount) > 0)}
        className="mt-5 w-full rounded-xl bg-cyan-violet bg-[length:200%_200%] px-6 py-3 text-sm font-semibold text-synorix-ink shadow-glow transition hover:animate-gradient-pan disabled:opacity-50">
        {phase === "sending" ? "Sending SNRX…" : phase === "pending" ? "Awaiting payout…" : "Sell SNRX"}
      </button>

      {phase === "paid" && (
        <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">
          ✓ Paid — USDT sent to your BSC address.
        </div>
      )}
      {phase === "pending" && (
        <div className="mt-4 rounded-xl border border-synorix-cyan/30 bg-synorix-cyan/10 p-4 text-sm text-cyan-200">{msg}</div>
      )}
      {phase === "error" && msg && (
        <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">{msg}</div>
      )}

      <p className="mt-3 text-[11px] leading-relaxed text-zinc-500">
        Selling sends your SNRX to the pool and the owner pays your USDT manually — usually quick, but
        not instant. Make sure your BSC address is correct. No wallet?{" "}
        <Link href="/wallet" className="underline">Create one</Link>.
      </p>
    </GlassCard>
  );
}
