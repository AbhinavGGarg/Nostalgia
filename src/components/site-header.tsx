import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
      <Link
        href="/"
        className="rounded-full border border-white/15 bg-white/5 px-4 py-2 font-mono text-xs tracking-[0.2em] text-zinc-200 transition hover:border-cyan-300/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
      >
        DROP
      </Link>

      <nav className="flex items-center gap-2 text-xs text-zinc-300 sm:gap-3 sm:text-sm">
        <Link
          href="/chaos"
          className="rounded-full px-3 py-2 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
        >
          Today&apos;s Chaos
        </Link>
        <Link
          href="/manifesto"
          className="rounded-full px-3 py-2 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
        >
          Manifesto
        </Link>
      </nav>
    </header>
  );
}
