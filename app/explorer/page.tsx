"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCallback, useEffect, useState } from "react";
import { GlassCard, LiveDot } from "@/components/ui";

type Info = { chain: string; blocks: number; difficulty: number; network: string };
type BlockRow = { height: number; hash: string; time: number; ntx: number };

function ago(ts: number) {
  const s = Math.max(0, Math.floor(Date.now() / 1000 - ts));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}
function short(s: string, n = 10) { return s.length > 2 * n ? `${s.slice(0, n)}…${s.slice(-n)}` : s; }
function num(n: number, d = 8) { return Number.isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: d }) : "0"; }

export default function ExplorerPage() {
  const [info, setInfo] = useState<Info | null>(null);
  const [blocks, setBlocks] = useState<BlockRow[]>([]);
  const [q, setQ] = useState("");
  const [result, setResult] = useState<{ type: string; data: unknown } | null>(null);
  const [searching, setSearching] = useState(false);
  const [err, setErr] = useState("");

  const ex = useCallback(async (action: string, id?: string) => {
    const r = await fetch(`/api/explorer?action=${action}${id ? `&id=${encodeURIComponent(id)}` : ""}`);
    return r.json();
  }, []);

  const refresh = useCallback(async () => {
    try { setInfo(await ex("info")); } catch {}
    try { const b = await ex("blocks"); setBlocks(b.blocks || []); } catch {}
  }, [ex]);

  useEffect(() => { refresh(); const t = setInterval(refresh, 15000); return () => clearInterval(t); }, [refresh]);

  const search = useCallback(async (raw?: string) => {
    const query = (raw ?? q).trim();
    if (!query) return;
    setSearching(true); setErr(""); setResult(null);
    try {
      if (/^t?snrx1[a-z0-9]+$/i.test(query)) {
        setResult({ type: "address", data: await ex("address", query) });
      } else if (/^\d+$/.test(query)) {
        setResult({ type: "block", data: await ex("block", query) });
      } else if (/^[0-9a-f]{64}$/i.test(query)) {
        const blk = await ex("block", query);
        if (blk && !blk.error && blk.height !== undefined) setResult({ type: "block", data: blk });
        else setResult({ type: "tx", data: await ex("tx", query) });
      } else { setErr("Enter an address (snrx1…), a block height/hash, or a tx id."); }
    } catch (e) { setErr(String((e as Error)?.message || e)); }
    finally { setSearching(false); }
  }, [q, ex]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="mb-1 text-3xl font-bold">Explorer</h1>
      <p className="mb-6 text-sm text-zinc-400">Browse the Synorix chain — every block, transaction, and balance is public.</p>

      {/* stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <GlassCard className="p-4"><div className="text-xs uppercase tracking-wide text-zinc-500">Height</div><div className="mt-1 text-2xl font-bold tabular-nums">{info ? info.blocks.toLocaleString() : "…"}</div></GlassCard>
        <GlassCard className="p-4"><div className="text-xs uppercase tracking-wide text-zinc-500">Difficulty</div><div className="mt-1 text-2xl font-bold tabular-nums">{info ? num(info.difficulty, 3) : "…"}</div></GlassCard>
        <GlassCard className="p-4"><div className="flex items-center gap-2 text-xs uppercase tracking-wide text-zinc-500"><LiveDot online={!!info} /> Network</div><div className="mt-1 text-2xl font-bold capitalize">{info?.network || "…"}</div></GlassCard>
      </div>

      {/* search */}
      <div className="mb-2 flex gap-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && search()}
          placeholder="Search address, block, or tx id…"
          className="flex-1 rounded-xl border border-white/10 bg-synorix-ink/60 px-4 py-3 text-sm text-white outline-none focus:border-synorix-cyan/60" />
        <button onClick={() => search()} disabled={searching}
          className="rounded-xl bg-synorix-cyan px-5 text-sm font-semibold text-synorix-ink disabled:opacity-60">{searching ? "…" : "Search"}</button>
      </div>
      {err && <div className="mb-4 text-xs text-rose-400">{err}</div>}

      {/* result */}
      {result && <ResultView result={result} onOpen={(qq) => { setQ(qq); search(qq); }} />}

      {/* recent blocks */}
      <h2 className="mb-3 mt-8 text-lg font-semibold">Latest blocks</h2>
      <GlassCard className="divide-y divide-white/5">
        {blocks.length === 0 ? <div className="p-4 text-sm text-zinc-500">Loading…</div> :
          blocks.map((b) => (
            <button key={b.hash} onClick={() => { setQ(String(b.height)); search(String(b.height)); }}
              className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-white/[0.03]">
              <div>
                <div className="font-semibold text-synorix-cyan">#{b.height.toLocaleString()}</div>
                <div className="font-mono text-[11px] text-zinc-500">{short(b.hash, 12)}</div>
              </div>
              <div className="text-right text-xs text-zinc-400"><div>{b.ntx} tx</div><div className="text-zinc-600">{ago(b.time)}</div></div>
            </button>
          ))}
      </GlassCard>
    </div>
  );
}

function ResultView({ result, onOpen }: { result: { type: string; data: any }; onOpen: (q: string) => void }) {
  const d = result.data;
  if (d?.error) return <GlassCard className="p-4 text-sm text-rose-300">Not found: {String(d.error)}</GlassCard>;

  if (result.type === "address") {
    return (
      <GlassCard className="p-5">
        <div className="text-xs uppercase tracking-wide text-zinc-500">Address</div>
        <div className="mt-1 break-all font-mono text-sm text-synorix-cyan">{d.address}</div>
        <div className="mt-3 flex gap-6">
          <div><div className="text-xs text-zinc-500">Balance</div><div className="text-2xl font-bold">{num(d.balance, 4)} SNRX</div></div>
          <div><div className="text-xs text-zinc-500">UTXOs</div><div className="text-2xl font-bold">{(d.utxos?.length ?? d.txouts ?? 0).toLocaleString()}</div></div>
        </div>
      </GlassCard>
    );
  }
  if (result.type === "block") {
    const txs: any[] = d.tx || [];
    return (
      <GlassCard className="p-5">
        <div className="flex items-center justify-between"><div className="text-xs uppercase tracking-wide text-zinc-500">Block</div><div className="text-xs text-zinc-500">{ago(d.time)}</div></div>
        <div className="mt-1 text-2xl font-bold text-synorix-cyan">#{d.height?.toLocaleString()}</div>
        <div className="mt-1 break-all font-mono text-[11px] text-zinc-500">{d.hash}</div>
        <div className="mt-3 text-xs text-zinc-500">{txs.length} transaction(s)</div>
        <div className="mt-2 space-y-1">
          {txs.slice(0, 8).map((t: any) => (
            <button key={t.txid} onClick={() => onOpen(t.txid)} className="block w-full truncate text-left font-mono text-[11px] text-zinc-400 hover:text-synorix-cyan">{short(t.txid, 16)}</button>
          ))}
        </div>
      </GlassCard>
    );
  }
  if (result.type === "tx") {
    const vout: any[] = d.vout || [];
    return (
      <GlassCard className="p-5">
        <div className="text-xs uppercase tracking-wide text-zinc-500">Transaction</div>
        <div className="mt-1 break-all font-mono text-[11px] text-zinc-400">{d.txid}</div>
        <div className="mt-3 text-xs text-zinc-500">Outputs (who received what)</div>
        <div className="mt-2 space-y-1.5">
          {vout.map((o: any, i: number) => (
            <div key={i} className="flex items-center justify-between gap-3 text-sm">
              <span className="truncate font-mono text-[11px] text-zinc-300">{o.scriptPubKey?.address || "—"}</span>
              <span className="shrink-0 font-semibold text-synorix-cyan">{num(o.value, 8)} SNRX</span>
            </div>
          ))}
        </div>
      </GlassCard>
    );
  }
  return null;
}
