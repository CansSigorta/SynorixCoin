import Link from "next/link";
import { NAV_LINKS, SITE } from "@/lib/site";
import { SynorixLogo } from "@/components/SynorixLogo";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-white/5 bg-black/40">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Link href="/" className="flex items-center gap-3">
              <SynorixLogo className="h-10 w-10" />
              <div>
                <span className="block text-base font-semibold text-white">
                  {SITE.name}
                </span>
                <span className="text-xs uppercase tracking-[0.2em] text-synorix-cyan/80">
                  {SITE.ticker}
                </span>
              </div>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400">
              {SITE.tagline}. Built on proven ideas—refined for speed, fees, and everyday
              usability.
            </p>
          </div>

          <nav className="grid grid-cols-2 gap-x-10 gap-y-3 sm:grid-cols-3" aria-label="Footer">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-zinc-400 transition-colors hover:text-synorix-cyan"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/5 pt-8 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {SITE.name}. All rights reserved.
          </p>
          <p className="font-mono text-[11px] text-zinc-600">{SITE.url.replace(/^https:\/\//, "")}</p>
        </div>
      </div>
    </footer>
  );
}
