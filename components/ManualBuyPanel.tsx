"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useWallet } from "@/components/WalletProvider";
import { ACTIVE_BSC, BSC_RECEIVER, BUY_PAUSED } from "@/lib/bsc";
import { GlassCard } from "@/components/ui";

type Quote = { snrx_out?: number; price: number; error?: string };
type Phase = "form" | "verifying" | "done" | "error";

function f(n: number | undefined, d = 4) {
  if (n == null || !Number.isFinite(n)) return "0";
  return n.toLocaleString("en-US", { maximumFractionDigits: d });
}

export function ManualBuyPanel() {
  const { address } = useWallet();
  const [snrxAddr, setSnrxAddr] = useState("");
  const [amount, setAmount] = useState("");
  const [txHash, setTxHash] = useState("");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [phase, setPhase] = useState<Phase>("form");
  const [msg, setMsg] = useState("");
  const [result, setResult] = useState<{ snrx: number; txid: string } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => { if (address && !snrxAddr) setSnrxAddr(address); }, [address, snrxAddr]);

  useEffect(() => {
    const a = parseFloat(amount);
    if (!(a > 0)) { setQuote(null); return; }
    let alive = true;
    const id = setTimeout(async () => {
      try {
        const r = await fetch("/api/amm", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ side: "buy", amount: a }) });
        if (alive) setQuote(await r.json());
      } catch { if (alive) setQuote(null); }
    }, 300);
    return () => { alive = false; clearTimeout(id); };
  }, [amount]);

  const copyAddr = () => { navigator.clipboard?.writeText(BSC_RECEIVER); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  const submit = useCallback(async () => {
    setMsg("");
    if (!snrxAddr.startsWith("snrx1") && !snrxAddr.startsWith("tsnrx1")) { setPhase("error"); setMsg("Enter a valid SNRX address (snrx1…)."); return; }
    if (!txHash.startsWith("0x") || txHash.length < 60) { setPhase("error"); setMsg("Paste the BSC transaction hash (0x…) from your withdrawal."); return; }
    try {
      setPhase("verifying"); setMsg("Verifying your payment on-chain and delivering SNRX…");
      await fetch("/api/buy", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ txHash, snrxAddress: snrxAddr, network: ACTIVE_BSC.key }) });
      for (let i = 0; i < 60; i++) {
        await new Promise((r) => setTimeout(r, 5000));
        const s = await fetch(`/api/buy?txHash=${txHash}`).then((r) => r.json()).catch(() => null);
        if (s?.status === "delivered") { setResult({ snrx: s.snrx, txid: s.txid }); setPhase("done"); return; }
        if (s?.status === "failed") { setPhase("error"); setMsg(s.error || "Could not verify the payment. Check the tx hash + network."); return; }
      }
      setPhase("error"); setMsg("Still confirming — your SNRX will arrive shortly once the payment confirms.");
    } catch (e: unknown) { setPhase("error"); setMsg((e as Error).message || "Failed."); }
  }, [snrxAddr, txHash]);

  if (BUY_PAUSED) {
    return (
      <GlassCard className="p-6">
        <h3 className="mb-3 text-lg font-semibold text-white">Buy with USDT from any exchange</h3>
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-center text-sm text-amber-200">
          Buying is temporarily paused while we finalize liquidity. Check back soon. ⏳
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6">
      <h3 className="mb-1 text-lg font-semibold text-white">Buy with USDT from any exchange</h3>
      <p className="mb-3 text-xs text-zinc-400">Works from Binance, Bybit, Trust Wallet — any source. Send USDT, then paste the tx hash.</p>
      <div className="mb-4 rounded-xl border border-amber-500/25 bg-amber-500/[0.06] p-3 text-[11px] leading-relaxed text-amber-200/90">
        Early stage: you can buy now, but selling back isn&apos;t available yet. Buy only what you&apos;re comfortable holding.
      </div>

      <ol className="space-y-4 text-sm">
        <li>
          <div className="mb-1 text-xs uppercase tracking-wide text-zinc-500">1 · Your SNRX address (where SNRX arrives)</div>
          <input value={snrxAddr} onChange={(e) => setSnrxAddr(e.target.value.trim())} placeholder="snrx1…"
            className="w-full rounded-xl border border-white/10 bg-synorix-ink/60 px-3 py-2 font-mono text-xs text-white outline-none focus:border-synorix-cyan/60" />
          {!address && <div className="mt-1 text-[11px] text-amber-300">No wallet? <Link href="/wallet" className="underline">Create one</Link>.</div>}
        </li>
        <li>
          <div className="mb-1 text-xs uppercase tracking-wide text-zinc-500">2 · Amount of USDT you&apos;ll send</div>
          <input inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))} placeholder="0.00"
            className="w-full rounded-xl border border-white/10 bg-synorix-ink/60 px-3 py-2 text-white outline-none focus:border-synorix-cyan/60" />
          {quote?.snrx_out ? <div className="mt-1 text-xs text-zinc-400">≈ <span className="font-semibold text-synorix-cyan">{f(quote.snrx_out, 2)} SNRX</span></div> : null}
        </li>
        <li>
          <div className="mb-1 text-xs uppercase tracking-wide text-zinc-500">3 · Send USDT to this address</div>
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/30 p-3">
            <code className="flex-1 break-all text-[11px] text-synorix-cyan">{BSC_RECEIVER}</code>
            <button onClick={copyAddr} className="shrink-0 rounded-lg border border-white/15 px-2 py-1 text-[11px] text-zinc-300">{copied ? "✓" : "Copy"}</button>
          </div>
          <div className="mt-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-2 text-[11px] text-amber-200">
            ⚠️ Network MUST be <b>BNB Smart Chain (BEP-20)</b>. Sending on Ethereum, Tron, or any other network = lost funds.
          </div>
        </li>
        <li>
          <div className="mb-1 text-xs uppercase tracking-wide text-zinc-500">4 · Paste your transaction hash</div>
          <input value={txHash} onChange={(e) => setTxHash(e.target.value.trim())} placeholder="0x…"
            className="w-full rounded-xl border border-white/10 bg-synorix-ink/60 px-3 py-2 font-mono text-xs text-white outline-none focus:border-synorix-cyan/60" />
          <div className="mt-1 text-[11px] text-zinc-500">From your exchange&apos;s withdrawal history (TxID) or wallet.</div>
        </li>
      </ol>

      <button onClick={submit} disabled={phase === "verifying"}
        className="mt-5 w-full rounded-xl bg-cyan-violet bg-[length:200%_200%] px-6 py-3 text-sm font-semibold text-synorix-ink shadow-glow transition hover:animate-gradient-pan disabled:opacity-50">
        {phase === "verifying" ? "Verifying & delivering…" : "I've paid — get my SNRX"}
      </button>

      {phase === "done" && result && (
        <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">
          ✓ {f(result.snrx, 2)} SNRX delivered to your wallet.
        </div>
      )}
      {phase === "verifying" && <div className="mt-4 rounded-xl border border-synorix-cyan/30 bg-synorix-cyan/10 p-4 text-sm text-cyan-200">{msg}</div>}
      {phase === "error" && msg && <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">{msg}</div>}
    </GlassCard>
  );
}
