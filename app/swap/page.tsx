"use client";

import { useCallback, useEffect, useState } from "react";
import { BuyPanel } from "@/components/BuyPanel";
import { GlassCard } from "@/components/ui";

type Price = { price: number; usdt_reserve: number; snrx_reserve: number; fee: number; error?: string };

function fnum(n: number, d = 6) {
  if (!Number.isFinite(n)) return "0";
  return n.toLocaleString("en-US", { maximumFractionDigits: d });
}

export default function SwapPage() {
  const [price, setPrice] = useState<Price | null>(null);

  const loadPrice = useCallback(async () => {
    try { const r = await fetch("/api/amm"); setPrice(await r.json()); } catch {}
  }, []);

  useEffect(() => { loadPrice(); const t = setInterval(loadPrice, 12000); return () => clearInterval(t); }, [loadPrice]);

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="mb-1 text-3xl font-bold">Buy SNRX</h1>
      <p className="mb-6 text-sm text-zinc-400">
        Pay with USDT from MetaMask — SNRX is delivered straight to your Synorix wallet.
      </p>

      {/* Live price */}
      <GlassCard className="mb-4 p-5 text-center">
        <div className="text-xs uppercase tracking-wide text-zinc-500">SNRX Price</div>
        <div className="mt-1 text-3xl font-extrabold">{price && !price.error ? `$${fnum(price.price, 8)}` : "…"}</div>
        {price && !price.error && (
          <div className="mt-2 text-xs text-zinc-500">
            Pool: {fnum(price.usdt_reserve, 2)} USDT · {fnum(price.snrx_reserve, 0)} SNRX
          </div>
        )}
      </GlassCard>

      {/* MetaMask buy */}
      <BuyPanel />

      <p className="mt-4 text-[11px] leading-relaxed text-zinc-500">
        Price is set by a live liquidity pool (constant product). Larger buys move the price up.
        Selling SNRX back to USDT is coming next.
      </p>
    </div>
  );
}
