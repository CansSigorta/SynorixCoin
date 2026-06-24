"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import * as wallet from "@/lib/wallet-core";
import type { WalletMeta } from "@/lib/wallet-core";

type Store = { wallets: WalletMeta[]; activeId: string };
const KEY = "snrx_wallets_v1";

function load(): Store {
  if (typeof window === "undefined") return { wallets: [], activeId: "" };
  try { const s = JSON.parse(localStorage.getItem(KEY) || ""); return { wallets: s.wallets || [], activeId: s.activeId || "" }; }
  catch { return { wallets: [], activeId: "" }; }
}
function persist(s: Store) { localStorage.setItem(KEY, JSON.stringify(s)); }

export type SentTx = { txid: string; to: string; amount: number; ts: number };
const sentKey = (id: string) => `snrx_sent_${id}`;
export function loadSent(id: string): SentTx[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(sentKey(id)) || "[]"); } catch { return []; }
}
function recordSent(id: string, e: SentTx) {
  const arr = loadSent(id); arr.unshift(e);
  try { localStorage.setItem(sentKey(id), JSON.stringify(arr.slice(0, 100))); } catch {}
}

type Ctx = {
  ready: boolean;
  wallets: { id: string; name: string }[];
  active: WalletMeta | null;
  balance: { spendable: number; immature: number } | null;
  address: string;
  conn: "on" | "warn" | "off";
  unlocked: boolean;
  createWallet: (name: string, pw: string) => Promise<string>;       // returns mnemonic to back up
  restoreWallet: (name: string, mnemonic: string, pw: string) => Promise<void>;
  unlock: (pw: string) => Promise<boolean>;
  lock: () => void;
  switchWallet: (id: string) => void;
  send: (to: string, amount: number) => Promise<{ txid: string }>;
  reveal: (pw: string) => Promise<string>;
  resetAll: () => void;
  refresh: () => void;
  sent: SentTx[];
};

const WalletCtx = createContext<Ctx | null>(null);
export const useWallet = () => {
  const c = useContext(WalletCtx);
  if (!c) throw new Error("useWallet outside provider");
  return c;
};

export function WalletProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [store, setStore] = useState<Store>({ wallets: [], activeId: "" });
  const [balance, setBalance] = useState<{ spendable: number; immature: number } | null>(null);
  const [address, setAddress] = useState("");
  const [conn, setConn] = useState<"on" | "warn" | "off">("warn");
  const [sent, setSent] = useState<SentTx[]>([]);
  // in-memory unlocked passwords (session only) — MetaMask-style unlock-once
  const pwRef = useRef<Map<string, string>>(new Map());
  const [unlockedTick, setUnlockedTick] = useState(0);

  const active = store.wallets.find((w) => w.id === store.activeId) || store.wallets[0] || null;
  const unlocked = !!(active && pwRef.current.has(active.id));

  useEffect(() => { setStore(load()); setReady(true); }, []);

  const refresh = useCallback(async () => {
    const w = store.wallets.find((x) => x.id === store.activeId) || store.wallets[0];
    if (!w) { setBalance(null); setAddress(""); setSent([]); return; }
    setSent(loadSent(w.id));
    try { setAddress(wallet.firstReceiveAddress(w)); } catch {}
    try { const b = await wallet.getBalance(w); setBalance({ spendable: b.spendable, immature: b.immature }); setConn("on"); }
    catch { setConn("off"); }
  }, [store]);

  useEffect(() => {
    if (!ready || !active) return;
    refresh();
    const t = setInterval(refresh, 15000);
    return () => clearInterval(t);
  }, [ready, store.activeId, active, refresh]);

  const save = (s: Store) => { persist(s); setStore(s); };

  const ctx: Ctx = {
    ready,
    wallets: store.wallets.map((w) => ({ id: w.id, name: w.name })),
    active, balance, address, conn, unlocked, sent,
    refresh,
    createWallet: async (name, pw) => {
      const { meta, mnemonic } = await wallet.createWallet(name || "Main", pw);
      pwRef.current.set(meta.id, pw); setUnlockedTick((t) => t + 1);
      save({ wallets: [...store.wallets, meta], activeId: meta.id });
      return mnemonic;
    },
    restoreWallet: async (name, mnemonic, pw) => {
      const { meta } = await wallet.restoreWallet(name || "Restored", mnemonic, pw);
      pwRef.current.set(meta.id, pw); setUnlockedTick((t) => t + 1);
      save({ wallets: [...store.wallets, meta], activeId: meta.id });
    },
    unlock: async (pw) => {
      if (!active) return false;
      const ok = await wallet.checkPassword(active, pw);
      if (ok) { pwRef.current.set(active.id, pw); setUnlockedTick((t) => t + 1); }
      return ok;
    },
    lock: () => { pwRef.current.clear(); setUnlockedTick((t) => t + 1); },
    switchWallet: (id) => { if (store.wallets.some((w) => w.id === id)) { save({ ...store, activeId: id }); setBalance(null); } },
    send: async (to, amount) => {
      if (!active) throw new Error("No wallet");
      const pw = pwRef.current.get(active.id);
      if (!pw) throw new Error("Wallet locked");
      const out = await wallet.send(active, pw, to.trim(), amount);
      recordSent(active.id, { txid: out.txid, to: to.trim(), amount, ts: Date.now() });
      setSent(loadSent(active.id));
      refresh();
      return out;
    },
    reveal: async (pw) => {
      if (!active) throw new Error("No wallet");
      return wallet.revealMnemonic(active, pw);
    },
    resetAll: () => {
      try { localStorage.removeItem(KEY); } catch {}
      pwRef.current.clear();
      setStore({ wallets: [], activeId: "" });
      setBalance(null); setAddress("");
    },
  };

  // touch unlockedTick so consumers re-render on unlock/lock
  void unlockedTick;

  return <WalletCtx.Provider value={ctx}>{children}</WalletCtx.Provider>;
}
