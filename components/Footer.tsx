import Link from "next/link";
import { FOOTER_GROUPS, SITE } from "@/lib/site";
import { SynorixLogo } from "@/components/SynorixLogo";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-white/5 bg-black/40">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_2fr]">
          <div className="max-w-sm">
            <Link href="/" className="inline-flex max-w-[200px]">
              <SynorixLogo className="h-14 max-h-14 w-auto" />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400">
              An independent SHA-256 blockchain you can own, mine, and use. Non-custodial by
              design — your keys, your coins.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {FOOTER_GROUPS.map((group) => (
              <nav key={group.heading} aria-label={group.heading}>
                <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  {group.heading}
                </div>
                <ul className="space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      {"external" in link && link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-zinc-400 transition-colors hover:text-synorix-cyan"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-sm text-zinc-400 transition-colors hover:text-synorix-cyan"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/5 pt-8 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {SITE.name}. Open source. No custody, no gatekeepers.</p>
          <p className="font-mono text-[11px] text-zinc-600">{SITE.url.replace(/^https:\/\//, "")}</p>
        </div>
      </div>
    </footer>
  );
}
