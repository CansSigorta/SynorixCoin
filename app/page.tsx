import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { FadeIn } from "@/components/FadeIn";
import { GlassCard, SectionHeading, CTAButton } from "@/components/ui";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Home",
  description: SITE.description,
  alternates: { canonical: "/" },
};

const actions = [
  {
    href: "/wallet",
    title: "Own a wallet",
    body: "Create a non-custodial wallet in seconds — right in your browser. 12-word seed, your keys, your coins. No app, no sign-up.",
    cta: "Open wallet",
    accent: "from-synorix-cyan/15",
  },
  {
    href: "/swap",
    title: "Buy & sell SNRX",
    body: "A live in-site market sets the price automatically from real liquidity. Buy or sell at a fair, transparent rate any time.",
    cta: "Go to market",
    accent: "from-synorix-violet/15",
  },
  {
    href: "/mining",
    title: "Mine SNRX",
    body: "SHA-256 Proof-of-Work, open to anyone. Run a node, point it at the network, and mine straight to your own address.",
    cta: "Start mining",
    accent: "from-synorix-sky/15",
  },
] as const;

const features = [
  { title: "Non-custodial by design", body: "Keys are generated and encrypted in your browser. We never see your seed, and there's nothing for us to lose or freeze." },
  { title: "Fair LWMA difficulty", body: "A per-block difficulty algorithm keeps blocks near 2.5 minutes, so no one can fast-mint the supply — emission stays on schedule." },
  { title: "21 million hard cap", body: "Fixed supply, 50 SNRX block reward halving every 210,000 blocks. Predictable scarcity you can verify on-chain." },
  { title: "SHA-256 Proof-of-Work", body: "The same battle-tested mining algorithm as Bitcoin. Real work secures every block — no pre-mine advantage." },
  { title: "Live in-site market", body: "A constant-product liquidity pool prices SNRX automatically. The more demand, the higher the price — math, not promises." },
  { title: "Open source", body: "Node, wallet, and site are all public. Anyone can read the code, run a node, and verify exactly how Synorix works." },
] as const;

const steps = [
  { n: "01", title: "Create your wallet", body: "Generate a wallet on the site and back up your 12 words. Your snrx1 address is ready instantly." },
  { n: "02", title: "Get SNRX", body: "Buy from the in-site market with USDT, or mine it yourself with a node. Coins land in your wallet." },
  { n: "03", title: "Send & use", body: "Move SNRX to anyone, anywhere, for near-zero fees. Confirmations in minutes, fully on-chain." },
] as const;

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* What you can do */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <FadeIn>
          <SectionHeading
            eyebrow="Everything in one place"
            title={<>Own it. Trade it. <span className="text-gradient-iris">Mine it.</span></>}
            subtitle="Synorix isn't a token on someone else's chain — it's an independent network with the tools to use it built right in."
          />
        </FadeIn>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {actions.map((a, i) => (
            <FadeIn key={a.title} delay={i * 0.08}>
              <GlassCard hover className="flex h-full flex-col p-6">
                <div className={`mb-5 h-12 w-12 rounded-xl bg-gradient-to-br ${a.accent} to-transparent ring-1 ring-white/10`} />
                <h3 className="text-xl font-semibold text-white">{a.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-400">{a.body}</p>
                <div className="mt-6">
                  <CTAButton href={a.href} variant="ghost" className="w-full">{a.cta} →</CTAButton>
                </div>
              </GlassCard>
            </FadeIn>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6"><div className="hairline" /></div>

      {/* Why Synorix */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <FadeIn>
          <SectionHeading eyebrow="Why Synorix" title="Sound money, made usable" />
        </FadeIn>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <FadeIn key={f.title} delay={i * 0.05}>
              <div className="group h-full rounded-2xl border border-white/8 bg-white/[0.02] p-6 transition hover:border-synorix-cyan/30 hover:bg-white/[0.04]">
                <div className="mb-3 h-px w-10 bg-gradient-to-r from-synorix-cyan to-transparent transition-all group-hover:w-16" />
                <h3 className="text-lg font-semibold text-white">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{f.body}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-white/5 bg-white/[0.015] py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <FadeIn>
            <SectionHeading eyebrow="How it works" title="From zero to on-chain in three steps" center />
          </FadeIn>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {steps.map((s, i) => (
              <FadeIn key={s.n} delay={i * 0.1}>
                <div className="relative">
                  <div className="font-mono text-5xl font-bold text-white/10">{s.n}</div>
                  <h3 className="mt-3 text-lg font-semibold text-white">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">{s.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Tokenomics snapshot */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <FadeIn>
            <SectionHeading
              eyebrow="Tokenomics"
              title="Fixed, fair, and verifiable"
              subtitle="No pre-mine pitched to insiders, no infinite inflation. The numbers are simple and enforced by consensus."
            />
            <div className="mt-6">
              <CTAButton href="/tokenomics" variant="ghost">Full tokenomics →</CTAButton>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="grid grid-cols-2 gap-4">
              {[
                { k: "Max supply", v: "21,000,000" },
                { k: "Block reward", v: "50 SNRX" },
                { k: "Halving", v: "210,000 blocks" },
                { k: "Block time", v: "~2.5 min" },
              ].map((t) => (
                <GlassCard key={t.k} className="p-5" hover>
                  <div className="text-xs uppercase tracking-wide text-zinc-500">{t.k}</div>
                  <div className="mt-1 text-2xl font-bold text-white">{t.v}</div>
                </GlassCard>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-mesh p-10 text-center sm:p-16">
            <div className="pointer-events-none absolute inset-0 bg-hero-glow" />
            <div className="relative">
              <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
                Your keys. Your coins. <span className="text-gradient-iris">Your move.</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-zinc-400">
                Create a wallet, grab some SNRX, and join an open network that anyone can verify and everyone can use.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <CTAButton href="/wallet">Create your wallet</CTAButton>
                <CTAButton href="/mining" variant="ghost">Run a node</CTAButton>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>
    </>
  );
}
