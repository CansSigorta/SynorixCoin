"use client";

import { useCallback, useEffect, useState } from "react";
import { GlassCard, LiveDot, SectionHeading } from "@/components/ui";

type Net = {
  blocks: number; difficulty: number; hashps: number; peers: number;
  supply: number; halving_interval: number; next_halving: number;
};

const MAX_SUPPLY = 21_000_000;
const SPACING = 150; // seconds per block

function hashrate(h: number) {
  if (!h) return "0 H/s";
  const u = ["H/s", "KH/s", "MH/s", "GH/s", "TH/s", "PH/s"];
  let i = 0;
  while (h >= 1000 && i < u.length - 1) { h /= 1000; i++; }
  return `${h.toLocaleString("en-US", { maximumFractionDigits: 2 })} ${u[i]}`;
}
function n(x: number, d = 0) { return x.toLocaleString("en-US", { maximumFractionDigits: d }); }
function dur(seconds: number) {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export default function NetworkPage() {
  const [net, setNet] = useState<Net | null>(null);
  const [price, setPrice] = useState<number | null>(null);

  const load = useCallback(async () => {
    try { setNet(await fetch("/api/explorer?action=network").then((r) => r.json())); } catch {}
    try { const p = await fetch("/api/amm").then((r) => r.json()); if (typeof p.price === "number") setPrice(p.price); } catch {}
  }, []);

  useEffect(() => { load(); const t = setInterval(load, 12000); return () => clearInterval(t); }, [load]);

  const blocksToHalving = net ? net.next_halving - net.blocks : 0;
  const halvingPct = net ? (1 - blocksToHalving / net.halving_interval) * 100 : 0;
  const supplyPct = net ? (net.supply / MAX_SUPPLY) * 100 : 0;

  const tiles = [
    { label: "Network hashrate", value: net ? hashrate(net.hashps) : "…", icon: "⚡" },
    { label: "Connected nodes", value: net ? n(net.peers + 1) : "…", icon: "🖥️", hint: "peers + this node" },
    { label: "Block height", value: net ? n(net.blocks) : "…", icon: "📦" },
    { label: "Difficulty", value: net ? n(net.difficulty, 2) : "…", icon: "🎯" },
    { label: "SNRX price", value: price != null ? `$${n(price, 6)}` : "…", icon: "💱" },
    { label: "Block time", value: "~2.5 min", icon: "⏱️", hint: "held by LWMA" },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-8 flex items-center gap-3">
        <LiveDot online={!!net} />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Network</h1>
          <p className="text-sm text-zinc-400">Live Synorix mainnet stats — updates every few seconds.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {tiles.map((t) => (
          <GlassCard key={t.label} className="p-5" hover>
            <div className="text-xs uppercase tracking-wide text-zinc-500">{t.icon} {t.label}</div>
            <div className="mt-1 text-2xl font-bold tabular-nums text-white">{t.value}</div>
            {t.hint && <div className="mt-1 text-[11px] text-zinc-600">{t.hint}</div>}
          </GlassCard>
        ))}
      </div>

      {/* Halving countdown */}
      <div className="mt-8">
        <SectionHeading eyebrow="Emission" title="Next halving" />
        <GlassCard className="mt-4 p-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-4xl font-extrabold tabular-nums text-synorix-cyan">{net ? n(blocksToHalving) : "…"}</div>
              <div className="text-sm text-zinc-400">blocks until the block reward halves (50 → 25 SNRX)</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{net ? `~${dur(blocksToHalving * SPACING)}` : "…"}</div>
              <div className="text-xs text-zinc-500">estimated</div>
            </div>
          </div>
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full bg-cyan-violet" style={{ width: `${Math.min(100, halvingPct)}%` }} />
          </div>
        </GlassCard>
      </div>

      {/* Supply */}
      <div className="mt-8">
        <SectionHeading eyebrow="Supply" title="Circulating vs. max" />
        <GlassCard className="mt-4 p-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-3xl font-extrabold tabular-nums">{net ? n(net.supply) : "…"} <span className="text-lg text-zinc-500">SNRX</span></div>
              <div className="text-sm text-zinc-400">of {n(MAX_SUPPLY)} max ({net ? supplyPct.toFixed(2) : "0"}% mined)</div>
            </div>
            <div className="text-right text-sm text-zinc-500">
              {net ? n(MAX_SUPPLY - net.supply) : "…"} SNRX left to mine
            </div>
          </div>
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full bg-cyan-violet" style={{ width: `${Math.min(100, supplyPct)}%` }} />
          </div>
        </GlassCard>
      </div>

      <p className="mt-8 text-center text-xs text-zinc-600">
        SHA-256 Proof-of-Work · LWMA difficulty · 21,000,000 fixed supply · fully on-chain &amp; verifiable
      </p>
    </div>
  );
}
