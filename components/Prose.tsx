import type { ReactNode } from "react";

export function Prose({ children }: { children: ReactNode }) {
  return (
    <article className="mx-auto max-w-3xl space-y-6 px-4 py-14 text-base leading-relaxed text-zinc-400 sm:px-6 [&_a]:text-synorix-cyan [&_a]:underline-offset-4 hover:[&_a]:underline [&_h2]:mt-12 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-white [&_h3]:mt-8 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-zinc-200 [&_li]:pl-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_strong]:font-semibold [&_strong]:text-zinc-200 [&_ul]:list-disc [&_ul]:pl-6">
      {children}
    </article>
  );
}
