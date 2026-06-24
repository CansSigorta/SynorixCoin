"use client";

import { useEffect, useState } from "react";

const UNITS: Record<string, number> = { "H/s": 1, "KH/s": 1e3, "MH/s": 1e6, "GH/s": 1e9, "TH/s": 1e12 };
const SPACING = 150;        // seconds per block
const MINER_REWARD = 47.5;  // SNRX to miner after the 5% treasury cut

function n(x: number, d = 2) {
  if (!Number.isFinite(x)) return "0";
  return x.toLocaleString("en-US", { maximumFractionDigits: d });
}

export function MiningCalculator() {
  const [hr, setHr] = useState("1");
  const [unit, setUnit] = useState("TH/s");
  const [netHps, setNetHps] = useState<number | null>(null);
  const [price, setPrice] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/explorer?action=network").then((r) => r.json()).then((d) => setNetHps(d.hashps ?? 0)).catch(() => {});
    fetch("/api/amm").then((r) => r.json()).then((d) => setPrice(typeof d.price === "number" ? d.price : null)).catch(() => {});
  }, []);

  const yours = (parseFloat(hr) || 0) * UNITS[unit];
  const total = (netHps || 0) + yours;
  const share = total > 0 ? yours / total : 0;
  const perDay = share * (86400 / SPACING) * MINER_REWARD;
  const usd = (snrx: number) => (price != null ? ` ($${n(snrx * price, 2)})` : "");

  const rows = [
    { k: "Per day", v: perDay },
    { k: "Per week", v: perDay * 7 },
    { k: "Per month", v: perDay * 30 },
  ];

  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-6">
      <h3 className="text-lg font-semibold text-white">Mining calculator</h3>
      <p className="mt-1 text-xs text-zinc-500">
        Estimate based on the live network hashrate ({netHps != null ? `${n(netHps / UNITS["TH/s"], 2)} TH/s` : "…"}). Real results vary with difficulty.
      </p>

      <div className="mt-4 flex gap-2">
        <input inputMode="decimal" value={hr} onChange={(e) => setHr(e.target.value.replace(/[^0-9.]/g, ""))}
          className="w-full rounded-xl border border-white/10 bg-synorix-ink/60 px-4 py-3 text-lg text-white outline-none focus:border-synorix-cyan/60" />
        <select value={unit} onChange={(e) => setUnit(e.target.value)}
          className="rounded-xl border border-white/10 bg-synorix-ink/60 px-3 text-sm text-white outline-none focus:border-synorix-cyan/60">
          {Object.keys(UNITS).map((u) => <option key={u} value={u} className="bg-synorix-ink">{u}</option>)}
        </select>
      </div>

      <div className="mt-4 space-y-2">
        {rows.map((r) => (
          <div key={r.k} className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.02] px-4 py-3">
            <span className="text-sm text-zinc-400">{r.k}</span>
            <span className="font-semibold text-synorix-cyan">{n(r.v, 2)} SNRX<span className="text-xs text-zinc-500">{usd(r.v)}</span></span>
          </div>
        ))}
      </div>

      <p className="mt-3 text-[11px] text-zinc-600">
        Your share = your hashrate ÷ total network hashrate. As more miners join, difficulty rises and per-miner rewards fall — that&apos;s the LWMA keeping emission on schedule.
      </p>
    </div>
  );
}
