import { PageHeader } from "@/components/PageHeader";
import { Prose } from "@/components/Prose";
import { FadeIn } from "@/components/FadeIn";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tokenomics",
  description:
    "21 million SNRX fixed supply, transparent issuance, and Bitcoin-aligned scarcity—Synorix tokenomics.",
  alternates: { canonical: "/tokenomics" },
};

export default function TokenomicsPage() {
  return (
    <>
      <PageHeader
        title="Tokenomics"
        subtitle="Simple rules, long-term clarity—modeled after the supply discipline the industry learned from Bitcoin."
      />
      <Prose>
        <FadeIn className="space-y-6">
          <p>
            SNRX uses a fixed maximum supply of <strong>21,000,000 coins</strong>, echoing Bitcoin’s
            scarcity framing: no hidden inflation, no surprise mints—just a schedule you can audit in
            the protocol rules.
          </p>
          <h2>Issuance</h2>
          <p>
            Initial Block Reward: 50 SNRX. To maintain the 4-year cycle with 4x faster blocks,
            halving occurs every 840,000 blocks.
          </p>
          <h2>Treasury Allocation</h2>
          <ul>
            <li>40% — Liquidity Provision</li>
            <li>30% — Buyback &amp; Burn</li>
            <li>30% — Ecosystem Grants &amp; Development</li>
          </ul>
          <h2>Fees</h2>
          <p>
            Transaction fees complement block rewards, especially as subsidies decline. Synorix is
            engineered so typical fees can remain small enough for everyday use, keeping the network
            accessible as adoption grows.
          </p>
          <h2>Distribution philosophy</h2>
          <ul>
            <li>
              <strong>Miner-secured:</strong> issuance aligns incentives with honest chain work.
            </li>
            <li>
              <strong>No premine narrative here:</strong> communicate any foundation or treasury
              allocations clearly in official docs when finalized—this page stays high-level.
            </li>
            <li>
              <strong>Community-first tooling:</strong> grants and open-source incentives should
              strengthen public goods, not gatekeep participation.
            </li>
          </ul>
          <p>
            For launch-specific allocations, unlock schedules, and exact emission math, follow the
            published specification alongside the formal whitepaper PDF.
          </p>
        </FadeIn>
      </Prose>
    </>
  );
}
