import { PageHeader } from "@/components/PageHeader";
import { FadeIn } from "@/components/FadeIn";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community",
  description:
    "Join the Synorix (SNRX) community—discussion, developer updates, and education—centered on constructive collaboration.",
  alternates: { canonical: "/community" },
};

const links = [
  {
    name: "Official website",
    href: "https://synorixcoin.com",
    detail: "Primary hub for announcements and resources.",
  },
  {
    name: "Developer discussion",
    href: "#",
    detail: "Placeholder — add forum or GitHub discussions URL when live.",
  },
  {
    name: "Social updates",
    href: "#",
    detail: "Placeholder — add X/Telegram/Discord links when official accounts are published.",
  },
] as const;

export default function CommunityPage() {
  return (
    <>
      <PageHeader
        title="Community"
        subtitle="Build in the open—respectful, curious, and focused on shipping useful tools."
      />
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <FadeIn>
          <p className="text-center text-lg leading-relaxed text-zinc-400">
            Whether you mine, integrate wallets, or simply want to learn, you’re welcome. Synorix
            grows best when Bitcoin’s lessons are treated as a shared foundation—not a dividing line.
          </p>
        </FadeIn>
        <ul className="mt-12 space-y-4">
          {links.map((l, i) => (
            <FadeIn key={l.name} delay={i * 0.06}>
              <li>
                <a
                  href={l.href}
                  className="group block rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-synorix-cyan/35 hover:shadow-glow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold text-white group-hover:text-synorix-cyan">
                        {l.name}
                      </h2>
                      <p className="mt-2 text-sm text-zinc-400">{l.detail}</p>
                    </div>
                    <span
                      className="mt-1 font-mono text-synorix-cyan/80 opacity-0 transition group-hover:opacity-100"
                      aria-hidden
                    >
                      →
                    </span>
                  </div>
                </a>
              </li>
            </FadeIn>
          ))}
        </ul>
        <FadeIn className="mt-12 rounded-2xl border border-white/10 bg-black/30 p-6 text-center">
          <p className="text-sm text-zinc-400">
            Replace placeholder links with official endpoints before marketing campaigns. Until then,
            bookmark <span className="font-mono text-synorix-cyan/90">synorixcoin.com</span> as the
            source of truth.
          </p>
        </FadeIn>
      </div>
    </>
  );
}
