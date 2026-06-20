"use client";

import { motion } from "framer-motion";
import { useNetworkStats } from "@/lib/useNetworkStats";
import { CTAButton, GlassCard, LiveDot, Pill } from "@/components/ui";

function fmt(n: number | null, opts?: Intl.NumberFormatOptions) {
  if (n == null) return "—";
  return n.toLocaleString("en-US", opts);
}

export function Hero() {
  const s = useNetworkStats();

  const tiles = [
    { label: "Block height", value: fmt(s.blocks) },
    { label: "Difficulty", value: s.difficulty == null ? "—" : fmt(s.difficulty, { maximumFractionDigits: 3 }) },
    { label: "SNRX price", value: s.price == null ? "—" : `$${fmt(s.price, { maximumFractionDigits: 6 })}` },
    { label: "Circulating", value: s.circulating == null ? "—" : fmt(Math.round(s.circulating)) },
  ];

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-mesh" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-hero-glow" aria-hidden />

      <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-20 sm:px-6 sm:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <Pill className="mb-6">
            <LiveDot online={s.online} />
            {s.online ? "Mainnet live" : "Connecting…"} · SHA-256 Proof-of-Work
          </Pill>

          <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-7xl">
            The coin you can{" "}
            <span className="text-gradient-iris">actually own</span>,
            <br className="hidden sm:block" /> mine, and use.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-400">
            Synorix is an independent SHA-256 blockchain with a non-custodial wallet built
            right into the web, fair open mining, and a live in-site market. No gatekeepers —
            your keys, your coins.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <CTAButton href="/wallet">Create your wallet</CTAButton>
            <CTAButton href="/swap" variant="ghost">Buy SNRX</CTAButton>
            <CTAButton href="/mining" variant="ghost">Start mining</CTAButton>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-14"
        >
          <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-zinc-500">
            <LiveDot online={s.online} /> Live network
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {tiles.map((t) => (
              <GlassCard key={t.label} className="p-4" hover>
                <div className="text-xs uppercase tracking-wide text-zinc-500">{t.label}</div>
                <div className="mt-1 text-xl font-bold tabular-nums text-white sm:text-2xl">{t.value}</div>
              </GlassCard>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
