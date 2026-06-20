import Link from "next/link";
import type { ReactNode } from "react";

export function GlassCard({
  children,
  className = "",
  hover = false,
}: { children: ReactNode; className?: string; hover?: boolean }) {
  return (
    <div className={`glass ${hover ? "glass-hover" : ""} rounded-2xl ${className}`}>
      {children}
    </div>
  );
}

export function Pill({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-zinc-300 ${className}`}
    >
      {children}
    </span>
  );
}

export function LiveDot({ online }: { online: boolean }) {
  return (
    <span className="relative flex h-2 w-2">
      {online && (
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
      )}
      <span className={`relative inline-flex h-2 w-2 rounded-full ${online ? "bg-emerald-400" : "bg-zinc-500"}`} />
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = false,
}: { eyebrow?: string; title: ReactNode; subtitle?: string; center?: boolean }) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && (
        <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-synorix-cyan/80">
          {eyebrow}
        </div>
      )}
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-zinc-400">{subtitle}</p>}
    </div>
  );
}

export function StatTile({
  label,
  value,
  hint,
}: { label: string; value: ReactNode; hint?: string }) {
  return (
    <GlassCard className="p-5">
      <div className="text-xs uppercase tracking-wide text-zinc-500">{label}</div>
      <div className="mt-1 text-2xl font-bold tabular-nums text-white sm:text-3xl">{value}</div>
      {hint && <div className="mt-1 text-xs text-zinc-500">{hint}</div>}
    </GlassCard>
  );
}

export function CTAButton({
  href,
  children,
  variant = "primary",
  className = "",
}: { href: string; children: ReactNode; variant?: "primary" | "ghost"; className?: string }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all";
  const styles =
    variant === "primary"
      ? "bg-cyan-violet bg-[length:200%_200%] text-synorix-ink shadow-glow hover:animate-gradient-pan hover:shadow-glow-violet"
      : "border border-white/15 text-white hover:border-synorix-cyan/50 hover:bg-white/5";
  return (
    <Link href={href} className={`${base} ${styles} ${className}`}>
      {children}
    </Link>
  );
}
