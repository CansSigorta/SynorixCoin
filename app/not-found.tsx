import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-24 text-center">
      <p className="font-mono text-sm uppercase tracking-[0.3em] text-synorix-cyan/80">404</p>
      <h1 className="mt-4 text-2xl font-semibold text-white sm:text-3xl">Page not found</h1>
      <p className="mt-3 max-w-md text-zinc-400">
        The page you’re looking for doesn’t exist or has moved. Head back to the home page.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-synorix-cyan px-8 py-3 text-sm font-semibold text-synorix-navy shadow-glow transition hover:bg-cyan-300"
      >
        Back to home
      </Link>
    </div>
  );
}
