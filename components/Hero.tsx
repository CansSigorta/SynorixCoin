"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SITE } from "@/lib/site";
import { SynorixLogo } from "@/components/SynorixLogo";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-24 pt-16 sm:px-6 sm:pt-20 lg:pb-32 lg:pt-28">
      <div className="pointer-events-none absolute inset-0 bg-hero-glow" aria-hidden />
      <div className="pointer-events-none absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-synorix-cyan/5 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-80 w-80 rounded-full bg-cyan-500/5 blur-3xl" aria-hidden />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="text-center lg:text-left">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-10 flex justify-center lg:mx-0 lg:justify-start"
        >
          <div className="relative">
            <div className="absolute inset-0 animate-pulse rounded-full bg-synorix-cyan/20 blur-2xl" />
            <SynorixLogo
              decorative={false}
              priority
              className="relative h-44 max-h-[min(50vh,360px)] w-auto max-w-[min(90vw,320px)] drop-shadow-glow sm:h-52 sm:max-w-[360px]"
            />
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.5 }}
          className="mx-auto mb-4 inline-flex items-center rounded-full border border-synorix-cyan/35 bg-synorix-cyan/10 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.22em] text-synorix-cyan lg:mx-0"
        >
          Testnet Launch: April 10, 2026
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-3 font-mono text-xs uppercase tracking-[0.35em] text-synorix-cyan/90 sm:text-sm"
        >
          {SITE.ticker} · Proof of work · Fixed supply
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.55 }}
          className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl"
        >
          <span className="text-gradient-cyan">{SITE.name}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.55 }}
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400 sm:text-xl"
        >
          {SITE.tagline}. Synorix honors Bitcoin’s pioneering design—then focuses on faster
          settlement, minimal fees, and optional privacy for real-world use.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.55 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href="/testnet"
            className="inline-flex min-w-[200px] items-center justify-center rounded-full bg-synorix-cyan px-8 py-3.5 text-sm font-semibold text-synorix-navy shadow-glow transition hover:bg-cyan-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-synorix-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-synorix-navy"
          >
            Download Testnet Wallet
          </Link>
          <Link
            href="/whitepaper"
            className="inline-flex min-w-[200px] items-center justify-center rounded-full border border-white/15 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:border-synorix-cyan/40 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-synorix-cyan/50"
          >
            Read Whitepaper
          </Link>
        </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.55 }}
          className="mx-auto w-full max-w-xl"
        >
          <div className="rounded-2xl border border-dashed border-synorix-cyan/30 bg-white/[0.03] p-5 shadow-glow-sm">
            <div className="aspect-[16/10] w-full rounded-xl border border-white/10 bg-black/40 p-4">
              <div className="flex h-full items-center justify-center rounded-lg border border-white/10 bg-gradient-to-br from-synorix-cyan/5 to-transparent text-center">
                <p className="px-6 text-sm text-zinc-400">
                  Electron Desktop Wallet Mockup Placeholder
                  <span className="mt-2 block font-mono text-xs text-zinc-500">
                    Replace with screenshot image asset
                  </span>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
