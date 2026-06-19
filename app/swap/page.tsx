"use client";

import { useCallback, useEffect, useState } from "react";

type Price = { price: number; usdt_reserve: number; snrx_reserve: number; fee: number; error?: string };
type Quote = {
  side: "buy" | "sell";
  usdt_in?: number; snrx_out?: number; snrx_in?: number; usdt_out?: number;
  price: number; new_price: number; error?: string;
};

const card = "rounded-2xl border border-white/5 bg-white/[0.03] p-5";
const inputCls = "w-full rounded-xl border border-white/10 bg-synorix-ink/60 px-4 py-3 text-lg text-white outline-none focus:border-synorix-cyan/60";

function fnum(n: number, d = 6) {
  if (!Number.isFinite(n)) return "0";
  return n.toLocaleString("en-US", { maximumFractionDigits: d });
}

export default function SwapPage() {
  const [price, setPrice] = useState<Price | null>(null);
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(false);

  const loadPrice = useCallback(async () => {
    try { const r = await fetch("/api/amm"); setPrice(await r.json()); } catch {}
  }, []);

  useEffect(() => { loadPrice(); const t = setInterval(loadPrice, 12000); return () => clearInterval(t); }, [loadPrice]);

  useEffect(() => {
    const a = parseFloat(amount);
    if (!(a > 0)) { setQuote(null); return; }
    let alive = true; setLoading(true);
    const id = setTimeout(async () => {
      try {
        const r = await fetch("/api/amm", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ side, amount: a }) });
        const q = await r.json();
        if (alive) setQuote(q);
      } catch { if (alive) setQuote(null); }
      finally { if (alive) setLoading(false); }
    }, 350);
    return () => { alive = false; clearTimeout(id); };
  }, [amount, side]);

  const impact = quote && quote.price ? ((quote.new_price - quote.price) / quote.price) * 100 : 0;

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="mb-1 text-2xl font-bold">Buy / Sell SNRX</h1>
      <p className="mb-6 text-sm text-zinc-400">Live market price from the Synorix liquidity pool.</p>

      <div className={`${card} mb-4 text-center`}>
        <div className="text-xs uppercase tracking-wide text-zinc-500">SNRX Price</div>
        <div className="mt-1 text-3xl font-extrabold">{price ? `$${fnum(price.price, 8)}` : "…"}</div>
        {price && !price.error && (
          <div className="mt-2 text-xs text-zinc-500">Pool: {fnum(price.usdt_reserve, 2)} USDT · {fnum(price.snrx_reserve, 0)} SNRX</div>
        )}
      </div>

      <div className={card}>
        <div className="mb-4 grid grid-cols-2 gap-2 rounded-xl bg-synorix-ink/60 p-1">
          {(["buy", "sell"] as const).map((s) => (
            <button key={s} onClick={() => { setSide(s); setQuote(null); }}
              className={`rounded-lg py-2 text-sm font-semibold capitalize transition ${side === s ? "bg-synorix-cyan text-synorix-ink" : "text-zinc-400 hover:text-white"}`}>
              {s === "buy" ? "Buy" : "Sell"}
            </button>
          ))}
        </div>

        <label className="mb-1.5 block text-xs font-medium text-zinc-400">{side === "buy" ? "You pay (USDT)" : "You sell (SNRX)"}</label>
        <input className={inputCls} type="number" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" />

        <div className="mt-4 rounded-xl border border-white/10 bg-synorix-ink/40 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-400">{side === "buy" ? "You receive" : "You receive"}</span>
            <span className="font-semibold">
              {loading ? "…" : quote && !quote.error
                ? side === "buy" ? `${fnum(quote.snrx_out || 0, 4)} SNRX` : `$${fnum(quote.usdt_out || 0, 4)} USDT`
                : "—"}
            </span>
          </div>
          {quote && !quote.error && (
            <div className="mt-2 flex items-center justify-between text-xs text-zinc-500">
              <span>Price impact</span>
              <span className={Math.abs(impact) > 5 ? "text-amber-400" : ""}>{impact >= 0 ? "+" : ""}{fnum(impact, 2)}%</span>
            </div>
          )}
          {quote?.error && <div className="mt-1 text-xs text-rose-400">{quote.error}</div>}
        </div>

        <button className="mt-4 w-full rounded-xl bg-synorix-cyan py-3 text-sm font-semibold text-synorix-ink opacity-60" disabled>
          One-click swap — coming soon
        </button>
        <p className="mt-3 text-[11px] leading-relaxed text-zinc-500">
          The price and quotes above are live from the Synorix pool. Automated one-click execution
          (send USDT, receive SNRX in your wallet) is being finalized and tested on testnet first.
          For now, this is the live price + swap calculator.
        </p>
      </div>
    </div>
  );
}
