import { FadeIn } from "@/components/FadeIn";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
};

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="border-b border-white/5 bg-black/20 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-3xl text-center">
        <FadeIn>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            <span className="text-gradient-cyan">{title}</span>
          </h1>
          {subtitle && (
            <p className="mt-4 text-base leading-relaxed text-zinc-400 sm:text-lg">
              {subtitle}
            </p>
          )}
        </FadeIn>
      </div>
    </div>
  );
}
