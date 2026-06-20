"use client";

import { useCallback, useEffect, useState } from "react";
import { BuyPanel } from "@/components/BuyPanel";
import { SellPanel } from "@/components/SellPanel";
import { GlassCard } from "@/components/ui";

type Price = { price: number; error?: string };

function fnum(n: number, d = 6) {
  if (!Number.isFinite(n)) return "0";
  return n.toLocaleString("en-US", { maximumFractionDigits: d });
}

export default function SwapPage() {
  const [price, setPrice] = useState<Price | null>(null);
  const [side, setSide] = useState<"buy" | "sell">("buy");

  const loadPrice = useCallback(async () => {
    try { const r = await fetch("/api/amm"); setPrice(await r.json()); } catch {}
  }, []);

  useEffect(() => { loadPrice(); const t = setInterval(loadPrice, 12000); return () => clearInterval(t); }, [loadPrice]);

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="mb-1 text-3xl font-bold">Trade SNRX</h1>
      <p className="mb-6 text-sm text-zinc-400">
        Buy with USDT from MetaMask, or sell your SNRX back for USDT.
      </p>

      <GlassCard className="mb-4 p-5 text-center">
        <div className="text-xs uppercase tracking-wide text-zinc-500">SNRX Price</div>
        <div className="mt-1 text-3xl font-extrabold">{price && !price.error ? `$${fnum(price.price, 6)}` : "…"}</div>
        <div className="mt-2 text-xs text-zinc-500">Live market price · moves with demand</div>
      </GlassCard>

      <div className="mb-4 grid grid-cols-2 gap-2 rounded-xl bg-synorix-ink/60 p-1">
        {(["buy", "sell"] as const).map((s) => (
          <button key={s} onClick={() => setSide(s)}
            className={`rounded-lg py-2 text-sm font-semibold capitalize transition ${side === s ? "bg-synorix-cyan text-synorix-ink" : "text-zinc-400 hover:text-white"}`}>
            {s}
          </button>
        ))}
      </div>

      {side === "buy" ? <BuyPanel /> : <SellPanel />}

      <p className="mt-4 text-[11px] leading-relaxed text-zinc-500">
        Price is set by a live liquidity pool — larger trades move it more. Buys are instant; sell payouts
        are sent by the owner manually.
      </p>
    </div>
  );
}
