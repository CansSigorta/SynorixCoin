"use client";

import { useCallback, useEffect, useState } from "react";
import { GlassCard } from "@/components/ui";

type Sell = { txid: string; snrx: number; bsc: string; usdt: number; status: string };

export default function AdminSellsPage() {
  const [token, setToken] = useState("");
  const [sells, setSells] = useState<Sell[]>([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = typeof window !== "undefined" ? localStorage.getItem("snrx_admin") || "" : "";
    setToken(t);
  }, []);

  const load = useCallback(async (tok: string) => {
    if (!tok) return;
    setLoading(true); setMsg("");
    try {
      const r = await fetch("/api/sell/admin", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "list", token: tok }),
      });
      const d = await r.json();
      if (Array.isArray(d)) setSells(d.slice().reverse());
      else { setMsg(d.error || "Could not load (wrong token?)"); setSells([]); }
    } catch { setMsg("Network error"); }
    finally { setLoading(false); }
  }, []);

  const saveToken = () => { localStorage.setItem("snrx_admin", token); load(token); };

  const markPaid = async (txid: string) => {
    if (!confirm("Confirm you have already sent the USDT to this seller's BSC address.")) return;
    const r = await fetch("/api/sell/admin", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "paid", token, txid }),
    });
    const d = await r.json();
    if (d.error) setMsg(d.error);
    else load(token);
  };

  useEffect(() => { if (token) load(token); }, [token, load]);

  const pending = sells.filter((s) => s.status === "pending");

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-1 text-2xl font-bold">Sell payouts — owner panel</h1>
      <p className="mb-6 text-sm text-zinc-400">
        Pending sells appear here. Send the USDT to the seller&apos;s BSC address from your own wallet,
        then mark it paid — that moves the pool price.
      </p>

      <GlassCard className="mb-6 p-4">
        <label className="mb-1 block text-xs uppercase tracking-wide text-zinc-500">Admin token</label>
        <div className="flex gap-2">
          <input value={token} onChange={(e) => setToken(e.target.value.trim())} placeholder="paste admin token"
            className="flex-1 rounded-lg border border-white/10 bg-synorix-ink/60 px-3 py-2 font-mono text-sm text-white outline-none focus:border-synorix-cyan/60" />
          <button onClick={saveToken} className="rounded-lg bg-synorix-cyan px-4 text-sm font-semibold text-synorix-ink">Load</button>
        </div>
        {msg && <div className="mt-2 text-xs text-rose-400">{msg}</div>}
      </GlassCard>

      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Pending ({pending.length})</h2>
        <button onClick={() => load(token)} className="text-xs text-zinc-400 underline">{loading ? "…" : "Refresh"}</button>
      </div>

      {pending.length === 0 ? (
        <p className="text-sm text-zinc-500">No pending sells.</p>
      ) : (
        <div className="space-y-3">
          {pending.map((s) => (
            <GlassCard key={s.txid} className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-sm">Pay <span className="font-bold text-synorix-cyan">{s.usdt.toLocaleString("en-US")} USDT</span> for {s.snrx.toLocaleString("en-US")} SNRX</div>
                  <div className="mt-1 break-all font-mono text-[11px] text-zinc-400">to {s.bsc}</div>
                  <div className="break-all font-mono text-[10px] text-zinc-600">snrx tx: {s.txid}</div>
                </div>
                <button onClick={() => markPaid(s.txid)}
                  className="rounded-lg bg-emerald-500/20 px-4 py-2 text-sm font-semibold text-emerald-300 ring-1 ring-emerald-500/40 hover:bg-emerald-500/30">
                  Mark paid
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      <p className="mt-6 text-[11px] text-zinc-500">
        Workflow: 1) verify the seller&apos;s SNRX arrived (their tx) · 2) send the USDT from your wallet to
        their BSC address · 3) click “Mark paid”. Only mark paid after you have actually sent the USDT.
      </p>
    </div>
  );
}
