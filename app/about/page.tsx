import { PageHeader } from "@/components/PageHeader";
import { Prose } from "@/components/Prose";
import { FadeIn } from "@/components/FadeIn";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn how Synorix (SNRX) extends Bitcoin’s proven ideas with faster blocks, minimal fees, and optional privacy—respectfully and transparently.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="About Synorix"
        subtitle="A respectful evolution—keeping what works, improving what people feel every day."
      />
      <Prose>
        <FadeIn className="space-y-6">
          <p>
            Bitcoin changed how we think about money: open, global, and governed by transparent rules
            instead of gatekeepers. Synorix exists to carry that spirit forward with parameters tuned
            for faster settlement, everyday affordability, and optional privacy when you need it.
          </p>
          <p>
            We celebrate Bitcoin’s breakthrough—sound monetary design, proof-of-work security, and a
            credibly fixed supply. Synorix is not a replacement narrative; it is a complementary path
            for users and builders who want those properties in a network optimized for usability.
          </p>
          <h2>Principles</h2>
          <ul>
            <li>
              <strong>Transparency first:</strong> consensus rules and supply schedule are clear and
              predictable—like Bitcoin, you can verify them yourself.
            </li>
            <li>
              <strong>Security through PoW:</strong> SHA-256 mining ties network security to real
              energy and hardware—proven, understandable, and globally accessible.
            </li>
            <li>
              <strong>User respect:</strong> optional privacy supports legitimate needs without
              turning away from the accountability that makes public blockchains trustworthy.
            </li>
          </ul>
          <h2>Who Synorix is for</h2>
          <p>
            Merchants who want quicker confirmations, communities that need low-fee transfers, and
            developers who value a clean, Bitcoin-aligned foundation—without compromising the ethos
            that made cryptocurrency credible in the first place.
          </p>
        </FadeIn>
      </Prose>
    </>
  );
}
