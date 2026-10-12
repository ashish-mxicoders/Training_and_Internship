"use client";

// 💡 EXPLANATION (Client-side Query String Handling):
// Client Component me query parameters read karne ke liye `useSearchParams()` hook use hota hai.
// URL update karne ke liye `useRouter()` aur `usePathname()` use hota hai.
// Is tarah se page bina reload hue dynamically URL update karta hai!

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Suspense } from "react";

function SearchFilterBar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // Current query params read karna
  const currentCategory = searchParams.get("category") || "all";
  const currentSort = searchParams.get("sort") || "latest";
  const searchQuery = searchParams.get("q") || "";

  // Function to update URL params cleanly
  const updateQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // URL update without full page refresh
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleClear = () => {
    router.push(pathname);
  };

  return (
    <div className="space-y-4 rounded-xl border border-sky-200 bg-sky-50/50 p-5 dark:border-sky-900/60 dark:bg-sky-950/20">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-sky-900 dark:text-sky-300">
          Client Component: useSearchParams() & useRouter()
        </h4>
        <span className="rounded bg-sky-200/70 px-2 py-0.5 text-[11px] font-mono text-sky-900 dark:bg-sky-900/50 dark:text-sky-200">
          Interactive Hooks
        </span>
      </div>

      {/* Search Input */}
      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
          Search Keyword (?q=...):
        </label>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => updateQuery("q", e.target.value)}
          placeholder="Type to test URL query update..."
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 shadow-xs focus:border-sky-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        />
      </div>

      {/* Filter Categories */}
      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
          Category Filter (?category=...):
        </label>
        <div className="flex flex-wrap gap-2">
          {["all", "nextjs", "react", "tailwind"].map((cat) => (
            <button
              key={cat}
              onClick={() => updateQuery("category", cat === "all" ? "" : cat)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                currentCategory === cat || (cat === "all" && !searchParams.get("category"))
                  ? "bg-sky-600 text-white"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Sort Buttons */}
      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
          Sort Order (?sort=...):
        </label>
        <div className="flex gap-2">
          {["latest", "popular", "oldest"].map((s) => (
            <button
              key={s}
              onClick={() => updateQuery("sort", s)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                currentSort === s
                  ? "bg-sky-600 text-white"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Display Active URL params */}
      <div className="rounded-lg bg-white/80 p-3 text-xs font-mono text-slate-800 border border-sky-100 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-800">
        <p className="font-bold text-sky-800 dark:text-sky-300 mb-1">Current Active URL Query:</p>
        <p className="break-all text-slate-600 dark:text-slate-400">
          {searchParams.toString() ? `?${searchParams.toString()}` : "(No query parameters present)"}
        </p>
      </div>

      <button
        onClick={handleClear}
        className="text-xs text-rose-600 hover:underline dark:text-rose-400 font-medium"
      >
        Clear All Query Params ✕
      </button>
    </div>
  );
}

// Next.js best practice: Wrap useSearchParams in Suspense
export default function ClientSearchFilter() {
  return (
    <Suspense fallback={<div className="p-4 text-xs text-slate-400">Loading filters...</div>}>
      <SearchFilterBar />
    </Suspense>
  );
}
