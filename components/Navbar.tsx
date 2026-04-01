"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_LINKS, SITE } from "@/lib/site";
import { SynorixLogo } from "@/components/SynorixLogo";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-synorix-ink/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="group flex items-center rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-synorix-cyan/60"
          aria-label={`${SITE.name} home`}
        >
          <SynorixLogo className="h-10 max-h-10 w-auto max-w-[140px] shrink-0 transition-transform group-hover:scale-[1.02] sm:max-w-[160px]" />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "text-synorix-cyan"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-lg bg-white/5 ring-1 ring-synorix-cyan/20"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {link.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-zinc-200 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Toggle menu</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            {open ? (
              <path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-white/5 lg:hidden"
            aria-label="Mobile"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`rounded-lg px-3 py-3 text-sm font-medium ${
                      active
                        ? "bg-white/5 text-synorix-cyan ring-1 ring-synorix-cyan/25"
                        : "text-zinc-300 hover:bg-white/5"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
