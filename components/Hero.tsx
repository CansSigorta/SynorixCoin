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

      <div className="relative mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-10 flex justify-center"
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
            href="/whitepaper"
            className="inline-flex min-w-[200px] items-center justify-center rounded-full bg-synorix-cyan px-8 py-3.5 text-sm font-semibold text-synorix-navy shadow-glow transition hover:bg-cyan-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-synorix-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-synorix-navy"
          >
            Read the whitepaper
          </Link>
          <Link
            href="/community"
            className="inline-flex min-w-[200px] items-center justify-center rounded-full border border-white/15 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:border-synorix-cyan/40 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-synorix-cyan/50"
          >
            Join the community
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
