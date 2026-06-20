import { FadeIn } from "@/components/FadeIn";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
};

export function PageHeader({ title, subtitle, eyebrow }: PageHeaderProps) {
  return (
    <div className="relative overflow-hidden border-b border-white/5 px-4 py-20 sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-mesh opacity-70" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 -top-1/2 h-full bg-hero-glow" aria-hidden />
      <div className="relative mx-auto max-w-3xl text-center">
        <FadeIn>
          {eyebrow && (
            <div className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-synorix-cyan/80">
              {eyebrow}
            </div>
          )}
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            <span className="text-gradient-iris">{title}</span>
          </h1>
          {subtitle && (
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
              {subtitle}
            </p>
          )}
        </FadeIn>
      </div>
    </div>
  );
}
