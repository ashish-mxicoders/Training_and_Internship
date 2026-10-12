import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-sm shadow-sm transition-transform group-hover:scale-105">
            08
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
              Next.js Core Concepts
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Week-2 Day-08 Learning
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 overflow-x-auto text-xs font-medium md:text-sm">
          <Link
            href="/server-vs-client"
            className="rounded-md px-3 py-1.5 text-slate-600 hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-indigo-400 transition"
          >
            Server vs Client
          </Link>
          <Link
            href="/routing"
            className="rounded-md px-3 py-1.5 text-slate-600 hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-indigo-400 transition"
          >
            Dynamic Routing
          </Link>
          <Link
            href="/search-params"
            className="rounded-md px-3 py-1.5 text-slate-600 hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-indigo-400 transition"
          >
            SearchParams
          </Link>
          <Link
            href="/data-fetching"
            className="rounded-md px-3 py-1.5 text-slate-600 hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-indigo-400 transition"
          >
            Data Fetching
          </Link>
          <Link
            href="/rendering"
            className="rounded-md px-3 py-1.5 text-slate-600 hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-indigo-400 transition"
          >
            Rendering Modes
          </Link>
        </nav>
      </div>
    </header>
  );
}
