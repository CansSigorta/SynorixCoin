"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useWallet } from "@/components/WalletProvider";
import { ACTIVE_BSC, BSC_RECEIVER, BUY_PAUSED, connectMetaMask, ensureBscChain, hasMetaMask, payUsdt } from "@/lib/bsc";
import { GlassCard } from "@/components/ui";

type Quote = { side: string; usdt_in?: number; snrx_out?: number; price: number; new_price: number; error?: string };
type Phase = "idle" | "connecting" | "quoting" | "paying" | "verifying" | "done" | "error";

function f(n: number | undefined, d = 4) {
  if (n == null || !Number.isFinite(n)) return "0";
  return n.toLocaleString("en-US", { maximumFractionDigits: d });
}

export function BuyPanel() {
  const { address, active } = useWallet();
  const [account, setAccount] = useState<string>("");
  const [amount, setAmount] = useState("");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [msg, setMsg] = useState<string>("");
  const [result, setResult] = useState<{ snrx: number; txid: string } | null>(null);

  // Live quote
  useEffect(() => {
    const a = parseFloat(amount);
    if (!(a > 0)) { setQuote(null); return; }
    let alive = true;
    const id = setTimeout(async () => {
      try {
        const r = await fetch("/api/amm", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ side: "buy", amount: a }),
        });
        const q = await r.json();
        if (alive) setQuote(q);
      } catch { if (alive) setQuote(null); }
    }, 300);
    return () => { alive = false; clearTimeout(id); };
  }, [amount]);

  const connect = useCallback(async () => {
    setMsg(""); setPhase("connecting");
    try {
      const acc = await connectMetaMask();
      await ensureBscChain(ACTIVE_BSC);
      setAccount(acc);
      setPhase("idle");
    } catch (e: unknown) {
      setPhase("error"); setMsg((e as Error).message || "Could not connect MetaMask.");
    }
  }, []);

  const buy = useCallback(async () => {
    const a = parseFloat(amount);
    if (!(a > 0)) return;
    if (!address) { setPhase("error"); setMsg("Create a wallet first so we know where to send your SNRX."); return; }
    if (!BSC_RECEIVER) { setPhase("error"); setMsg("Buying isn't enabled yet — liquidity wallet not configured."); return; }
    setMsg(""); setResult(null);
    try {
      setPhase("paying");
      const txHash = await payUsdt(account, a, ACTIVE_BSC, BSC_RECEIVER);
      setPhase("verifying");
      setMsg("Payment sent. Confirming on-chain and delivering your SNRX…");
      // Submit to backend for verification + delivery, then poll.
      await fetch("/api/buy", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ txHash, snrxAddress: address, network: ACTIVE_BSC.key }),
      });
      // Poll status
      for (let i = 0; i < 60; i++) {
        await new Promise((r) => setTimeout(r, 5000));
        const s = await fetch(`/api/buy?txHash=${txHash}`).then((r) => r.json()).catch(() => null);
        if (s?.status === "delivered") {
          setResult({ snrx: s.snrx, txid: s.txid });
          setPhase("done");
          return;
        }
        if (s?.status === "failed") {
          setPhase("error"); setMsg(s.error || "Delivery failed. Contact support with your tx hash.");
          return;
        }
      }
      setPhase("error"); setMsg("Still confirming — your SNRX will arrive shortly. Tx: " + txHash);
    } catch (e: unknown) {
      setPhase("error"); setMsg((e as Error).message || "Payment failed.");
    }
  }, [amount, account, address]);

  const busy = phase === "connecting" || phase === "paying" || phase === "verifying";

  return (
    <GlassCard className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Buy SNRX with USDT</h3>
        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-zinc-400">
          {ACTIVE_BSC.name}
        </span>
      </div>

      <div className="mb-4 rounded-xl border border-amber-500/25 bg-amber-500/[0.06] p-3 text-[11px] leading-relaxed text-amber-200/90">
        Early stage: you can buy now, but selling back isn&apos;t available yet. Buy only what you&apos;re
        comfortable holding while the project grows.
      </div>

      {/* Amount */}
      <label className="mb-1 block text-xs uppercase tracking-wide text-zinc-500">You pay (USDT)</label>
      <input
        inputMode="decimal"
        value={amount}
        onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
        placeholder="0.00"
        className="w-full rounded-xl border border-white/10 bg-synorix-ink/60 px-4 py-3 text-lg text-white outline-none focus:border-synorix-cyan/60"
      />

      <div className="my-3 flex items-center justify-center text-zinc-600">↓</div>

      {/* You receive */}
      <label className="mb-1 block text-xs uppercase tracking-wide text-zinc-500">You receive (SNRX)</label>
      <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-lg font-semibold text-synorix-cyan">
        {quote?.snrx_out ? f(quote.snrx_out, 2) : "0"}
      </div>

      {quote && !quote.error && (
        <div className="mt-2 flex justify-between text-xs text-zinc-500">
          <span>Rate: 1 SNRX ≈ ${f(quote.price, 6)}</span>
          <span>After buy: ${f(quote.new_price, 6)}</span>
        </div>
      )}

      {/* Destination */}
      <div className="mt-4 rounded-xl border border-white/8 bg-white/[0.02] p-3">
        <div className="text-xs uppercase tracking-wide text-zinc-500">SNRX goes to your wallet</div>
        {address ? (
          <div className="mt-1 break-all font-mono text-xs text-zinc-300">{address}</div>
        ) : (
          <div className="mt-1 text-xs text-amber-300">
            No wallet yet — <Link href="/wallet" className="underline">create one</Link> first.
          </div>
        )}
      </div>

      {/* Action */}
      <div className="mt-5">
        {BUY_PAUSED ? (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-center text-sm text-amber-200">
            Buying is temporarily paused while we finalize liquidity. Check back soon. ⏳
          </div>
        ) : !hasMetaMask() ? (
          <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer"
            className="block w-full rounded-xl border border-white/15 px-6 py-3 text-center text-sm font-semibold text-white hover:border-synorix-cyan/50">
            Install MetaMask
          </a>
        ) : !account ? (
          <button onClick={connect} disabled={busy}
            className="w-full rounded-xl bg-cyan-violet bg-[length:200%_200%] px-6 py-3 text-sm font-semibold text-synorix-ink shadow-glow transition hover:animate-gradient-pan disabled:opacity-60">
            {phase === "connecting" ? "Connecting…" : "Connect MetaMask"}
          </button>
        ) : (
          <button onClick={buy} disabled={busy || !(parseFloat(amount) > 0) || !address}
            className="w-full rounded-xl bg-cyan-violet bg-[length:200%_200%] px-6 py-3 text-sm font-semibold text-synorix-ink shadow-glow transition hover:animate-gradient-pan disabled:opacity-50">
            {phase === "paying" ? "Confirm in MetaMask…" : phase === "verifying" ? "Delivering SNRX…" : `Pay ${amount || "0"} USDT`}
          </button>
        )}
        {account && (
          <div className="mt-2 text-center text-[11px] text-zinc-500">
            Connected: {account.slice(0, 6)}…{account.slice(-4)}
          </div>
        )}
      </div>

      {/* Status */}
      {phase === "done" && result && (
        <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">
          ✓ {f(result.snrx, 2)} SNRX delivered to your wallet.
          <div className="mt-1 break-all font-mono text-[11px] text-emerald-300/70">{result.txid}</div>
        </div>
      )}
      {phase === "error" && msg && (
        <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">{msg}</div>
      )}
      {phase === "verifying" && (
        <div className="mt-4 rounded-xl border border-synorix-cyan/30 bg-synorix-cyan/10 p-4 text-sm text-cyan-200">{msg}</div>
      )}
    </GlassCard>
  );
}
