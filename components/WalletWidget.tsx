"use client";

import { useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useWallet } from "@/components/WalletProvider";

type View = "main" | "receive" | "send" | "create" | "backup" | "restore" | "switch" | "unlock";

function fmt(n: number) {
  if (!Number.isFinite(n)) return "0.00";
  const s = n.toFixed(8).replace(/0+$/, "").replace(/\.$/, "");
  const [a, b = ""] = (s.includes(".") ? s : s + ".0").split(".");
  return Number(a).toLocaleString("en-US") + "." + (b.length < 2 ? (b + "00").slice(0, 2) : b);
}
const short = (s: string) => (s ? s.slice(0, 8) + "…" + s.slice(-6) : "");

const inp = "w-full rounded-lg border border-white/10 bg-synorix-ink/70 px-3 py-2.5 text-sm text-white outline-none focus:border-synorix-cyan/60";
const lbl = "mb-1 mt-2.5 block text-[11px] font-medium text-zinc-400";
const pbtn = "mt-3 w-full rounded-lg bg-synorix-cyan py-2.5 text-sm font-semibold text-synorix-ink transition hover:brightness-110 disabled:opacity-50";
const gbtn = "w-full rounded-lg border border-white/10 bg-white/5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10";

export function WalletWidget() {
  const w = useWallet();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>("main");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  // forms
  const [cName, setCName] = useState(""); const [cPw, setCPw] = useState(""); const [cPw2, setCPw2] = useState("");
  const [mnemonic, setMnemonic] = useState(""); const [backupOk, setBackupOk] = useState(false);
  const [rName, setRName] = useState(""); const [rPhrase, setRPhrase] = useState(""); const [rPw, setRPw] = useState("");
  const [uPw, setUPw] = useState("");
  const [sTo, setSTo] = useState(""); const [sAmt, setSAmt] = useState("");

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h);
  }, []);
  useEffect(() => { if (!open) { setView("main"); setMsg(""); } }, [open]);

  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(""), 2500); };
  const resetWallets = () => {
    if (window.confirm("This permanently erases all wallets stored in this browser. They can ONLY be recovered with their 12-word recovery phrase. Continue?")) {
      w.resetAll(); setView("main"); flash("All wallets reset — start fresh");
    }
  };
  if (!w.ready) return null;

  const label = w.active
    ? `${w.active.name} · ${w.balance ? fmt(w.balance.spendable) : "…"} SNRX`
    : "Connect Wallet";

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/10">
        <span className={`h-2 w-2 rounded-full ${w.active ? (w.conn === "on" ? "bg-emerald-400" : "bg-amber-400") : "bg-zinc-500"}`} />
        <span className="max-w-[160px] truncate">{label}</span>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-[320px] rounded-xl border border-white/10 bg-synorix-ink p-4 shadow-2xl">
          {msg && <div className="mb-2 rounded-lg bg-synorix-cyan/15 px-3 py-2 text-xs text-synorix-cyan">{msg}</div>}

          {/* no wallet */}
          {!w.active && view === "main" && (
            <div className="text-center">
              <p className="mb-3 text-xs leading-relaxed text-zinc-400">Your coins, your keys — generated and encrypted only in your browser.</p>
              <button className={pbtn} onClick={() => { setCName(""); setCPw(""); setCPw2(""); setView("create"); }}>Create Wallet</button>
              <button className={`${gbtn} mt-2`} onClick={() => { setRName(""); setRPhrase(""); setRPw(""); setView("restore"); }}>Restore</button>
            </div>
          )}

          {/* main (has wallet) */}
          {w.active && view === "main" && (
            <>
              <div className="mb-3 flex items-center justify-between">
                <button onClick={() => setView("switch")} className="rounded-full bg-white/5 px-2.5 py-1 text-xs font-semibold">{w.active.name} ▾</button>
                <button onClick={w.lock} className="text-[11px] text-zinc-500 hover:text-white">{w.unlocked ? "Lock" : "Locked"}</button>
              </div>
              <div className="mb-3 text-center">
                <div className="text-2xl font-extrabold">{w.balance ? fmt(w.balance.spendable) : "…"} <span className="text-sm text-synorix-cyan">SNRX</span></div>
                {w.balance && w.balance.immature > 0 && <div className="text-[11px] text-amber-300">+{fmt(w.balance.immature)} maturing</div>}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button className={gbtn} onClick={() => setView("receive")}>Receive</button>
                <button className={gbtn} onClick={() => { setSTo(""); setSAmt(""); setView(w.unlocked ? "send" : "unlock"); }}>Send</button>
              </div>
              <div className="mt-3 flex items-center justify-between text-[11px]">
                <button className="text-zinc-500 hover:text-zinc-300" onClick={() => { setUPw(""); setView("backup"); }}>Show recovery phrase</button>
                <button className="text-rose-400/80 hover:text-rose-300" onClick={resetWallets}>Reset</button>
              </div>
            </>
          )}

          {/* receive */}
          {view === "receive" && (
            <>
              <Head title="Receive" onBack={() => setView("main")} />
              {w.address && <div className="mx-auto mb-3 w-fit rounded-lg bg-white p-2"><QRCodeSVG value={w.address} size={140} /></div>}
              <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-synorix-ink/70 p-2">
                <code className="flex-1 break-all text-[11px] text-synorix-cyan">{w.address}</code>
                <button className="rounded bg-white/10 px-2 py-1 text-xs" onClick={() => { navigator.clipboard.writeText(w.address); flash("Copied"); }}>Copy</button>
              </div>
            </>
          )}

          {/* unlock (before send) */}
          {view === "unlock" && (
            <>
              <Head title="Unlock to send" onBack={() => setView("main")} />
              <label className={lbl}>Wallet password</label>
              <input className={inp} type="password" value={uPw} onChange={(e) => setUPw(e.target.value)} />
              <button className={pbtn} disabled={busy} onClick={async () => { setBusy(true); const ok = await w.unlock(uPw); setBusy(false); if (ok) { setUPw(""); setView("send"); } else flash("Wrong password"); }}>Unlock</button>
              <button className="mt-2 w-full text-center text-[11px] text-rose-400 hover:text-rose-300" onClick={resetWallets}>Forgot password? Reset &amp; start over</button>
            </>
          )}

          {/* send */}
          {view === "send" && (
            <>
              <Head title="Send SNRX" onBack={() => setView("main")} />
              <label className={lbl}>Recipient</label>
              <input className={inp} value={sTo} onChange={(e) => setSTo(e.target.value)} placeholder="snrx1… / tsnrx1…" />
              <label className={lbl}>Amount (SNRX)</label>
              <input className={inp} type="number" value={sAmt} onChange={(e) => setSAmt(e.target.value)} placeholder="0.00" />
              <button className={pbtn} disabled={busy} onClick={async () => {
                if (!sTo || !(parseFloat(sAmt) > 0)) { flash("Fill all fields"); return; }
                setBusy(true);
                try { const o = await w.send(sTo, parseFloat(sAmt)); flash("Sent! " + o.txid.slice(0, 8) + "…"); setSTo(""); setSAmt(""); setView("main"); }
                catch (e) { flash((e as Error).message); } finally { setBusy(false); }
              }}>{busy ? "Sending…" : "Send"}</button>
            </>
          )}

          {/* create */}
          {view === "create" && (
            <>
              <Head title="Create Wallet" onBack={() => setView("main")} />
              <label className={lbl}>Name</label><input className={inp} value={cName} onChange={(e) => setCName(e.target.value)} placeholder="Main" />
              <label className={lbl}>Password</label><input className={inp} type="password" value={cPw} onChange={(e) => setCPw(e.target.value)} placeholder="min 6 chars" />
              <label className={lbl}>Confirm password</label><input className={inp} type="password" value={cPw2} onChange={(e) => setCPw2(e.target.value)} />
              <button className={pbtn} disabled={busy} onClick={async () => {
                if (cPw.length < 6) { flash("Password ≥ 6 chars"); return; }
                if (cPw !== cPw2) { flash("Passwords don't match"); return; }
                setBusy(true);
                try { const m = await w.createWallet(cName, cPw); setMnemonic(m); setBackupOk(false); setView("backup"); }
                catch (e) { flash((e as Error).message); } finally { setBusy(false); }
              }}>{busy ? "Creating…" : "Create"}</button>
            </>
          )}

          {/* backup (show mnemonic — after create, or via password reveal) */}
          {view === "backup" && (
            mnemonic ? (
              <>
                <Head title="Recovery Phrase" onBack={() => { setMnemonic(""); setView("main"); }} />
                <p className="mb-2 text-[11px] text-zinc-400">Write these 12 words down. They are the only way to recover your wallet. Never share them.</p>
                <div className="grid grid-cols-3 gap-1.5">{mnemonic.split(" ").map((x, i) => <div key={i} className="rounded border border-white/10 bg-white/5 px-1.5 py-1.5 text-[11px]"><span className="mr-1 text-[9px] text-zinc-500">{i + 1}</span>{x}</div>)}</div>
                <button className={`${gbtn} mt-2`} onClick={() => { navigator.clipboard.writeText(mnemonic); flash("Copied"); }}>Copy</button>
                <label className="mt-2 flex cursor-pointer items-center gap-2 text-[11px] text-zinc-400"><input type="checkbox" checked={backupOk} onChange={(e) => setBackupOk(e.target.checked)} className="accent-synorix-cyan" /> I have written it down safely</label>
                <button className={pbtn} disabled={!backupOk} onClick={() => { setMnemonic(""); setView("main"); }}>Done</button>
              </>
            ) : (
              <>
                <Head title="Show Recovery Phrase" onBack={() => setView("main")} />
                <label className={lbl}>Enter password</label>
                <input className={inp} type="password" value={uPw} onChange={(e) => setUPw(e.target.value)} />
                <button className={pbtn} onClick={async () => { try { const m = await w.reveal(uPw); setMnemonic(m); setUPw(""); } catch { flash("Wrong password"); } }}>Reveal</button>
              </>
            )
          )}

          {/* restore */}
          {view === "restore" && (
            <>
              <Head title="Restore Wallet" onBack={() => setView("main")} />
              <label className={lbl}>Name</label><input className={inp} value={rName} onChange={(e) => setRName(e.target.value)} placeholder="Restored" />
              <label className={lbl}>Recovery phrase</label><textarea className={`${inp} resize-none`} rows={2} value={rPhrase} onChange={(e) => setRPhrase(e.target.value)} placeholder="word1 word2 …" />
              <label className={lbl}>New password</label><input className={inp} type="password" value={rPw} onChange={(e) => setRPw(e.target.value)} />
              <button className={pbtn} disabled={busy} onClick={async () => {
                if (rPw.length < 6) { flash("Password ≥ 6 chars"); return; }
                setBusy(true);
                try { await w.restoreWallet(rName, rPhrase, rPw); flash("Restored"); setView("main"); }
                catch (e) { flash((e as Error).message); } finally { setBusy(false); }
              }}>{busy ? "Restoring…" : "Restore"}</button>
            </>
          )}

          {/* switch */}
          {view === "switch" && (
            <>
              <Head title="Wallets" onBack={() => setView("main")} />
              <div className="flex flex-col gap-1.5">
                {w.wallets.map((x) => (
                  <button key={x.id} onClick={() => { w.switchWallet(x.id); setView("main"); }}
                    className={`flex items-center justify-between rounded-lg border px-3 py-2 text-left text-sm ${w.active?.id === x.id ? "border-synorix-cyan/40 bg-synorix-cyan/10" : "border-white/10 bg-white/5"}`}>
                    {x.name}{w.active?.id === x.id && <span className="text-synorix-cyan">✓</span>}
                  </button>
                ))}
              </div>
              <button className={`${gbtn} mt-2`} onClick={() => { setCName(""); setCPw(""); setCPw2(""); setView("create"); }}>+ New Wallet</button>
              <button className="mt-2 w-full rounded-lg border border-rose-500/30 bg-rose-500/10 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-500/20" onClick={resetWallets}>Reset all wallets</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function Head({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <button onClick={onBack} className="text-zinc-400 hover:text-white">←</button>
      <h3 className="text-sm font-bold">{title}</h3>
    </div>
  );
}
