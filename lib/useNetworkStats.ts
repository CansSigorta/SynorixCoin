"use client";

import { useEffect, useState } from "react";

export type NetworkStats = {
  blocks: number | null;
  difficulty: number | null;
  price: number | null;
  usdtReserve: number | null;
  snrxReserve: number | null;
  /** Circulating supply estimate from height (pre–first-halving: 50/block). */
  circulating: number | null;
  online: boolean;
};

const MAX_SUPPLY = 21_000_000;
const BLOCK_REWARD = 50;
const HALVING = 210_000;

function circulatingFromHeight(h: number): number {
  let supply = 0;
  let reward = BLOCK_REWARD;
  let remaining = h;
  while (remaining > 0 && reward > 0) {
    const span = Math.min(remaining, HALVING);
    supply += span * reward;
    remaining -= span;
    reward = Math.floor((reward / 2) * 1e8) / 1e8;
  }
  return Math.min(supply, MAX_SUPPLY);
}

export function useNetworkStats(pollMs = 12000): NetworkStats {
  const [stats, setStats] = useState<NetworkStats>({
    blocks: null, difficulty: null, price: null,
    usdtReserve: null, snrxReserve: null, circulating: null, online: false,
  });

  useEffect(() => {
    let alive = true;
    const load = async () => {
      const next: NetworkStats = {
        blocks: null, difficulty: null, price: null,
        usdtReserve: null, snrxReserve: null, circulating: null, online: false,
      };
      try {
        const r = await fetch("/api/node", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ method: "getblockchaininfo", params: [] }),
        });
        const d = await r.json();
        const info = d?.result;
        if (info && typeof info.blocks === "number") {
          next.blocks = info.blocks;
          next.difficulty = info.difficulty ?? null;
          next.circulating = circulatingFromHeight(info.blocks);
          next.online = true;
        }
      } catch { /* node offline */ }
      try {
        const r = await fetch("/api/amm");
        const p = await r.json();
        if (p && typeof p.price === "number") {
          next.price = p.price;
          next.usdtReserve = p.usdt_reserve ?? null;
          next.snrxReserve = p.snrx_reserve ?? null;
        }
      } catch { /* amm offline */ }
      if (alive) setStats(next);
    };
    load();
    const t = setInterval(load, pollMs);
    return () => { alive = false; clearInterval(t); };
  }, [pollMs]);

  return stats;
}

export const SUPPLY = { MAX_SUPPLY, BLOCK_REWARD, HALVING };
