// 💡 TOPIC 5: Rendering Modes (Static vs. Dynamic) Overview
import Link from "next/link";

export default function RenderingOverviewPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 mb-2">
          Concept 05
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
          Rendering Modes: Static vs. Dynamic
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Static Generation (Build-time Pre-rendering) vs. Dynamic Rendering (On-demand Request-time).
        </p>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Static Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900 dark:text-white">
                1. Static Generation (SSG)
              </h3>
              <span className="rounded bg-teal-100 px-2 py-0.5 text-xs font-medium text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                Pre-rendered / Cached
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              HTML build time par hi generate ho jati hai aur CDN par cache ho jati hai.
              Har user ko instant response milta hai bina kisi server computing delay ke.
            </p>

            <div className="rounded-lg bg-slate-50 p-3 text-xs font-mono text-slate-700 dark:bg-slate-800 dark:text-slate-300 mb-4">
              <p className="text-slate-400">// Route Segment Config:</p>
              <p className="font-bold text-teal-600 dark:text-teal-400">export const dynamic = &quot;force-static&quot;;</p>
              <p className="text-slate-400 mt-2">// Or ISR revalidation:</p>
              <p className="font-bold text-teal-600 dark:text-teal-400">export const revalidate = 60;</p>
            </div>
          </div>

          <Link
            href="/rendering/static"
            className="inline-flex w-full items-center justify-center rounded-lg bg-teal-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-teal-700 transition"
          >
            Open Static Generation Demo →
          </Link>
        </div>

        {/* Dynamic Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900 dark:text-white">
                2. Dynamic Rendering (SSR)
              </h3>
              <span className="rounded bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                On-Demand / Request-Time
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              HTML har ek incoming request ke aane par server par fresh render hoti hai.
              Ye real-time data, cookies, headers, ya personalized user data ke liye perfect hota hai.
            </p>

            <div className="rounded-lg bg-slate-50 p-3 text-xs font-mono text-slate-700 dark:bg-slate-800 dark:text-slate-300 mb-4">
              <p className="text-slate-400">// Route Segment Config:</p>
              <p className="font-bold text-rose-600 dark:text-rose-400">export const dynamic = &quot;force-dynamic&quot;;</p>
              <p className="text-slate-400 mt-2">// Or no-store cache:</p>
              <p className="font-bold text-rose-600 dark:text-rose-400">export const revalidate = 0;</p>
            </div>
          </div>

          <Link
            href="/rendering/dynamic"
            className="inline-flex w-full items-center justify-center rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-rose-700 transition"
          >
            Open Dynamic Rendering Demo →
          </Link>
        </div>
      </div>
    </div>
  );
}
