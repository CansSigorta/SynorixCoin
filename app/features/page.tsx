import { PageHeader } from "@/components/PageHeader";
import { FadeIn } from "@/components/FadeIn";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Features",
  description:
    "2.5-minute blocks, near-zero fees, on-chain treasury, dynamic difficulty, fixed supply, and SHA-256 proof of work—Synorix features explained.",
  alternates: { canonical: "/features" },
};

const items = [
  {
    title: "2.5-minute blocks",
    body: "Shorter block times mean faster inclusion in the chain—helpful for retail, payouts, and any workflow where time-to-confidence matters. Bitcoin’s 10-minute cadence remains a deliberate choice; Synorix simply targets a different tradeoff for usability.",
  },
  {
    title: "Near-zero fees",
    body: "By keeping demand and block space dynamics healthy—and by designing for efficiency—Synorix aims for fees that stay practical for small transfers, tipping, and frequent use.",
  },
  {
    title: "On-Chain Treasury",
    body: "A predefined portion of network fees is automatically routed to a transparent Treasury to fund liquidity, token buybacks & burns, and ecosystem growth.",
  },
  {
    title: "Dynamic Difficulty (DDA)",
    body: "Replaces legacy retargeting with a modern algorithm, ensuring stable 2.5-minute block generation regardless of network hashrate fluctuations.",
  },
  {
    title: "21 million fixed supply",
    body: "The same iconic scarcity as Bitcoin: a hard cap that makes the long-term issuance schedule simple to understand and easy to model.",
  },
  {
    title: "SHA-256 proof of work",
    body: "Synorix uses SHA-256 mining—aligning with a mature hardware ecosystem and a security model that has protected the world’s largest decentralized network for over a decade.",
  },
] as const;

export default function FeaturesPage() {
  return (
    <>
      <PageHeader
        title="Features"
        subtitle="The practical differences—without losing the Bitcoin-aligned foundation."
      />
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="space-y-6">
          {items.map((item, i) => (
            <FadeIn key={item.title} delay={i * 0.06}>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
                <h2 className="text-xl font-semibold text-white">{item.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">{item.body}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </>
  );
}
