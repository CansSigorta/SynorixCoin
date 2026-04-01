import Link from "next/link";
import { Hero } from "@/components/Hero";
import { FadeIn } from "@/components/FadeIn";
import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Home",
  description: SITE.description,
  alternates: { canonical: "/" },
};

const highlights = [
  {
    title: "2.5-minute blocks",
    body: "Faster confirmations than Bitcoin’s 10-minute cadence—ideal for commerce and everyday flows.",
  },
  {
    title: "Near-zero fees",
    body: "Keep micropayments practical—send value without friction when the network is quiet.",
  },
  {
    title: "Optional privacy",
    body: "Choose transparency by default, with optional privacy when your situation calls for it.",
  },
  {
    title: "21 million supply",
    body: "The same hard cap philosophy as Bitcoin—predictable scarcity you can reason about.",
  },
  {
    title: "SHA-256 PoW",
    body: "Battle-tested proof of work: merge-mining friendly and aligned with proven mining hardware ecosystems.",
  },
  {
    title: "Bitcoin-aligned DNA",
    body: "We respect Bitcoin’s breakthrough. Synorix builds on those ideas with usability in mind.",
  },
] as const;

export default function HomePage() {
  return (
    <>
      <Hero />

      <section className="border-y border-white/5 bg-white/[0.02] px-4 py-6 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-8 text-center sm:justify-between sm:text-left">
          {[
            { k: "Block time", v: "2.5 min" },
            { k: "Supply cap", v: "21,000,000 SNRX" },
            { k: "Consensus", v: "SHA-256 PoW" },
            { k: "Fees", v: "Near-zero" },
          ].map((item) => (
            <div key={item.k} className="min-w-[140px]">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-synorix-cyan/80">
                {item.k}
              </p>
              <p className="mt-1 text-lg font-semibold text-white">{item.v}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Built for <span className="text-gradient-cyan">real-world</span> use
          </h2>
          <p className="mt-4 text-zinc-400">
            Synorix keeps the long-term soundness of Bitcoin’s design while tuning parameters for
            speed and accessibility—without changing the fundamentals you already trust.
          </p>
        </FadeIn>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((item, i) => (
            <FadeIn key={item.title} delay={i * 0.05}>
              <div className="group h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-synorix-cyan/30 hover:shadow-glow-sm">
                <div className="mb-3 h-px w-10 bg-gradient-to-r from-synorix-cyan to-transparent" />
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{item.body}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn className="mx-auto mt-16 max-w-2xl rounded-2xl border border-synorix-cyan/20 bg-gradient-to-br from-synorix-cyan/10 to-transparent p-8 text-center">
          <p className="text-lg font-medium text-white">
            Explore the roadmap, tokenomics, and technical outline—then join the community.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/roadmap"
              className="rounded-full border border-white/15 bg-white/5 px-6 py-2.5 text-sm font-semibold text-white transition hover:border-synorix-cyan/40"
            >
              View roadmap
            </Link>
            <Link
              href="/features"
              className="rounded-full bg-synorix-cyan px-6 py-2.5 text-sm font-semibold text-synorix-navy shadow-glow-sm transition hover:bg-cyan-300"
            >
              See all features
            </Link>
          </div>
        </FadeIn>
      </section>
    </>
  );
}
