"use client";

import { useWallet } from "@/components/WalletProvider";

function fmt(n: number) {
  if (!Number.isFinite(n)) return "0.00";
  const s = n.toFixed(8).replace(/0+$/, "").replace(/\.$/, "");
  const [a, b = ""] = (s.includes(".") ? s : s + ".0").split(".");
  return Number(a).toLocaleString("en-US") + "." + (b.length < 2 ? (b + "00").slice(0, 2) : b);
}

export default function WalletPage() {
  const w = useWallet();
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-synorix-cyan text-3xl font-extrabold text-synorix-ink">S</div>
      <h1 className="text-2xl font-bold">Your Synorix Wallet</h1>
      <p className="mt-2 text-sm leading-relaxed text-zinc-400">
        Your wallet lives in the top-right corner — available on every page, like a browser wallet.
        {w.active ? ` You're connected as “${w.active.name}”.` : " Click “Connect Wallet” up top to create or restore one."}
      </p>
      {w.active && (
        <div className="mt-8 rounded-2xl border border-white/5 bg-white/[0.03] p-6">
          <div className="text-xs uppercase tracking-wide text-zinc-500">Balance</div>
          <div className="mt-1 text-3xl font-extrabold">{w.balance ? fmt(w.balance.spendable) : "…"} <span className="text-lg text-synorix-cyan">SNRX</span></div>
          {w.balance && w.balance.immature > 0 && <div className="mt-1 text-xs text-amber-300">+{fmt(w.balance.immature)} maturing</div>}
          {w.address && <code className="mt-4 block break-all text-[11px] text-synorix-cyan">{w.address}</code>}
        </div>
      )}
    </div>
  );
}
