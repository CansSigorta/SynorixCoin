"use client";

import { useEffect, useState } from "react";

type Pt = { t: number; p: number };

export function PriceChart() {
  const [data, setData] = useState<Pt[] | null>(null);

  useEffect(() => {
    const load = () =>
      fetch("/api/amm?history=1")
        .then((r) => r.json())
        .then((d) => setData(Array.isArray(d) ? d : []))
        .catch(() => setData([]));
    load();
    const id = setInterval(load, 60000);
    return () => clearInterval(id);
  }, []);

  if (data === null) return null;

  const W = 600, H = 140, pad = 6;

  if (data.length < 2) {
    return (
      <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
        <div className="text-xs uppercase tracking-wide text-zinc-500">Price history</div>
        <div className="mt-3 flex h-24 items-center justify-center text-center text-xs text-zinc-500">
          The chart fills in as the market trades. It&apos;s flat until buys &amp; sells move the price.
        </div>
      </div>
    );
  }

  const prices = data.map((d) => d.p);
  const min = Math.min(...prices), max = Math.max(...prices);
  const span = max - min || max || 1;
  const n = data.length;
  const x = (i: number) => pad + (i / (n - 1)) * (W - 2 * pad);
  const y = (p: number) => max === min ? H / 2 : pad + (1 - (p - min) / span) * (H - 2 * pad);

  const line = data.map((d, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(d.p).toFixed(1)}`).join(" ");
  const area = `${line} L${x(n - 1).toFixed(1)},${H} L${x(0).toFixed(1)},${H} Z`;
  const first = prices[0], last = prices[n - 1];
  const chg = first > 0 ? ((last - first) / first) * 100 : 0;
  const up = last >= first;

  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs uppercase tracking-wide text-zinc-500">Price history</span>
        <span className={`text-xs font-semibold ${up ? "text-emerald-400" : "text-rose-400"}`}>
          {up ? "▲" : "▼"} {Math.abs(chg).toFixed(2)}%
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-32 w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="snrxfill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={up ? "#00f0ff" : "#fb7185"} stopOpacity="0.25" />
            <stop offset="100%" stopColor={up ? "#00f0ff" : "#fb7185"} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#snrxfill)" />
        <path d={line} fill="none" stroke={up ? "#00f0ff" : "#fb7185"} strokeWidth="2" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="mt-1 flex justify-between text-[11px] text-zinc-600">
        <span>${min.toFixed(6)}</span>
        <span>${max.toFixed(6)}</span>
      </div>
    </div>
  );
}
