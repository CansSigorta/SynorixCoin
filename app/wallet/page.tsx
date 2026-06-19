"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { QRCodeSVG } from "qrcode.react";
import * as wallet from "@/lib/wallet-core";
import type { WalletMeta } from "@/lib/wallet-core";
import { SYNORIX_NETWORKS, ACTIVE_NETWORK } from "@/lib/synorix-net";

type Store = { wallets: WalletMeta[]; activeId: string };
const KEY = "snrx_wallets_v1";

function load(): Store {
  if (typeof window === "undefined") return { wallets: [], activeId: "" };
  try { const s = JSON.parse(localStorage.getItem(KEY) || ""); return { wallets: s.wallets || [], activeId: s.activeId || "" }; }
  catch { return { wallets: [], activeId: "" }; }
}
function save(s: Store) { localStorage.setItem(KEY, JSON.stringify(s)); }
function fmt(n: number) {
  if (!Number.isFinite(n)) return "0.00";
  const s = n.toFixed(8).replace(/0+$/, "").replace(/\.$/, "");
  const [a, b = ""] = (s.includes(".") ? s : s + ".0").split(".");
  return Number(a).toLocaleString("en-US") + "." + (b.length < 2 ? (b + "00").slice(0, 2) : b);
}

const card = "rounded-2xl border border-white/5 bg-white/[0.03] p-5";
const inputCls = "w-full rounded-xl border border-white/10 bg-synorix-ink/60 px-4 py-3 text-sm text-white outline-none focus:border-synorix-cyan/60";
const labelCls = "mb-1.5 mt-3 block text-xs font-medium text-zinc-400";
const primaryBtn = "w-full rounded-xl bg-synorix-cyan py-3 text-sm font-semibold text-synorix-ink transition hover:brightness-110 disabled:opacity-50";
const ghostBtn = "w-full rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-semibold text-white transition hover:bg-white/10";

export default function WalletPage() {
  const [store, setStore] = useState<Store>({ wallets: [], activeId: "" });
  const [ready, setReady] = useState(false);
  const [bal, setBal] = useState<{ spendable: number; immature: number } | null>(null);
  const [addr, setAddr] = useState("");
  const [conn, setConn] = useState<"on" | "warn" | "off">("warn");
  const [panel, setPanel] = useState<"" | "receive" | "send">("");
  const [modal, setModal] = useState<"" | "create" | "backup" | "restore" | "reveal" | "switch">("");
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  // form state
  const [cName, setCName] = useState(""); const [cPw, setCPw] = useState(""); const [cPw2, setCPw2] = useState("");
  const [newMnemonic, setNewMnemonic] = useState(""); const [backupOk, setBackupOk] = useState(false);
  const [rName, setRName] = useState(""); const [rPhrase, setRPhrase] = useState(""); const [rPw, setRPw] = useState("");
  const [sTo, setSTo] = useState(""); const [sAmt, setSAmt] = useState(""); const [sPw, setSPw] = useState("");
  const [revPw, setRevPw] = useState(""); const [revPhrase, setRevPhrase] = useState("");

  const notify = (msg: string, ok = true) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 3500); };
  const active = store.wallets.find((w) => w.id === store.activeId) || store.wallets[0];

  useEffect(() => { setStore(load()); setReady(true); }, []);

  const refresh = useCallback(async (meta?: WalletMeta) => {
    const w = meta || active;
    if (!w) return;
    try { setAddr(wallet.firstReceiveAddress(w)); } catch {}
    try {
      const b = await wallet.getBalance(w);
      setBal({ spendable: b.spendable, immature: b.immature }); setConn("on");
    } catch { setConn("off"); }
  }, [active]);

  useEffect(() => {
    if (!ready || !active) return;
    refresh();
    const t = setInterval(refresh, 15000);
    return () => clearInterval(t);
  }, [ready, active, refresh]);

  if (!ready) return <div className="mx-auto max-w-md px-4 py-20 text-center text-zinc-500">Loading…</div>;

  /* ---------- onboarding ---------- */
  if (!active) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <div className="flex flex-col items-center text-center">
          <div className="mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-synorix-cyan text-3xl font-extrabold text-synorix-ink">S</div>
          <h1 className="text-2xl font-bold">Synorix Wallet</h1>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">Your coins, your keys. Generated and encrypted only in your browser — no one else can touch them.</p>
          <div className="mt-8 flex w-full flex-col gap-3">
            <button className={primaryBtn} onClick={() => { setCName(""); setCPw(""); setCPw2(""); setModal("create"); }}>Create New Wallet</button>
            <button className={ghostBtn} onClick={() => { setRName(""); setRPhrase(""); setRPw(""); setModal("restore"); }}>Restore from Recovery Phrase</button>
          </div>
        </div>
        {renderModals()}
        {renderToast()}
      </div>
    );
  }

  /* ---------- wallet view ---------- */
  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <div className="mb-4 flex items-center justify-between">
        <button onClick={() => setModal("switch")} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-semibold">
          {active.name} <span className="text-xs text-zinc-500">▾</span>
        </button>
        <span className="flex items-center gap-2 text-xs text-zinc-400">
          <span className={`h-2 w-2 rounded-full ${conn === "on" ? "bg-emerald-400" : conn === "warn" ? "bg-amber-400" : "bg-rose-400"}`} />
          {SYNORIX_NETWORKS[ACTIVE_NETWORK].label}
        </span>
      </div>

      <div className={`${card} mb-4 text-center`}>
        <div className="text-4xl font-extrabold tracking-tight">{bal ? fmt(bal.spendable) : "…"} <span className="text-lg text-synorix-cyan">SNRX</span></div>
        {bal && bal.immature > 0 && <div className="mt-1 text-xs text-amber-300">+{fmt(bal.immature)} SNRX maturing</div>}
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <button className="rounded-2xl border border-white/5 bg-white/[0.03] py-4 text-sm font-semibold transition hover:border-emerald-400/40" onClick={() => setPanel(panel === "receive" ? "" : "receive")}>↓ Receive</button>
        <button className="rounded-2xl border border-white/5 bg-white/[0.03] py-4 text-sm font-semibold transition hover:border-synorix-cyan/40" onClick={() => setPanel(panel === "send" ? "" : "send")}>↑ Send</button>
      </div>

      {panel === "receive" && (
        <div className={`${card} mb-4`}>
          <h2 className="mb-3 text-sm font-semibold">Receive SNRX</h2>
          {addr && <div className="mx-auto mb-3 w-fit rounded-xl bg-white p-3"><QRCodeSVG value={addr} size={160} /></div>}
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-synorix-ink/60 px-3 py-2">
            <code className="flex-1 break-all text-xs text-synorix-cyan">{addr || "…"}</code>
            <button className="rounded-lg bg-white/10 px-2 py-1 text-xs" onClick={() => { navigator.clipboard.writeText(addr); notify("Copied"); }}>Copy</button>
          </div>
        </div>
      )}

      {panel === "send" && (
        <div className={`${card} mb-4`}>
          <h2 className="mb-1 text-sm font-semibold">Send SNRX</h2>
          <label className={labelCls}>Recipient address</label>
          <input className={inputCls} value={sTo} onChange={(e) => setSTo(e.target.value)} placeholder="snrx1… / tsnrx1…" />
          <label className={labelCls}>Amount (SNRX)</label>
          <input className={inputCls} type="number" value={sAmt} onChange={(e) => setSAmt(e.target.value)} placeholder="0.00" />
          <label className={labelCls}>Wallet password</label>
          <input className={inputCls} type="password" value={sPw} onChange={(e) => setSPw(e.target.value)} placeholder="to sign the transaction" />
          <button className={`${primaryBtn} mt-4`} disabled={busy} onClick={async () => {
            if (!sTo || !(parseFloat(sAmt) > 0) || !sPw) { notify("Fill all fields", false); return; }
            setBusy(true);
            try {
              const ok = await wallet.checkPassword(active, sPw);
              if (!ok) throw new Error("Wrong password.");
              const out = await wallet.send(active, sPw, sTo.trim(), parseFloat(sAmt));
              notify("Sent! txid " + out.txid.slice(0, 10) + "…");
              setSTo(""); setSAmt(""); setSPw(""); setPanel(""); refresh();
            } catch (e) { notify((e as Error).message, false); }
            finally { setBusy(false); }
          }}>{busy ? "Sending…" : "Send Coins"}</button>
          <p className="mt-2 text-[11px] text-zinc-500">Signed locally in your browser. Mining rewards mature after 100 blocks.</p>
        </div>
      )}

      <button className="mt-2 w-full text-center text-xs text-zinc-500 hover:text-zinc-300" onClick={() => { setRevPw(""); setRevPhrase(""); setModal("reveal"); }}>Show recovery phrase</button>

      {renderModals()}
      {renderToast()}
    </div>
  );

  /* ---------- modals ---------- */
  function renderToast() {
    if (!toast) return null;
    return <div className={`fixed right-4 top-4 z-50 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-xl ${toast.ok ? "bg-emerald-600" : "bg-rose-600"}`}>{toast.msg}</div>;
  }
  function modalShell(title: string, body: ReactNode, closable = true) {
    return (
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-synorix-ink p-6 shadow-2xl">
          <div className="mb-2 flex items-center justify-between"><h2 className="text-lg font-bold">{title}</h2>{closable && <button className="text-2xl leading-none text-zinc-500 hover:text-white" onClick={() => setModal("")}>×</button>}</div>
          {body}
        </div>
      </div>
    );
  }
  function renderModals() {
    if (modal === "create") return modalShell("Create Wallet", (
      <>
        <label className={labelCls}>Wallet name</label>
        <input className={inputCls} value={cName} onChange={(e) => setCName(e.target.value)} placeholder="e.g. Main" maxLength={30} />
        <label className={labelCls}>Password (encrypts your keys in this browser)</label>
        <input className={inputCls} type="password" value={cPw} onChange={(e) => setCPw(e.target.value)} placeholder="min 6 characters" />
        <label className={labelCls}>Confirm password</label>
        <input className={inputCls} type="password" value={cPw2} onChange={(e) => setCPw2(e.target.value)} placeholder="repeat password" />
        <button className={`${primaryBtn} mt-4`} disabled={busy} onClick={async () => {
          if (cPw.length < 6) { notify("Password must be at least 6 characters", false); return; }
          if (cPw !== cPw2) { notify("Passwords do not match", false); return; }
          setBusy(true);
          try {
            const { meta, mnemonic } = await wallet.createWallet(cName || "Main", cPw);
            const s = { wallets: [...store.wallets, meta], activeId: meta.id }; save(s); setStore(s);
            setNewMnemonic(mnemonic); setBackupOk(false); setModal("backup");
          } catch (e) { notify((e as Error).message, false); } finally { setBusy(false); }
        }}>{busy ? "Creating…" : "Create"}</button>
      </>
    ));

    if (modal === "backup") return modalShell("Your Recovery Phrase", (
      <>
        <p className="mb-3 text-xs leading-relaxed text-zinc-400">Write these 12 words down in order and keep them safe. They are the ONLY way to recover your wallet. Never share them.</p>
        <div className="grid grid-cols-3 gap-2">
          {newMnemonic.split(" ").map((w, i) => <div key={i} className="rounded-lg border border-white/10 bg-white/5 px-2 py-2 text-sm"><span className="mr-1 text-[10px] text-zinc-500">{i + 1}</span>{w}</div>)}
        </div>
        <button className={`${ghostBtn} mt-3`} onClick={() => { navigator.clipboard.writeText(newMnemonic); notify("Copied"); }}>Copy phrase</button>
        <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm text-zinc-400"><input type="checkbox" checked={backupOk} onChange={(e) => setBackupOk(e.target.checked)} className="h-4 w-4 accent-synorix-cyan" /> I have safely written down my recovery phrase</label>
        <button className={`${primaryBtn} mt-3`} disabled={!backupOk} onClick={() => { setModal(""); refresh(); notify("Wallet ready"); }}>Done</button>
      </>
    ), false);

    if (modal === "restore") return modalShell("Restore Wallet", (
      <>
        <label className={labelCls}>Wallet name</label>
        <input className={inputCls} value={rName} onChange={(e) => setRName(e.target.value)} placeholder="e.g. Recovered" maxLength={30} />
        <label className={labelCls}>Recovery phrase (12 words)</label>
        <textarea className={`${inputCls} resize-none`} rows={3} value={rPhrase} onChange={(e) => setRPhrase(e.target.value)} placeholder="word1 word2 …" />
        <label className={labelCls}>New password</label>
        <input className={inputCls} type="password" value={rPw} onChange={(e) => setRPw(e.target.value)} placeholder="min 6 characters" />
        <button className={`${primaryBtn} mt-4`} disabled={busy} onClick={async () => {
          if (rPw.length < 6) { notify("Password must be at least 6 characters", false); return; }
          setBusy(true);
          try {
            const { meta } = await wallet.restoreWallet(rName || "Restored", rPhrase, rPw);
            const s = { wallets: [...store.wallets, meta], activeId: meta.id }; save(s); setStore(s);
            setModal(""); refresh(meta); notify("Wallet restored");
          } catch (e) { notify((e as Error).message, false); } finally { setBusy(false); }
        }}>{busy ? "Restoring…" : "Restore"}</button>
      </>
    ));

    if (modal === "reveal") return modalShell("Recovery Phrase", (
      revPhrase ? (
        <>
          <div className="grid grid-cols-3 gap-2">{revPhrase.split(" ").map((w, i) => <div key={i} className="rounded-lg border border-white/10 bg-white/5 px-2 py-2 text-sm"><span className="mr-1 text-[10px] text-zinc-500">{i + 1}</span>{w}</div>)}</div>
          <button className={`${ghostBtn} mt-3`} onClick={() => { navigator.clipboard.writeText(revPhrase); notify("Copied"); }}>Copy phrase</button>
        </>
      ) : (
        <>
          <label className={labelCls}>Enter your password</label>
          <input className={inputCls} type="password" value={revPw} onChange={(e) => setRevPw(e.target.value)} placeholder="wallet password" />
          <button className={`${primaryBtn} mt-4`} onClick={async () => {
            try { const m = await wallet.revealMnemonic(active!, revPw); setRevPhrase(m); }
            catch { notify("Wrong password", false); }
          }}>Reveal</button>
        </>
      )
    ));

    if (modal === "switch") return modalShell("Wallets", (
      <>
        <div className="flex flex-col gap-2">
          {store.wallets.map((w) => (
            <button key={w.id} className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm ${w.id === active!.id ? "border-synorix-cyan/40 bg-synorix-cyan/10" : "border-white/10 bg-white/5"}`}
              onClick={() => { const s = { ...store, activeId: w.id }; save(s); setStore(s); setModal(""); setBal(null); }}>
              {w.name}{w.id === active!.id && <span className="text-synorix-cyan">✓</span>}
            </button>
          ))}
        </div>
        <button className={`${ghostBtn} mt-3`} onClick={() => { setCName(""); setCPw(""); setCPw2(""); setModal("create"); }}>+ New Wallet</button>
        <button className={`${ghostBtn} mt-2`} onClick={() => { setRName(""); setRPhrase(""); setRPw(""); setModal("restore"); }}>Restore Wallet</button>
      </>
    ));

    return null;
  }
}
